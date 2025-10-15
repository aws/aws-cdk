import type { GenerateModuleMap, GenerateOptions as Spec2CdkOptions } from '@aws-cdk/spec2cdk';
import { generate, loadPatchedSpec } from '@aws-cdk/spec2cdk';
import { MixinAstBuilder } from './ast';
import { MIXINS_PREVIEW_BASE_NAMES } from './config';
import type { AstBuilderProps } from '@aws-cdk/spec2cdk/lib/cdk/ast';
import { DEFAULT_FILE_PATTERNS } from '@aws-cdk/spec2cdk/lib/cdk/ast';
import { loadModuleMap, type ModuleMap } from '@aws-cdk/spec2cdk/lib/module-topology';

type GenerateOptions = Pick<Spec2CdkOptions, 'outputPath' | 'clearOutput' | 'debug'>;

export async function generateAll(options: GenerateOptions): Promise<ModuleMap> {
  const db = await loadPatchedSpec();
  const services = await db.all('service');
  const moduleMap: ModuleMap = loadModuleMap({
    packageBases: MIXINS_PREVIEW_BASE_NAMES,
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

  const generated = await generate(moduleRequests, {
    ...options,
    db,
    astBuilder: (props: AstBuilderProps) => {
      return new MixinAstBuilder({
        ...props,
        filePatterns: {
          ...DEFAULT_FILE_PATTERNS,
          resources: '%moduleName%/%serviceShortName%.generated.ts',
        },
        inCdkLib: false,
      });
    },
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

