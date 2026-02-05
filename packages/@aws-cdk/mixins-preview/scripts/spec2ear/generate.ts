import type { GenerateModuleMap, GenerateOptions as Spec2CdkOptions } from '@aws-cdk/spec2cdk';
import { generate, loadPatchedSpec } from '@aws-cdk/spec2cdk';
import { EncryptionAtRestBuilder } from './builder';
import { MIXINS_PREVIEW_BASE_NAMES } from '../config';
import { loadModuleMap, type ModuleMap } from '@aws-cdk/spec2cdk/lib/module-topology';
import type { EncryptionAtRestData } from './helpers';
import { generateCrossServiceMixin } from './cross-service-mixin';
import * as fs from 'node:fs';
import * as path from 'node:path';

type GenerateOptions = Pick<Spec2CdkOptions<typeof EncryptionAtRestBuilder>, 'outputPath' | 'clearOutput' | 'debug'>;

export async function generateAll(options: GenerateOptions): Promise<ModuleMap> {
  const db = await loadPatchedSpec();
  const services = await db.all('service');
  const moduleMap: ModuleMap = loadModuleMap({
    packageBases: MIXINS_PREVIEW_BASE_NAMES,
  });
  const moduleRequests: GenerateModuleMap = {};

  // Load encryption-at-rest data
  const dataPath = path.join(__dirname, 'data.json');
  const encryptionData: EncryptionAtRestData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

  // Build a set of services that have encryption-enabled resources
  const servicesWithEncryption = new Set<string>();
  for (const cfnType of Object.keys(encryptionData)) {
    // Extract service name from CFN type (e.g., AWS::S3::Bucket -> s3)
    const match = cfnType.match(/^AWS::(\w+)::/);
    if (match) {
      servicesWithEncryption.add(match[1].toLowerCase());
    }
  }

  // Request services that have encryption-enabled resources
  for (const service of services) {
    if (moduleMap[service.name]) {
      const serviceLower = service.cloudFormationNamespace.replace('AWS::', '').toLowerCase();
      if (servicesWithEncryption.has(serviceLower)) {
        moduleRequests[service.name] = {
          services: [{ namespace: service.cloudFormationNamespace }],
        };
      }
    }
  }

  const generated = await generate<typeof EncryptionAtRestBuilder>(moduleRequests, {
    ...options,
    db,
    astBuilder: EncryptionAtRestBuilder,
  });

  // Generate the cross-service mixin
  await generateCrossServiceMixin(options.outputPath, encryptionData);

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
