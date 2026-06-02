import { Construct } from 'constructs';
import { ExportReader } from './export-reader-provider';
import type { ExportWriterCRProps } from './types';
import { SSM_EXPORT_PATH_PREFIX } from './types';
import { CfnDynamicReference, CfnDynamicReferenceService } from '../../cfn-dynamic-reference';
import { CustomResource } from '../../custom-resource';
import { CrossRegionSsmWriterProvider } from '../../dist/core/cross-region-ssm-writer-provider.generated';
import type { IMapBox, ISetBox } from '../../helpers-internal';
import { Box } from '../../helpers-internal';
import type { Intrinsic } from '../../private/intrinsic';
import { makeUniqueId } from '../../private/uniqueid';
import type { Reference } from '../../reference';
import { Stack } from '../../stack';
import { Token } from '../../token';
import type { CustomResourceProviderOptions } from '../shared';

/**
 * Properties for an ExportWriter
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
 * Create our own CustomResourceProvider so that we can add a single policy
 * with a list of ARNs instead of having to create a separate policy statement per ARN.
 */
class CRProvider extends CrossRegionSsmWriterProvider {
  public static getOrCreateProvider(scope: Construct, uniqueid: string, props?: CustomResourceProviderOptions): CRProvider {
    const id = `${uniqueid}CustomResourceProvider`;
    const stack = Stack.of(scope);
    const provider = stack.node.tryFindChild(id) as CRProvider
      ?? new CRProvider(stack, id, props);
    return provider;
  }

  private readonly resourceArns: ISetBox<string> = Box.fromSet();
  constructor(scope: Construct, id: string, props?: CustomResourceProviderOptions) {
    super(scope, id, props);
    this.addToRolePolicy({
      Effect: 'Allow',
      Resource: this.resourceArns.derive(Array.from),
      Action: [
        'ssm:DeleteParameters',
        'ssm:ListTagsForResource',
        'ssm:GetParameters',
        'ssm:PutParameter',
      ],
    });
  }

  /**
   * Add a resource ARN to the existing policy statement
   */
  public addResourceArn(arn: string): void {
    this.resourceArns.add(arn);
  }
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
  private readonly _references: IMapBox<string, any> = Box.fromMap();
  private readonly provider: CRProvider;
  constructor(scope: Construct, id: string, props: ExportWriterProps) {
    super(scope, id);
    const stack = Stack.of(this);
    const region = props.region ?? stack.region;

    const resourceType = 'Custom::CrossRegionExportWriter';
    this.provider = CRProvider.getOrCreateProvider(this, resourceType);

    this.addRegionToPolicy(region);

    const properties: ExportWriterCRProps = {
      region: region,
      exports: this._references.derive(m => Object.fromEntries(m)),
    };
    new CustomResource(this, 'Resource', {
      resourceType: resourceType,
      serviceToken: this.provider.serviceToken,
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
    const parameterName = this.registerExport(exportName, reference, importStack);

    const ref = new CfnDynamicReference(CfnDynamicReferenceService.SSM, parameterName);
    return this.addToExportReader(parameterName, ref, importStack);
  }

  /**
   * Register a reference with the writer without creating an ExportReader in the consumer stack.
   * Used during the "both" transitional state where the producer still writes to SSM
   * but the consumer reads via Fn::GetStackOutput instead of the ExportReader.
   */
  public exportValueWriteOnly(exportName: string, reference: Reference, importStack: Stack): void {
    this.registerExport(exportName, reference, importStack);
  }

  private registerExport(exportName: string, reference: Reference, importStack: Stack): string {
    const stack = Stack.of(this);
    const parameterName = `/${SSM_EXPORT_PATH_PREFIX}${exportName}`;
    this._references.put(parameterName, stack.resolve(reference.toString()));
    this.addRegionToPolicy(importStack.region);
    return parameterName;
  }

  /**
   * Add a resource arn for the consuming stack region
   * Each writer could be writing to multiple regions and needs
   * permissions to each region.
   *
   * If the region is not resolved then do not add anything.
   */
  private addRegionToPolicy(region: string): void {
    if (!Token.isUnresolved(region)) {
      this.provider.addResourceArn(Stack.of(this).formatArn({
        service: 'ssm',
        resource: 'parameter',
        region,
        resourceName: `${SSM_EXPORT_PATH_PREFIX}*`,
      }));
    }
  }

  /**
   * Add the export to the export reader which is created in the importing stack
   */
  private addToExportReader(exportName: string, exportValueRef: Intrinsic, importStack: Stack): Intrinsic {
    const readerConstructName = makeUniqueId(['ExportsReader']);
    const exportReader = ExportReader.getOrCreate(importStack.nestedStackParent ?? importStack, readerConstructName);
    this.addRegionToPolicy(importStack.region);

    return exportReader.importValue(exportName, exportValueRef);
  }
}
