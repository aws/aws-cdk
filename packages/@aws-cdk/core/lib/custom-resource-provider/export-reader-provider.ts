import * as path from 'path';
import { Construct } from 'constructs';
import { CustomResource } from '../custom-resource';
import { Lazy } from '../lazy';
import { Stack } from '../stack';
import { CustomResourceProvider, CustomResourceProviderRuntime } from './custom-resource-provider';
import { CfnResource } from '../cfn-resource';

export const SSM_EXPORT_PATH_PREFIX = 'cdk/exports/';

/**
 * Properties for an ExportReader
 */
export interface ExportReaderProps {}

/**
 * Creates a custom resource that will return a list of stack imports from a given
 * The export can then be referenced by the export name.
 *
 * @internal - this is intentionally not exported from core
 */
export class ExportReader extends Construct {
  public static getOrCreate(scope: Construct, uniqueId: string, _props: ExportReaderProps = {}): ExportReader {
    const stack = Stack.of(scope);
    const existing = stack.node.tryFindChild(uniqueId);
    return existing
      ? existing as ExportReader
      : new ExportReader(stack, uniqueId);
  }

  private readonly importParametersNames: string[] = [];
  private readonly customResource: CustomResource;
  constructor(scope: Construct, id: string, _props: ExportReaderProps = {}) {
    super(scope, id);
    const stack = Stack.of(this);

    const resourceType = 'Custom::CrossRegionExportReader';
    const serviceToken = CustomResourceProvider.getOrCreate(this, resourceType, {
      codeDirectory: path.join(__dirname, 'cross-region-ssm-reader-handler'),
      runtime: CustomResourceProviderRuntime.NODEJS_14_X,
      policyStatements: [{
        Effect: 'Allow',
        Resource: stack.formatArn({
          service: 'ssm',
          resource: 'parameter',
          resourceName: `${SSM_EXPORT_PATH_PREFIX}${stack.stackName}/*`,
        }),
        Action: [
          'ssm:DeleteParameters',
          'ssm:AddTagsToResource',
          'ssm:RemoveTagsFromResource',
          'ssm:GetParametersByPath',
          'ssm:GetParameters',
        ],
      }],
    });

    this.customResource = new CustomResource(this, 'Resource', {
      resourceType: resourceType,
      serviceToken,
      properties: {
        Region: stack.region,
        StackName: stack.stackName,
        Imports: Lazy.list({ produce: () => this.importParametersNames }),
      },
    });
  }

  /**
   * This is the only way to add a dependency on a custom resource currently
   */
  public addDependency(resource: CfnResource): void {
    const customResource = this.customResource.node.tryFindChild('Default');
    if (customResource && CfnResource.isCfnResource(customResource)) {
      customResource.addDependsOn(resource);
    }
  }

  /**
   * Register a reference with the writer and returns a CloudFormation Stack export by name
   *
   * The value will be "exported" via the ExportWriter. It will perform
   * the export by creating an SSM parameter in the region that the consuming
   * stack is created.
   *
   * @param exportName the unique name associated with the export
   */
  public importValue(exportName: string): void {
    this.importParametersNames.push(exportName);
  }
}
