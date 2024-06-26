import { Names } from 'aws-cdk-lib/core';

export function generateUniqueId(context: any): string {
  const name = Names.uniqueId(context);
  if (name.length > 100) {
    return name.substring(0, 50) + name.substring(name.length - 50);
  }
  return name;
}
