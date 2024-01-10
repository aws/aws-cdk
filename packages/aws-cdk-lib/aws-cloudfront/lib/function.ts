import * as fs from 'fs';
import { Construct } from 'constructs';
import { CfnFunction } from './cloudfront.generated';
import { IResource, Lazy, Names, Resource, Stack, Token } from '../../core';
import { Fact } from '../../region-info';

/**
 * Represents the function's source code
 */
export abstract class FunctionCode {

  /**
   * Inline code for function
   * @returns code object with inline code.
   * @param code The actual function code
   */
  public static fromInline(code: string): FunctionCode {
    return new InlineCode(code);
  }

  /**
   * Code from external file for function
   * @returns code object with contents from file.
   * @param options the options for the external file
   */
  public static fromFile(options: FileCodeOptions): FunctionCode {
    return new FileCode(options);
  }

  /**
   * renders the function code
   */
  public abstract render(): string;
}

/**
 * Options when reading the function's code from an external file
 */
export interface FileCodeOptions {
  /**
   * The path of the file to read the code from
   */
  readonly filePath: string;
}

/**
 * Represents the function's source code as inline code
 */
class InlineCode extends FunctionCode {

  constructor(private code: string) {
    super();
  }

  public render(): string {
    return this.code;
  }
}

/**
 * Represents the function's source code loaded from an external file
 */
class FileCode extends FunctionCode {

  constructor(private options: FileCodeOptions) {
    super();
  }

  public render(): string {
    return fs.readFileSync(this.options.filePath, { encoding: 'utf-8' });
  }
}

/**
 * Represents a CloudFront Function
 */
export interface IFunction extends IResource {
  /**
   * The name of the function.
   * @attribute
   */
  readonly functionName: string;

  /**
   * The ARN of the function.
   * @attribute
   */
  readonly functionArn: string;
}

/**
 * Attributes of an existing CloudFront Function to import it
 */
export interface FunctionAttributes {
  /**
   * The name of the function.
   */
  readonly functionName: string;

  /**
   * The ARN of the function.
   */
  readonly functionArn: string;

  /**
   * The Runtime of the function.
   * @default FunctionRuntime.JS_1_0
   */
  readonly functionRuntime?: string;

}

/**
 * Properties for creating a CloudFront Function
 */
export interface FunctionProps {
  /**
   * A name to identify the function.
   * @default - an automatically generated name
   */
  readonly functionName?: string;

  /**
   * A comment to describe the function.
   * @default - same as `functionName`
   */
  readonly comment?: string;

  /**
   * The source code of the function.
   */
  readonly code: FunctionCode;

  /**
   * The runtime environment for the function.
   * @default FunctionRuntime.JS_1_0
   */
  readonly runtime?: FunctionRuntime;
}

/**
 * A CloudFront Function
 *
 * @resource AWS::CloudFront::Function
 */
export class Function extends Resource implements IFunction {

  /** Imports a function by its name and ARN */
  public static fromFunctionAttributes(scope: Construct, id: string, attrs: FunctionAttributes): IFunction {
    return new class extends Resource implements IFunction {
      public readonly functionName = attrs.functionName;
      public readonly functionArn = attrs.functionArn;
      public readonly functionRuntime = attrs.functionRuntime ?? FunctionRuntime.JS_1_0.value;
    }(scope, id);
  }

  /**
   * the name of the CloudFront function
   * @attribute
   */
  public readonly functionName: string;
  /**
   * the ARN of the CloudFront function
   * @attribute
   */
  public readonly functionArn: string;
  /**
   * the deployment stage of the CloudFront function
   * @attribute
   */
  public readonly functionStage: string;
  /**
   * the runtime of the CloudFront function
   * @attribute
   */
  public readonly functionRuntime: string;

  constructor(scope: Construct, id: string, props: FunctionProps) {
    super(scope, id);

    this.functionName = props.functionName ?? this.generateName();

    this.functionRuntime = props.runtime?.value ?? FunctionRuntime.JS_1_0.value;

    const resource = new CfnFunction(this, 'Resource', {
      autoPublish: true,
      functionCode: props.code.render(),
      functionConfig: {
        comment: props.comment ?? this.functionName,
        runtime: this.functionRuntime,
      },
      name: this.functionName,
    });

    this.functionArn = resource.attrFunctionArn;
    this.functionStage = resource.attrStage;
  }

  private generateName(): string {
    // Function names are globally unique, even if the stack is deployed in different regions;
    // therefore, we prefix the region name to the resource name. It's important; however, to make
    // sure that we don't exceed the service's length limit. We subtract the length of the region
    // name from the max length to support the concatenation. If the region is currently unresolved,
    // then we use the name of the longest known region.
    const serviceMaxNameLength = 64;
    const region = Stack.of(this).region;
    const regionNameLength = !Token.isUnresolved(region) ? region.length : Math.max(...Fact.regions.map((r) => r.length));
    return Lazy.string({
      produce: () => `${region}${Names.uniqueResourceName(this, { maxLength: serviceMaxNameLength - regionNameLength })}`,
    });
  }
}

/**
 * The type of events that a CloudFront function can be invoked in response to.
 */
export enum FunctionEventType {

  /**
   * The viewer-request specifies the incoming request
   */
  VIEWER_REQUEST = 'viewer-request',

  /**
   * The viewer-response specifies the outgoing response
   */
  VIEWER_RESPONSE = 'viewer-response',
}

/**
 * Represents a CloudFront function and event type when using CF Functions.
 * The type of the `AddBehaviorOptions.functionAssociations` property.
 */
export interface FunctionAssociation {
  /**
   * The CloudFront function that will be invoked.
   */
  readonly function: IFunction;

  /** The type of event which should invoke the function. */
  readonly eventType: FunctionEventType;
}

/**
 * The function's runtime environment version.
 */
export class FunctionRuntime {
  /**
   * cloudfront-js-1.0
   */
  public static readonly JS_1_0 = new FunctionRuntime('cloudfront-js-1.0');

  /**
   * cloudfront-js-2.0
   */
  public static readonly JS_2_0 = new FunctionRuntime('cloudfront-js-2.0');

  /**
   * A custom runtime string.
   *
   * Gives full control over the runtime string fragment.
   */
  public static custom(runtimeString: string): FunctionRuntime {
    return new FunctionRuntime(runtimeString);
  }

  private constructor(public readonly value: string) {}
}
