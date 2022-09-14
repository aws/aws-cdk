import * as crypto from 'crypto';
import * as path from 'path';
import { Construct } from 'constructs';
import { CfnResource } from '../cfn-resource';
import { CustomResource } from '../custom-resource';
import { Lazy } from '../lazy';
import { Intrinsic } from '../private/intrinsic';
import { Reference } from '../reference';
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
 *
 * @internal - this is intentionally not exported from core
 */
export class ExportReader extends Construct {
  private readonly resource: CustomResource;
  private readonly _references: Reference[] = [];
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
        // This is used to determine when custom resource should be executed again.
        //
        // We want to lookup the resources whenever any of the references
        // change. The only reliable way to tell whether we need to perform another lookup
        // is to check if _any_ property of the referenced resource changes
        RefreshToken: Lazy.string({
          produce: () => {
            const hash = crypto.createHash('md5');
            this._references.forEach(reference => {
              const referenceStack = Stack.of(reference.target);
              if (CfnResource.isCfnResource(reference.target)) {
                const cfn = JSON.stringify(referenceStack.resolve(reference.target._toCloudFormation()));
                hash.update(cfn);
              }
            });
            return hash.digest('hex');
          },
        }),
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

  /**
   * Register a reference with the reader.
   *
   * @internal
   */
  public _registerExport(reference: Reference): void {
    this._references.push(reference);
  }
}
