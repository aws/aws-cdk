import { Suggestions, CfnSchema } from '@aws-cdk/l2gen';
import { AppState } from './app-state';
import { TypeMapper } from '@aws-cdk/l2gen/lib/mapping/type-mappings';

export async function loadInitialAppState(directory: string): Promise<AppState> {
  const files = (await Neutralino.filesystem.readDirectory(directory));

  const schemaFiles = files.filter(name => name.entry.endsWith('.schema.json'));

  const schemas = await Promise.all(schemaFiles.map(async (file) => {
    const contents = await Neutralino.filesystem.readFile(`${directory}/${file.entry}`);
    return new CfnSchema(JSON.parse(contents));
  }));

  return {
    typeMapper: new TypeMapper(schemas),
    mappings: new Suggestions(...schemas).findTypeMappings(),
  };
}