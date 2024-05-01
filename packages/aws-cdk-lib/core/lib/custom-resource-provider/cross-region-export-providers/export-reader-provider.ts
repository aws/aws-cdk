import { Construct } from 'constructs';
import { SSM_EXPORT_PATH_PREFIX, ExportReaderCRProps, CrossRegionExports } from './types';
import { CfnResource } from '../../cfn-resource';
import { CustomResource } from '../../custom-resource';
import { CrossRegionSsmReaderProvider } from '../../dist/core/cross-region-ssm-reader-provider.generated';
import { Lazy } from '../../lazy';
import { Intrinsic } from '../../private/intrinsic';
import { Stack } from '../../stack';

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

  private readonly importParameters: CrossRegionExports = {};
  private readonly customResource: CustomResource;
  constructor(scope: Construct, id: string, _props: ExportReaderProps = {}) {
    super(scope, id);
    const stack = Stack.of(this);

    const resourceType = 'Custom::CrossRegionExportReader';
    const serviceToken = CrossRegionSsmReaderProvider.getOrCreate(this, resourceType, {
      policyStatements: [{
        Effect: 'Allow',
        Resource: stack.formatArn({
          service: 'ssm',
          resource: 'parameter',
          resourceName: `${SSM_EXPORT_PATH_PREFIX}${stack.stackName}/*`,
        }),
        Action: [
          'ssm:AddTagsToResource',
          'ssm:RemoveTagsFromResource',
          'ssm:GetParameters',
        ],
      }],
    });

    const properties: ExportReaderCRProps = {
      region: stack.region,
      prefix: stack.stackName,
      imports: Lazy.any({ produce: () => this.importParameters }),
    };
    this.customResource = new CustomResource(this, 'Resource', {
      resourceType: resourceType,
      serviceToken,
      properties: {
        ReaderProps: properties,
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
   * @param exports map of unique name associated with the export to SSM Dynamic reference
   */
  public importValue(name: string, value: Intrinsic): Intrinsic {
    this.importParameters[name] = value.toString();
    return this.customResource.getAtt(name);
  }
}
