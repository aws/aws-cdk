import { IResource, Names, Resource, Fn } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnFunction } from './cloudfront.generated';

/**
 * Represents the function's source code
 */
export abstract class FunctionCode {

  /**
   * Inline code for function
   * @returns `InlineCode` with inline code.
   * @param code The actual function code
   */
  public static fromInline(code: string): InlineCode {
    return new InlineCode(code);
  }

  /**
    * renders the function code
    */
  public abstract render(): string;
}

export class InlineCode extends FunctionCode {

  constructor(private code: string) {
    super();
  }

  public render(): string {
    return this.code;
  }
}

/**
 * Represents a ClouFront Function
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
 * Properties for creating a CloudFront Function
 */
export interface FunctionProps {
  /**
   * A name to identify the function.
   * @default - generated from the `id`
   */
  readonly name?: string;

  /**
   * A comment to describe the function.
   * @default - no comment
   */
  readonly comment?: string;

  /**
   * The source code of the function.
   */
  readonly code: FunctionCode;
}

/**
 * A CloudFront Function
 *
 * @resource AWS::CloudFront::Function
 */
export class Function extends Resource implements IFunction {

  public readonly functionName: string;
  public readonly functionArn: string;

  constructor(scope: Construct, id: string, props: FunctionProps) {
    super(scope, id);

    this.functionName = props.name ?? this.generateName();

    const resource = new CfnFunction(this, 'Resource', {
      autoPublish: true,
      functionCode: Fn.base64(props.code.render()),
      functionConfig: {
        comment: props.comment,
        runtime: 'cloudfront-js-1.0',
      },
      name: this.functionName,
    });

    this.functionArn = resource.ref;
  }

  private generateName(): string {
    const name = Names.uniqueId(this);
    if (name.length > 80) {
      return name.substring(0, 40) + name.substring(name.length - 40);
    }
    return name;
  }
}
