import * as fs from 'fs';
import * as YAML from 'yaml';
import { shortForms } from './short-form-tags.js';

export function readJsonSync(filePath: string): any {
  const fileContents = fs.readFileSync(filePath);
  return JSON.parse(fileContents.toString());
}

export function readYamlSync(filePath: string): any {
  const fileContents = fs.readFileSync(filePath);
  YAML.defaultOptions.customTags = shortForms;
  return YAML.parse(fileContents.toString());
}
