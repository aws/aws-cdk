import * as path from 'path';
import { Construct } from 'constructs';
import { CfnDynamicReference, CfnDynamicReferenceService } from '../cfn-dynamic-reference';
import { CustomResource } from '../custom-resource';
import { Lazy } from '../lazy';
import { Intrinsic } from '../private/intrinsic';
import { Reference } from '../reference';
import { Stack } from '../stack';
import { CustomResourceProvider, CustomResourceProviderRuntime } from './custom-resource-provider';

type CrossRegionExports = { [exportName: string]: string };
export const SSM_EXPORT_PATH_PREFIX = 'cdk/exports/';

/**
 * Properties for an ExportReader
 */
export interface ExportReaderProps {
  /**
   * The AWS region to read Stack exports from
   *
   * @default - the stack region
   */
  readonly region?: string;
}

/**
 * Creates a custom resource that will return a list of stack exports from a given
 * AWS region. The export can then be referenced by the export name.
 *
 *
 * @example
 * declare const app: App;
 * const stack1 = new Stack(app, 'East1Stack', { env: { region: 'us-east-1' } });
 * new CfnOutput(stack1, 'Output', { value: 'someValue', exportName: 'someName' });
 *
 * const stack2 = new Stack(app, 'East2Stack', { env: { region: 'us-east-2' } });
 * const exportReader = new ExportReader(stack2, 'ExportReader', { region: 'us-east-1' });
 * const anotherResource = new CfnResource(stack2, 'AnotherResource', {
 *   Parameters: {
 *     SomeParam: exportReader.importValue('someName'),
 *   },
 * });
 *
 * @internal - this is intentionally not exported from core
 */
export class ExportWriter extends Construct {
  private readonly _references: CrossRegionExports = {};
  constructor(scope: Construct, id: string, props: ExportReaderProps) {
    super(scope, id);
    const stack = Stack.of(this);
    const region = props.region ?? stack.region;

    const resourceType = 'Custom::CrossRegionExportWriter';
    const serviceToken = CustomResourceProvider.getOrCreate(this, resourceType, {
      codeDirectory: path.join(__dirname, 'cross-region-ssm-writer-handler'),
      runtime: CustomResourceProviderRuntime.NODEJS_14_X,
      policyStatements: [{
        Effect: 'Allow',
        Resource: stack.formatArn({
          service: 'ssm',
          resource: 'parameter',
          region,
          resourceName: `${SSM_EXPORT_PATH_PREFIX}${Stack.of(this).stackName}/*`,
        }),
        Action: [
          'ssm:GetParametersByPath',
          'ssm:PutParameter',
          'ssm:DeleteParameters',
        ],
      }],
    });

    new CustomResource(this, 'Default', {
      resourceType: resourceType,
      serviceToken,
      properties: {
        Region: region,
        StackName: stack.stackName,
        Exports: Lazy.any({ produce: () => this._references }),
      },
    });
  }

  /**
   * Register a reference with the writer and returns a CloudFormation Stack export by name
   *
   * The value will be "exported" via the ExportWriter. It will perform
   * the export by creating an SSM parameter in the region that the consuming
   * stack is created.
   *
   * @param exportName the unique name associated with the export
   * @param reference the value that will be exported
   * @returns a dynamic reference to an ssm parameter
   */
  public exportValue(exportName: string, reference: Reference): Intrinsic {
    const stack = Stack.of(this);
    const parameterName = `/${SSM_EXPORT_PATH_PREFIX}${stack.stackName}/${exportName}`;
    this._references[parameterName] = stack.resolve(reference.toString());
    return new CfnDynamicReference(CfnDynamicReferenceService.SSM, parameterName);
  }
}
