import { Names } from 'aws-cdk-lib/core';
import { IConstruct } from 'constructs';

export function generateUniqueId(context: IConstruct): string {
  const name = Names.uniqueId(context);
  if (name.length > 100) {
    return name.substring(0, 50) + name.substring(name.length - 50);
  }
  return name;
}
