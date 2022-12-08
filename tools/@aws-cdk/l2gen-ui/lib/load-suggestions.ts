import { Suggestions, SchemaParser } from '@aws-cdk/l2gen';

export async function loadSuggestions(directory: string) {
  const files = (await Neutralino.filesystem.readDirectory(directory));

  const schemaFiles = files.filter(name => name.entry.endsWith('.schema.json'));

  const promises = schemaFiles.map(async (file) => {
    const contents = await Neutralino.filesystem.readFile(`${directory}/${file.entry}`);
    const parser = new SchemaParser(JSON.parse(contents));
    const suggestions = new Suggestions(parser);
    return suggestions.findTypeMappings();
  });

  return (await Promise.all(promises)).flatMap(x => x);
}