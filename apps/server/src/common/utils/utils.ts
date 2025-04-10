import path from 'node:path';

export function resolve(dir: string) {
  return path.resolve(__dirname, dir);
}

export function isActive(value: any) {
  if (!value) {
    return true;
  }
  return value === 'true' ? true : false;
}

export function transformBoolean(value: unknown, defaultValue: boolean = true) {
  if (value !== undefined) {
    return defaultValue;
  }
  return value;
}
