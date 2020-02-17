import * as fs from 'fs';

export function readJsonSync(filePath: string): any {
  const fileContents = fs.readFileSync(filePath);
  return JSON.parse(fileContents.toString());
}
