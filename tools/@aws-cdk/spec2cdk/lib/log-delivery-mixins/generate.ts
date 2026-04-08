import type { GenerateModuleMap, GenerateOptions as Spec2CdkOptions } from '../generate';
import { generate, loadPatchedSpec } from '../generate';
import { LogsDeliveryBuilder } from './builder';
import { type GeneratorResult, loadModuleMap, type ModuleMap } from '../module-topology';
import type { PackageBaseNames } from '../util/jsii';

export interface LogsGenerateOptions extends Pick<Spec2CdkOptions<typeof LogsDeliveryBuilder>, 'outputPath' | 'clearOutput' | 'debug'> {
  readonly packageBases: PackageBaseNames;
}

export async function generateAll(options: LogsGenerateOptions): Promise<GeneratorResult> {
  const db = await loadPatchedSpec();
  const services = await db.all('service');
  const moduleMap: ModuleMap = loadModuleMap({
    packageBases: options.packageBases,
    respectOverrides: false,
  });
  const moduleRequests: GenerateModuleMap = {};

  for (const service of services) {
    if (moduleMap[service.name]) {
      moduleRequests[service.name] = {
        services: [{ namespace: service.cloudFormationNamespace }],
      };
    }
  }

  const generated = await generate<typeof LogsDeliveryBuilder>(moduleRequests, {
    ...options,
    db,
    astBuilder: LogsDeliveryBuilder,
  });

  return {
    moduleMap: Object.fromEntries(Object.entries(generated.modules).map(([moduleName, moduleInfo]) => [
      moduleName,
      {
        files: moduleInfo.outputFiles,
        name: moduleName,
        resources: moduleInfo.resources,
        scopes: moduleMap[moduleName]?.scopes ?? [],
        definition: moduleMap[moduleName]?.definition,
        targets: moduleMap[moduleName]?.targets,
      },
    ])),
    contributions: [{
      barrelFile: 'mixins.ts',
      exportLines: ["export * from './logs-delivery-mixins.generated';"],
      jsiircNamespace: 'mixins',
    }],
  };
}
