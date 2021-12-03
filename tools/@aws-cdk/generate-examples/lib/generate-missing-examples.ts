/* eslint-disable no-console */
import { promises as fs } from 'fs';
import { Assembly, ClassType, InterfaceType, TypeSystem } from 'jsii-reflect';

// This import should come from @jsii/spec. Replace when that is possible.
import { LanguageTablet, RosettaTranslator, SnippetLocation, SnippetParameters, TypeScriptSnippet, typeScriptSnippetFromCompleteSource } from 'jsii-rosetta';
import { insertExample, replaceAssembly, addFixtureToRosetta } from './assemblies';
import { generateAssignmentStatement } from './generate';

const COMMENT_WARNING = [
  '// The code below shows an example of how to instantiate this type.',
  '// The values are placeholders you should change.',
];

export const FIXTURE_NAME = '_generated';

export interface GenerateExamplesOptions {
  readonly cacheFromTablet?: string;
  readonly appendToTablet?: string;
  readonly directory?: string;
  readonly strict?: boolean;
}

export async function generateMissingExamples(assemblyLocations: string[], options: GenerateExamplesOptions) {
  const typesystem = new TypeSystem();

  // load all assemblies into typesystem
  const loadedAssemblies = await Promise.all(assemblyLocations.map(async (assemblyLocation) => {
    if (!(await statFile(assemblyLocation))?.isDirectory) {
      throw new Error(`Assembly location not a directory: ${assemblyLocation}`);
    }

    return { assemblyLocation, assembly: await typesystem.load(assemblyLocation, { validate: false }) };
  }));

  const snippets = loadedAssemblies.flatMap(({ assembly, assemblyLocation }) => {
    // Classes and structs
    const documentableTypes: Array<ClassType | InterfaceType> = [];
    for (const m of [assembly, ...assembly.allSubmodules]) {
      documentableTypes.push(...m.classes.filter(c => !c.docs.example));
      documentableTypes.push(...m.interfaces.filter(c => !c.docs.example && c.datatype));
    }

    // add fixture to assembly's rosetta folder if it doesn't exist yet
    const fixture = generateFixture(assembly);
    addFixtureToRosetta(
      assemblyLocation,
      `${FIXTURE_NAME}.ts-fixture`,
      fixture,
    );

    console.log(`${assembly.name}: ${documentableTypes.length} classes to document`);
    if (documentableTypes.length === 0) { return []; }

    const failed = new Array<string>();
    const generatedSnippets = documentableTypes.flatMap((classType) => {
      const example = generateAssignmentStatement(classType);
      if (!example) {
        failed.push(classType.name);
        return [];
      }

      // To successfully compile, we need to generate the right 'Construct' import
      const completeSource = [
        ...COMMENT_WARNING,
        ...example.renderDeclarations(),
        '',
        '/// !hide',
        correctConstructImport(assembly),
        'class MyConstruct extends Construct {',
        'constructor(scope: Construct, id: string) {',
        'super(scope, id);',
        '/// !show',
        example.renderCode(),
        '/// !hide',
        '} }',
      ].join('\n').trimLeft();
      const location: SnippetLocation = { api: { api: 'type', fqn: classType.fqn }, field: { field: 'example' } };

      const tsSnippet: TypeScriptSnippet = typeScriptSnippetFromCompleteSource(
        completeSource,
        location,
        true,
        {
          [SnippetParameters.$COMPILATION_DIRECTORY]: options.directory ?? process.cwd(),
          [SnippetParameters.$PROJECT_DIRECTORY]: assemblyLocation,
        });

      insertExample(tsSnippet, classType.spec);
      return [tsSnippet];
    });

    console.log([
      `${assembly.name}: annotated ${generatedSnippets.length} classes`,
      ...(failed.length > 0 ? [`failed: ${failed.join(', ')}`] : []),
    ].join(', '));

    return generatedSnippets;
  });

  const rosetta = new RosettaTranslator({
    includeCompilerDiagnostics: true,
    assemblies: loadedAssemblies.map(({ assembly }) => assembly.spec),
  });

  if (options.cacheFromTablet) {
    await rosetta.loadCache(options.cacheFromTablet);
  }

  // Will mutate the 'snippets' array
  const { remaining } = rosetta.readFromCache(snippets);

  console.log(`Translating ${remaining.length} snippets`);
  const results = await rosetta.translateAll(remaining);
  if (results.diagnostics.length > 0) {
    for (const diag of results.diagnostics) {
      console.log(diag.formattedMessage);
    }

    if (options.strict) {
      process.exitCode = 1;
    }
  }

  // Copy everything from the rosetta tablet into our output tablet
  if (options.appendToTablet) {
    console.log(`Appending to ${options.appendToTablet}`);
    const outputTablet = new LanguageTablet();
    if ((await statFile(options.appendToTablet)) !== undefined) {
      await outputTablet.load(options.appendToTablet);
    }

    for (const key of rosetta.tablet.snippetKeys) {
      const snip = rosetta.tablet.tryGetSnippet(key);
      if (snip) {
        outputTablet.addSnippet(snip);
      }
    }

    await outputTablet.save(options.appendToTablet);
  }

  console.log(`Saving ${loadedAssemblies.length} assemblies`);
  await Promise.all((loadedAssemblies).map(({ assembly, assemblyLocation }) =>
    replaceAssembly(assembly.spec, assemblyLocation)));
}

async function statFile(fileName: string) {
  try {
    return await fs.stat(fileName);
  } catch (e) {
    if (e.code === 'ENOENT') { return undefined; }
    throw e;
  }
}

function correctConstructImport(assembly: Assembly) {
  if (assembly.name === 'monocdk') {
    return 'import { Construct } from "monocdk";';
  }

  if (assembly.dependencies.some(d => d.assembly.name === '@aws-cdk/core')) {
    return 'import { Construct } from "@aws-cdk/core";';
  }

  return 'import { Construct } from "constructs";';
}

function generateFixture(assembly: Assembly): string {
  return [
    correctConstructImport(assembly),
    'class MyConstruct extends Construct {',
    'constructor(scope: Construct, id: string) {',
    'super(scope, id);',
    '/// here',
    '} }',
  ].join('\n').trimLeft();
}
