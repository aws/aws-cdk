import * as path from 'path';
import { Construct } from 'constructs';
import { ExportReader } from './export-reader-provider';
import { CrossRegionExports, SSM_EXPORT_PATH_PREFIX, ExportWriterCRProps } from './types';
import { CfnDynamicReference, CfnDynamicReferenceService } from '../../cfn-dynamic-reference';
import { CustomResource } from '../../custom-resource';
import { Lazy } from '../../lazy';
import { Intrinsic } from '../../private/intrinsic';
import { makeUniqueId } from '../../private/uniqueid';
import { Reference } from '../../reference';
import { Stack } from '../../stack';
import { CustomResourceProvider, CustomResourceProviderRuntime } from '../custom-resource-provider';

/**
 * Properties for an ExportReader
 */
export interface ExportWriterProps {
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
  public static getOrCreate(scope: Construct, uniqueId: string, props: ExportWriterProps): ExportWriter {
    const stack = Stack.of(scope);
    const existing = stack.node.tryFindChild(uniqueId);
    return existing
      ? existing as ExportWriter
      : new ExportWriter(stack, uniqueId, {
        region: props.region,
      });
  }
  private readonly _references: CrossRegionExports = {};
  constructor(scope: Construct, id: string, props: ExportWriterProps) {
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
          resourceName: `${SSM_EXPORT_PATH_PREFIX}*`,
        }),
        Action: [
          'ssm:DeleteParameters',
          'ssm:ListTagsForResource',
          'ssm:GetParameters',
          'ssm:PutParameter',
        ],
      }],
    });

    const properties: ExportWriterCRProps = {
      region: region,
      exports: Lazy.any({ produce: () => this._references }),
    };
    new CustomResource(this, 'Resource', {
      resourceType: resourceType,
      serviceToken,
      properties: {
        WriterProps: properties,
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
   * @returns a reference to the reader custom resource
   */
  public exportValue(exportName: string, reference: Reference, importStack: Stack): Intrinsic {
    const stack = Stack.of(this);
    const parameterName = `/${SSM_EXPORT_PATH_PREFIX}${exportName}`;

    const ref = new CfnDynamicReference(CfnDynamicReferenceService.SSM, parameterName);

    this._references[parameterName] = stack.resolve(reference.toString());
    return this.addToExportReader(parameterName, ref, importStack);
  }

  /**
   * Add the export to the export reader which is created in the importing stack
   */
  private addToExportReader(exportName: string, exportValueRef: Intrinsic, importStack: Stack): Intrinsic {
    const readerConstructName = makeUniqueId(['ExportsReader']);
    const exportReader = ExportReader.getOrCreate(importStack.nestedStackParent ?? importStack, readerConstructName);

    return exportReader.importValue(exportName, exportValueRef);
  }
}
