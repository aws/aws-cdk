import * as fs from 'fs';
import * as yaml_cfn from '@aws-cdk/yaml-cfn';

export function readJsonSync(filePath: string): any {
  const fileContents = fs.readFileSync(filePath);
  return JSON.parse(fileContents.toString());
}

export function readYamlSync(filePath: string): any {
  const fileContents = fs.readFileSync(filePath);
  return yaml_cfn.deserialize(fileContents.toString());
}
