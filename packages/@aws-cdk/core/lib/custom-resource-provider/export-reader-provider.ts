import * as path from 'path';
import { Construct } from 'constructs';
import { CustomResource } from '../custom-resource';
import { Intrinsic } from '../private/intrinsic';
import { Stack } from '../stack';
import { CustomResourceProvider, CustomResourceProviderRuntime } from './custom-resource-provider';

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
 */
export class ExportReader extends Construct {
  private readonly resource: CustomResource;
  constructor(scope: Construct, id: string, props: ExportReaderProps) {
    super(scope, id);
    const stack = Stack.of(this);
    const region = props.region ?? stack.region;

    const resourceType = 'Custom::CrossRegionExportReader';
    const serviceToken = CustomResourceProvider.getOrCreate(this, resourceType, {
      codeDirectory: path.join(__dirname, 'get-cfn-exports-handler'),
      runtime: CustomResourceProviderRuntime.NODEJS_14_X,
      policyStatements: [{
        Effect: 'Allow',
        Resource: '*',
        Action: ['cloudformation:ListExports'],
      }],
    });

    this.resource = new CustomResource(this, 'Default', {
      resourceType: resourceType,
      serviceToken,
      properties: {
        Region: region,
        // This is used to determine when the function has changed.
        //
        // We want to lookup the exports every time
        // changed for it to take effect - a good candidate for RefreshToken.
        RefreshToken: Date.now().toString(),
      },
    });

  }

  /**
   * Get a CloudFormation Stack export by name
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
   */
  public importValue(exportName: string): Intrinsic {
    return this.resource.getAtt(exportName);
  }
}
