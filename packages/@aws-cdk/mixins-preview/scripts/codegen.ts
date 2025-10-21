import * as fs from 'node:fs';
import type { SpecDatabase } from '@aws-cdk/service-spec-types';
import { TypeScriptRenderer } from '@cdklabs/typewriter';
import type { GenerateModuleMap, GenerateOutput, GenerateOptions as Spec2CdkOptions } from '@aws-cdk/spec2cdk';
import { loadPatchedSpec, util } from '@aws-cdk/spec2cdk';
import { AstBuilder } from '@aws-cdk/spec2cdk/lib/cdk/ast';
import { MixinAstBuilder } from './ast';

main().catch(e => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exitCode = 1;
});

async function main() {
  await generateAll({
    outputPath: process.cwd(),
  });
}

type GenerateOptions = Pick<Spec2CdkOptions, 'importLocations' | 'outputPath' | 'clearOutput' | 'debug'>;

async function generateAll(options: GenerateOptions) {
  const db = await loadPatchedSpec();
  const services = await db.all('service');
  const modules: GenerateModuleMap = {};

  for (const service of services) {
    modules[service.name] = {
      services: [{ namespace: service.cloudFormationNamespace }],
    };
  }

  return generator(db, modules, options);
}

async function generator(
  db: SpecDatabase,
  modules: GenerateModuleMap,
  options: Spec2CdkOptions,
): Promise<{}> {
  const timeLabel = '🐢  Completed in';
  util.log.time(timeLabel);
  util.log.debug('Options', options);
  const { clearOutput, outputPath = process.cwd() } = options;
  // const filePatterns = ensureFilePatterns(options.filePatterns);

  const renderer = new TypeScriptRenderer();

  // store results in a map of modules
  const moduleMap: GenerateOutput['modules'] = {};

  // Clear output if requested
  if (clearOutput) {
    fs.rmSync(outputPath, {
      force: true,
      recursive: true,
    });
  }

  // Go through the module map
  util.log.info('Generating %i modules...', Object.keys(modules).length);
  for (const [moduleName, moduleOptions] of Object.entries(modules)) {
    const { moduleImportLocations: importLocations = options.importLocations, services } = moduleOptions;
    moduleMap[moduleName] = util.queryDb.getServicesByGenerateServiceRequest(db, services).map(([req, s]) => {
      util.log.debug(moduleName, s.name, 'ast');
      const ast = MixinAstBuilder.forService(s, {
        db,
        importLocations,
        nameSuffix: req.suffix,
        deprecated: req.deprecated,
      });

      util.log.debug(moduleName, s.name, 'render');
      const writer = new util.TsFileWriter(outputPath, renderer, {
        ['moduleName']: moduleName,
        ['serviceName']: ast.module.service.toLowerCase(),
        ['serviceShortName']: ast.module.shortName.toLowerCase(),
      });

      // Resources
      writer.write(ast.module, ({ serviceShortName }) => `lib/property-mixins/${serviceShortName}.generated.ts`);

      return {
        module: ast,
        options: moduleOptions,
        resources: ast.resources,
        outputFiles: writer.outputFiles,
      };
    });
  }

  const result = {
    modules: moduleMap,
    resources: Object.values(moduleMap).flat().map(pick('resources')).reduce(mergeObjects, {}),
    outputFiles: Object.values(moduleMap).flat().flatMap(pick('outputFiles')),
  };

  util.log.info('Summary:');
  util.log.info('  Service files:  %i', Object.values(moduleMap).flat().flatMap(pick('module')).length);
  util.log.info('  Resources:      %i', Object.keys(result.resources).length);
  util.log.timeEnd(timeLabel);

  return result;
}

function pick<T>(property: keyof T) {
  type x = typeof property;
  return (obj: Record<x, any>): any => {
    return obj[property];
  };
}

function mergeObjects<T>(all: T, res: T) {
  return {
    ...all,
    ...res,
  };
}
