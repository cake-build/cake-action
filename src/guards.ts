export function isError(value: unknown): value is Error {
  return value instanceof Error;
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}
