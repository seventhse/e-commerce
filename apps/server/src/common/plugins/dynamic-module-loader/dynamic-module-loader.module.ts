/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
import { type DynamicModule, Module } from '@nestjs/common';
import {
  DynamicModuleLoaderService,
  type DynamicModuleLoaderOptions,
} from './dynamic-module-loader.service';

export interface DynamicModuleLoaderModuleOptions
  extends DynamicModuleLoaderOptions {
  /**
   * Whether to make the module global
   */
  isGlobal?: boolean;
}

@Module({
  providers: [DynamicModuleLoaderService],
  exports: [DynamicModuleLoaderService],
})
export class DynamicModuleLoaderModule {
  /**
   * Register the dynamic module loader
   */
  static register(
    options: DynamicModuleLoaderModuleOptions = {},
  ): DynamicModule {
    const providers = [
      {
        provide: 'DYNAMIC_MODULE_LOADER_OPTIONS',
        useValue: options,
      },
      DynamicModuleLoaderService,
    ];

    const module: DynamicModule = {
      module: DynamicModuleLoaderModule,
      providers,
      exports: [DynamicModuleLoaderService],
    };

    if (options.isGlobal) {
      module.global = true;
    }

    return module;
  }

  /**
   * Asynchronously register the dynamic module loader
   */
  static async registerAsync(
    options: DynamicModuleLoaderModuleOptions = {},
  ): Promise<DynamicModule> {
    const { isGlobal, ...loaderOptions } = options;

    // Scan for modules
    const service = new DynamicModuleLoaderService();
    const moduleResults = await service.scanAndLoad(loaderOptions);

    // Get successfully loaded modules
    const loadedModules = moduleResults
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      .filter((result) => result.loaded)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      .map((result) => result.module);

    const module: DynamicModule = {
      module: DynamicModuleLoaderModule,
      imports: loadedModules as any[],
      providers: [
        {
          provide: 'DYNAMIC_MODULE_LOADER_OPTIONS',
          useValue: options,
        },
        {
          provide: 'DYNAMIC_MODULE_LOAD_RESULTS',
          useValue: moduleResults,
        },
        DynamicModuleLoaderService,
      ],
      exports: [DynamicModuleLoaderService],
    };

    if (isGlobal) {
      module.global = true;
    }

    return module;
  }
}
