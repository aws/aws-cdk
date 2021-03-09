import * as cxapi from '@aws-cdk/cx-api';
import { RegionInfo } from '@aws-cdk/region-info';
import { Construct } from 'constructs';
import { CfnCondition } from '../cfn-condition';
import { Fn } from '../cfn-fn';
import { Aws } from '../cfn-pseudo';
import { CfnResource } from '../cfn-resource';
import { Lazy } from '../lazy';
import { Stack } from '../stack';
import { Token } from '../token';
import { collectRuntimeInformation } from './runtime-info';

/**
 * Construct that will render the metadata resource
 */
export class MetadataResource extends Construct {
  /**
   * Clear the modules cache
   *
   * The next time the MetadataResource is rendered, it will do a lookup of the
   * modules from the NodeJS module cache again.
   *
   * Used only for unit tests.
   */
  public static clearModulesCache() {
    this._modulesPropertyCache = undefined;
  }

  /**
   * Cached version of the _modulesProperty() accessor
   *
   * No point in calculating this fairly expensive list more than once.
   */
  private static _modulesPropertyCache?: string;

  /**
   * Calculate the modules property
   */
  private static modulesProperty(): string {
    if (this._modulesPropertyCache === undefined) {
      this._modulesPropertyCache = formatModules(collectRuntimeInformation());
    }
    return this._modulesPropertyCache;
  }

  constructor(scope: Stack, id: string) {
    super(scope, id);

    const metadataServiceExists = Token.isUnresolved(scope.region) || RegionInfo.get(scope.region).cdkMetadataResourceAvailable;
    if (metadataServiceExists) {
      const resource = new CfnResource(this, 'Default', {
        type: 'AWS::CDK::Metadata',
        properties: {
          Modules: Lazy.string({ produce: () => MetadataResource.modulesProperty() }),
        },
      });

      // In case we don't actually know the region, add a condition to determine it at deploy time
      if (Token.isUnresolved(scope.region)) {
        const condition = new CfnCondition(this, 'Condition', {
          expression: makeCdkMetadataAvailableCondition(),
        });

        // To not cause undue template changes
        condition.overrideLogicalId('CDKMetadataAvailable');

        resource.cfnOptions.condition = condition;
      }
    }
  }
}

function makeCdkMetadataAvailableCondition() {
  return Fn.conditionOr(...RegionInfo.regions
    .filter(ri => ri.cdkMetadataResourceAvailable)
    .map(ri => Fn.conditionEquals(Aws.REGION, ri.name)));
}

function formatModules(runtime: cxapi.RuntimeInfo): string {
  const modules = new Array<string>();

  // inject toolkit version to list of modules
  const cliVersion = process.env[cxapi.CLI_VERSION_ENV];
  if (cliVersion) {
    modules.push(`aws-cdk=${cliVersion}`);
  }

  for (const key of Object.keys(runtime.libraries).sort()) {
    modules.push(`${key}=${runtime.libraries[key]}`);
  }
  return modules.join(',');
}