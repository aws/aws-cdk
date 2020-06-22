import * as fs from 'fs';
import * as YAML from 'yaml';

export function readJsonSync(filePath: string): any {
  const fileContents = fs.readFileSync(filePath);
  return JSON.parse(fileContents.toString());
}

export function readYamlSync(filePath: string): any {
  const fileContents = fs.readFileSync(filePath);
  return YAML.parse(fileContents.toString());
}