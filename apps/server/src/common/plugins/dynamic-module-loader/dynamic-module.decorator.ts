import { SetMetadata } from '@nestjs/common';

export const DYNAMIC_MODULE_METADATA = 'dynamic_module';

export interface DynamicModuleOptions extends Record<string, unknown> {
  name: string;
  description?: string;
  enabled?: boolean;
  dependencies?: string[];
  weight?: number; // For controlling load order
}

export const DynamicModule = (options: DynamicModuleOptions) => {
  return SetMetadata(DYNAMIC_MODULE_METADATA, options);
};
