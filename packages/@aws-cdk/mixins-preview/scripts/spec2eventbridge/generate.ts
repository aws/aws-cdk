import type { GenerateModuleMap, GenerateOptions as Spec2CdkOptions } from '@aws-cdk/spec2cdk';
import { generate, loadPatchedSpec } from '@aws-cdk/spec2cdk';
import { EventBridgeBuilder } from './builder';
import { MIXINS_PREVIEW_BASE_NAMES } from '../config';
import { loadModuleMap, type ModuleMap } from '@aws-cdk/spec2cdk/lib/module-topology';

type GenerateOptions = Pick<Spec2CdkOptions<typeof EventBridgeBuilder>, 'outputPath' | 'clearOutput' | 'debug'>;

export async function generateAll(options: GenerateOptions): Promise<ModuleMap> {
  const db = await loadPatchedSpec();
  const services = await db.all('service');
  const moduleMap: ModuleMap = loadModuleMap({
    packageBases: MIXINS_PREVIEW_BASE_NAMES,
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

  const generated = await generate<typeof EventBridgeBuilder>(moduleRequests, {
    ...options,
    db,
    astBuilder: EventBridgeBuilder,
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
