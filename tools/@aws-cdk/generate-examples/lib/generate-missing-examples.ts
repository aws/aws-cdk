import * as path from 'path';
import { TypeSystem } from 'jsii-reflect';
import { generateClassExample } from './generate';

export async function generateMissingExamples(assemblyLocations: string[]) {
  for (const assemblyLocation of assemblyLocations) {
    const typesystem = new TypeSystem();
    await typesystem.load(path.join(assemblyLocation, '.jsii'));
    for (const aClass of typesystem.classes) {
      const classType = aClass.spec;
      const a = generateClassExample(typesystem, classType).join('');
      console.log(a);
    }
  }
}