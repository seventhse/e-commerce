/* eslint-disable*/
import { Injectable, type Type } from '@nestjs/common';
import type { DynamicModule as NestDynamicModule } from '@nestjs/common/interfaces';
import * as fs from 'fs';
import * as path from 'path';
import {
  type DynamicModuleOptions,
  DYNAMIC_MODULE_METADATA,
} from './dynamic-module.decorator';
import { LoggerService } from '~/common/logger/logger.service';

export interface ModuleLoadResult {
  name: string;
  module: Type<any> | NestDynamicModule | null;
  loaded: boolean;
  error?: string;
}

export interface DynamicModuleLoaderOptions {
  /**
   * Base directory to search for modules
   */
  basePath?: string;

  /**
   * Glob patterns to include when searching for modules
   */
  include?: string[];

  /**
   * Glob patterns to exclude when searching for modules
   */
  exclude?: string[];

  /**
   * Whether to recursively search subdirectories
   */
  recursive?: boolean;

  /**
   * Whether to automatically load discovered modules
   */
  autoLoad?: boolean;

  /**
   * Whether to load modules in parallel
   */
  parallel?: boolean;

  /**
   * Custom module filter function
   */
  moduleFilter?: (modulePath: string) => boolean;
}

@Injectable()
export class DynamicModuleLoaderService {
  private logger = new LoggerService(DynamicModuleLoaderService.name);
  private loadedModules: Map<string, Type<any> | NestDynamicModule> = new Map();
  private moduleRegistry: Map<string, DynamicModuleOptions> = new Map();

  /**
   * Scan directories for modules and optionally load them
   */
  async scanAndLoad(
    options: DynamicModuleLoaderOptions = {},
  ): Promise<ModuleLoadResult[]> {
    const {
      basePath = path.join(process.cwd(), 'src', 'modules'),
      include = ['**/*.module.{ts,js}'],
      exclude = [
        '**/*.spec.{ts,js}',
        '**/*.test.{ts,js}',
        '**/node_modules/**',
      ],
      recursive = true,
      autoLoad = true,
      parallel = true,
    } = options;

    this.logger.log(`Scanning for modules in ${basePath}`);

    // Find module files
    const moduleFiles = this.findModuleFiles(
      basePath,
      include,
      exclude,
      recursive,
    );
    this.logger.log(`Found ${moduleFiles.length} potential module files`);

    // Load module metadata
    const moduleMetadata = await this.loadModuleMetadata(
      moduleFiles,
      options.moduleFilter,
    );

    // Sort modules by dependencies and weight
    const sortedModules = this.sortModulesByDependencies(moduleMetadata);

    // Load modules if autoLoad is true
    let results: ModuleLoadResult[] = [];

    if (autoLoad) {
      if (parallel) {
        results = await Promise.all(
          sortedModules.map((meta) => this.loadModule(meta)),
        );
      } else {
        for (const meta of sortedModules) {
          results.push(await this.loadModule(meta));
        }
      }
    } else {
      results = sortedModules.map((meta) => ({
        name: meta.name,
        module: null,
        loaded: false,
      }));
    }

    return results;
  }

  /**
   * Load a specific module by name
   */
  async loadModuleByName(name: string): Promise<ModuleLoadResult> {
    const meta = this.moduleRegistry.get(name);
    if (!meta) {
      return {
        name,
        module: null,
        loaded: false,
        error: `Module ${name} not found in registry`,
      };
    }

    return this.loadModule(meta);
  }

  /**
   * Get all loaded modules
   */
  getLoadedModules(): Map<string, Type<any> | NestDynamicModule> {
    return this.loadedModules;
  }

  /**
   * Get module registry
   */
  getModuleRegistry(): Map<string, DynamicModuleOptions> {
    return this.moduleRegistry;
  }

  /**
   * Find module files in the specified directory
   */
  private findModuleFiles(
    basePath: string,
    include: string[],
    exclude: string[],
    recursive: boolean,
  ): string[] {
    const readDirRecursive = (dir: string) => {
      let result: string[] = [];
      if (!fs.existsSync(dir)) {
        this.logger.warn(`Directory ${dir} does not exist`);
        return result;
      }

      const files = fs.readdirSync(dir);

      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory() && recursive) {
          result.push(...readDirRecursive(filePath));
        } else if (stat.isFile()) {
          // Check if file matches include patterns and doesn't match exclude patterns
          const relativePath = path.relative(basePath, filePath);

          const matchesInclude = include.some((pattern) =>
            this.matchGlobPattern(relativePath, pattern),
          );

          const matchesExclude = exclude.some((pattern) =>
            this.matchGlobPattern(relativePath, pattern),
          );

          if (matchesInclude && !matchesExclude) {
            result.push(filePath);
          }
        }
      }

      return result;
    };

    return readDirRecursive(basePath);
  }

  /**
   * Simple glob pattern matching
   */
  private matchGlobPattern(filePath: string, pattern: string): boolean {
    // Convert glob pattern to regex
    const regexPattern = pattern
      .replace(/\./g, '\\.')
      .replace(/\*\*/g, '.*')
      .replace(/\*/g, '[^/]*')
      .replace(/\?/g, '.')
      .replace(/\{([^}]+)\}/g, '($1)') // Convert {a,b,c} to (a,b,c)
      .replace(/,/g, '|');

    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(filePath);
  }

  /**
   * Load module metadata from files
   */
  private async loadModuleMetadata(
    moduleFiles: string[],
    moduleFilter?: (modulePath: string) => boolean,
  ): Promise<DynamicModuleOptions[]> {
    const moduleMetadata: DynamicModuleOptions[] = [];

    for (const filePath of moduleFiles) {
      if (moduleFilter && !moduleFilter(filePath)) {
        continue;
      }

      try {
        // Import the module
        const moduleExports = await import(filePath);

        // Find the module class (usually the default export or named export ending with 'Module')
        const moduleClass = this.findModuleClass(moduleExports);

        if (moduleClass) {
          // Get dynamic module metadata
          const metadata = Reflect.getMetadata(
            DYNAMIC_MODULE_METADATA,
            moduleClass,
          );

          if (metadata) {
            this.moduleRegistry.set(metadata.name, {
              ...metadata,
              _moduleClass: moduleClass,
              _filePath: filePath,
            });

            moduleMetadata.push(metadata);
          }
        }
      } catch (error) {
        this.logger.error(`Error loading module from ${filePath}`, error.stack);
      }
    }

    return moduleMetadata;
  }

  /**
   * Find the module class in the exported objects
   */
  private findModuleClass(moduleExports: any): Type<any> | null {
    // Check if there's a default export
    if (moduleExports.default && this.isNestModule(moduleExports.default)) {
      return moduleExports.default;
    }

    // Look for named exports ending with 'Module'
    for (const key of Object.keys(moduleExports)) {
      if (key.endsWith('Module') && this.isNestModule(moduleExports[key])) {
        return moduleExports[key];
      }
    }

    return null;
  }

  /**
   * Check if an object is a NestJS module
   */
  private isNestModule(obj: any): boolean {
    // return typeof obj === 'function' && !!Reflect.getMetadata('__module', obj);
    return typeof obj === 'function';
  }

  /**
   * Sort modules by dependencies and weight
   */
  private sortModulesByDependencies(
    modules: DynamicModuleOptions[],
  ): DynamicModuleOptions[] {
    // Create a copy to avoid modifying the original array
    const result = [...modules];

    // Sort by weight (higher weight = loaded later)
    result.sort((a, b) => (a.weight || 0) - (b.weight || 0));

    // Then sort by dependencies
    const moduleMap = new Map<string, DynamicModuleOptions>();
    result.forEach((module) => moduleMap.set(module.name, module));

    const visited = new Set<string>();
    const temp = new Set<string>();
    const order: DynamicModuleOptions[] = [];

    const visit = (moduleName: string) => {
      if (temp.has(moduleName)) {
        throw new Error(
          `Circular dependency detected for module ${moduleName}`,
        );
      }

      if (visited.has(moduleName)) {
        return;
      }

      const module = moduleMap.get(moduleName);
      if (!module) {
        return;
      }

      temp.add(moduleName);

      if (module.dependencies) {
        for (const dep of module.dependencies) {
          visit(dep);
        }
      }

      temp.delete(moduleName);
      visited.add(moduleName);
      order.push(module);
    };

    for (const module of result) {
      if (!visited.has(module.name)) {
        visit(module.name);
      }
    }

    return order;
  }

  /**
   * Load a module
   */
  private async loadModule(
    meta: DynamicModuleOptions,
  ): Promise<ModuleLoadResult> {
    let fullMeta = this.moduleRegistry.get(meta.name);
    if (!fullMeta || !fullMeta._moduleClass) {
      return {
        name: fullMeta!.name,
        module: null,
        loaded: false,
        error: 'Module class not found',
      };
    }

    try {
      if (fullMeta.enabled === false) {
        this.logger.log(`Skipping disabled module: ${fullMeta.name}`);
        return {
          name: fullMeta.name,
          module: fullMeta._moduleClass as any,
          loaded: false,
        };
      }

      this.logger.log(`Loading module: ${fullMeta.name}`);

      // Check if the module has a forRoot or register method
      let moduleInstance = fullMeta._moduleClass as
        | NestDynamicModule
        | Type<any>;

      if (typeof (fullMeta._moduleClass as any)?.forRoot === 'function') {
        moduleInstance = (fullMeta._moduleClass as any).forRoot();
      } else if (
        typeof (fullMeta._moduleClass as any).register === 'function'
      ) {
        moduleInstance = (fullMeta._moduleClass as any).register();
      }

      this.loadedModules.set(fullMeta.name, moduleInstance);

      return {
        name: fullMeta.name,
        module: moduleInstance,
        loaded: true,
      };
    } catch (error) {
      this.logger.error(`Error loading module ${fullMeta.name}`, error.stack);
      return {
        name: fullMeta.name as string,
        module: null,
        loaded: false,
        error: error.message,
      };
    }
  }
}
