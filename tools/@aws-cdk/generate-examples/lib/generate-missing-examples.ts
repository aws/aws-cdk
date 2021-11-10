import { promises as fs } from 'fs';
import { Assembly, TypeSystem } from 'jsii-reflect';

// This import should come from @jsii/spec. Replace when that is possible.
import { LanguageTablet, TranslatedSnippet, Rosetta, UnknownSnippetMode, TargetLanguage, ApiLocation } from 'jsii-rosetta';
import { insertExample, replaceAssembly } from './assemblies';
import { generateClassAssignment } from './generate';

const COMMENT_WARNING = [
  '// The code below shows an example of how to instantiate this type.',
  '// The values are placeholders you should change.',
];

export interface GenerateExamplesOptions {
  readonly cacheFromTablet?: string;
  readonly cacheToTablet?: string;
}

export async function generateMissingExamples(assemblyLocations: string[], options: GenerateExamplesOptions) {
  const cacheToTablet = new LanguageTablet();
  if (options.cacheToTablet && await statFile(options.cacheToTablet)) {
    await cacheToTablet.load(options.cacheToTablet);
  }

  const rosetta = new Rosetta({
    includeCompilerDiagnostics: true,
    unknownSnippets: UnknownSnippetMode.TRANSLATE,
  });
  if (options.cacheFromTablet) {
    rosetta.addTablet(await LanguageTablet.fromFile(options.cacheFromTablet));
  }

  const typesystem = new TypeSystem();
  const assemblies: Assembly[] = [];

  // load all assemblies into typesystem
  for (const assemblyLocation of assemblyLocations) {
    if (!(await statFile(assemblyLocation))?.isDirectory) {
      throw new Error(`Assembly location not a directory: ${assemblyLocation}`);
    }

    const assembly = await typesystem.load(assemblyLocation);

    const documentableClasses = assembly.classes.filter(c => !c.docs.example);

    // eslint-disable-next-line no-console
    console.log(`${assembly.name}: ${documentableClasses.length} classes to document`);

    if (documentableClasses.length === 0) { continue; }

    const failed = [];
    for (const classType of documentableClasses) {
      const example = generateClassAssignment(classType);
      if (!example) {
        failed.push(classType.name);
        continue;
      }

      const source = [...COMMENT_WARNING, '\n', example].join('\n');
      const apiLocation: ApiLocation = { api: 'type', fqn: classType.fqn };

      rosetta.translateExample(
        apiLocation,
        source,
        TargetLanguage.PYTHON,
        true,
        assemblyLocation,
      );

      // The following is because the API is silly. `translateExample` will give us back
      // one Translation, but `insertExample` needs a TranslatedSnippet (which it had, but
      // didn't return). Create an equivalent one.
      const snippet = TranslatedSnippet.fromTypeScript({
        location: { api: apiLocation, field: { field: 'example' } },
        visibleSource: source,
      });
      insertExample(snippet, classType.spec, cacheToTablet);
    }

    // eslint-disable-next-line no-console
    console.log([
      `${assembly.name}: annotated ${documentableClasses.length - failed.length} classes`,
      ...(failed.length > 0 ? [`failed: ${failed.join(', ')}`] : []),
    ].join(', '));

    await replaceAssembly(assembly.spec, assemblyLocation);
  }
  // update all assemblies
  for (let i = 0; i < assemblies.length; i++) {
  }

  if (options.cacheToTablet) {
    // Copy the translations we just did from the 'rosetta' object to the
    // tablet file we're saving.
    for (const addedKey in rosetta.liveTablet.snippetKeys) {
      const snip = rosetta.liveTablet.tryGetSnippet(addedKey);
      if (snip) {
        cacheToTablet?.addSnippet(snip);
      }
    }
    await cacheToTablet.save(options.cacheToTablet);
  }
}

async function statFile(fileName: string) {
  try {
    return await fs.stat(fileName);
  } catch (e) {
    if (e.code === 'ENOENT') { return undefined; }
    throw e;
  }
}