import { promises as fs } from 'fs';
import { TypeSystem } from 'jsii-reflect';

// This import should come from @jsii/spec. Replace when that is possible.
import { LanguageTablet, TranslatedSnippet, Rosetta, UnknownSnippetMode, TargetLanguage, typeScriptSnippetFromSource, SnippetLocation, SnippetParameters, TypeScriptSnippet } from 'jsii-rosetta';
import { insertExample, replaceAssembly } from './assemblies';
import { generateClassAssignment } from './generate';

const COMMENT_WARNING = [
  '// The code below shows an example of how to instantiate this type.',
  '// The values are placeholders you should change.',
];

export interface GenerateExamplesOptions {
  readonly cacheFromTablet?: string;
  readonly cacheToTablet?: string;
  readonly directory?: string;
  readonly bail?: boolean;
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

  // load all assemblies into typesystem
  for (const assemblyLocation of assemblyLocations) {
    if (!(await statFile(assemblyLocation))?.isDirectory) {
      throw new Error(`Assembly location not a directory: ${assemblyLocation}`);
    }

    const assembly = await typesystem.load(assemblyLocation);

    const documentableClasses = assembly.classes.filter(c => !c.docs.example);
    let documentedClasses = 0;

    // eslint-disable-next-line no-console
    console.log(`${assembly.name}: ${documentableClasses.length} classes to document`);

    if (documentableClasses.length === 0) { continue; }

    const failed = [];
    for (const classType of documentableClasses) {
      if (rosetta.diagnostics.length > 0 && options.bail) {
        break;
      }

      const example = generateClassAssignment(classType);
      if (!example) {
        failed.push(classType.name);
        continue;
      }

      // To successfully compile, we need to generate the right 'Construct' import
      const constructImport = assembly.dependencies.some(d => d.assembly.name === '@aws-cdk/core')
        ? 'import { Construct } from "@aws-cdk/core";'
        : 'import { Construct } from "constructs";';

      const visibleSource = [
        ...COMMENT_WARNING,
        ...example.renderDeclarations(),
        '',
        example.renderCode(),
      ].join('\n').trimLeft();

      const completeSource = [
        ...COMMENT_WARNING,
        ...example.renderDeclarations(),
        '',
        '/// !hide',
        constructImport,
        'class MyConstruct extends Construct {',
        'constructor(scope: Construct, id: string) {',
        'super(scope, id);',
        '/// !show',
        example.renderCode(),
        '/// !hide',
        '} }',
      ].join('\n').trimLeft();
      const location: SnippetLocation = { api: { api: 'type', fqn: classType.fqn }, field: { field: 'example' } };

      // FIXME: unfortunately no good way to build this on the spot
      const tsSnippet: TypeScriptSnippet = {
        ...typeScriptSnippetFromSource(visibleSource, location, true, {
          [SnippetParameters.$COMPILATION_DIRECTORY]: options.directory ?? process.cwd(),
        }),
        completeSource,
      };

      const oneTranslation = rosetta.translateSnippet(tsSnippet, TargetLanguage.PYTHON);

      if (rosetta.diagnostics.length > 0 && options.bail) {
        // eslint-disable-next-line no-console
        console.log(completeSource);
        break;
      }

      // The following is because the API is silly. `translateExample` will give us back
      // one Translation, but `insertExample` needs a TranslatedSnippet (which it had, but
      // didn't return). Create an equivalent one.
      const snippet = TranslatedSnippet.fromTypeScript(tsSnippet, oneTranslation?.didCompile);
      insertExample(snippet, classType.spec);
      documentedClasses += 1;
    }

    // eslint-disable-next-line no-console
    console.log([
      `${assembly.name}: annotated ${documentedClasses} classes`,
      ...(failed.length > 0 ? [`failed: ${failed.join(', ')}`] : []),
    ].join(', '));

    await replaceAssembly(assembly.spec, assemblyLocation);
  }
  if (options.cacheToTablet) {
    // Copy the translations we just did from the 'rosetta' object to the
    // tablet file we're saving.
    // eslint-disable-next-line no-console
    for (const addedKey of rosetta.liveTablet.snippetKeys) {
      const snip = rosetta.liveTablet.tryGetSnippet(addedKey);
      if (!snip) { throw new Error(`Does not exist: ${addedKey}`); }
      cacheToTablet?.addSnippet(snip);
    }
    await cacheToTablet.save(options.cacheToTablet);
  }

  if (rosetta.diagnostics.length > 0) {
    for (const d of rosetta.diagnostics) {
      // eslint-disable-next-line no-console
      console.error(d.formattedMessage);
    }
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