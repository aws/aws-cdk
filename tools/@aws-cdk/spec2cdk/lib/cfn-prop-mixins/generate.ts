import type { GenerateModuleMap, GenerateOptions as Spec2CdkOptions } from '../generate';
import { generate, loadPatchedSpec } from '../generate';
import { MixinsBuilder } from './builder';
import { loadModuleMap, type ModuleMap } from '../module-topology';
import type { PackageBaseNames } from '../util/jsii';

export interface MixinsGenerateOptions extends Pick<Spec2CdkOptions<typeof MixinsBuilder>, 'outputPath' | 'clearOutput' | 'debug'> {
  readonly packageBases: PackageBaseNames;
}

export async function generateAll(options: MixinsGenerateOptions): Promise<ModuleMap> {
  const db = await loadPatchedSpec();
  const services = await db.all('service');
  const moduleMap: ModuleMap = loadModuleMap({
    packageBases: options.packageBases,
    respectOverrides: false,
  });
  const moduleRequests: GenerateModuleMap = {};

  // request all known services
  for (const service of services) {
    if (moduleMap[service.name]) {
      moduleRequests[service.name] = {
        services: [{ namespace: service.cloudFormationNamespace }],
      };
    }
  }

  const generated = await generate<typeof MixinsBuilder>(moduleRequests, {
    ...options,
    db,
    astBuilder: MixinsBuilder,
  });

  return Object.fromEntries(Object.entries(generated.modules).map(([moduleName, moduleInfo]) => [
    moduleName,
    {
      files: moduleInfo.outputFiles,
      name: moduleName,
      resources: moduleInfo.resources,
      scopes: moduleMap[moduleName]?.scopes ?? [],
      definition: moduleMap[moduleName]?.definition,
      targets: moduleMap[moduleName]?.targets,
    },
  ]));
}
