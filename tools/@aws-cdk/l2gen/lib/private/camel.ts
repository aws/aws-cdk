import camelcase from 'camelcase';

export function toCamelCase(...args: string[]) {
  return camelcase(args);
}

export function toPascalCase(...args: string[]) {
  return camelcase(args, { pascalCase: true });
}