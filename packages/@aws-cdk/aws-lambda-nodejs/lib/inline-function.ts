import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';

/**
 * Properties for a NodejsInlineFunction
 */
export interface INodejsInlineFunctionProps {
  /**
   * Whether to require the `aws-sdk` module.
   * It will be available under the name `AWS`.
   *
   * @default true
   */
  readonly requireAwsSdk?: boolean;

  /**
   * Whether to require the `cfn-response` module.
   * It will be available under the name `response`.
   *
   * @default false
   */
  readonly requireCfnResponse?: boolean;

  /**
   * The handler's function. Uses the async pattern.
   *
   * Do not reference variables out of the scope of this function. This
   * function is part of the runtime code. Use environment variables if
   * you need to reference variables of your infrastructure code.
   */
  handler(event: any): Promise<any>;
}

/**
 * An inline Node.js Lambda function
 */
export class NodejsInlineFunction extends lambda.Function {
  constructor(scope: cdk.Construct, id: string, props: INodejsInlineFunctionProps) {
    const requireAwsSdk = props.requireAwsSdk !== false ? 'const AWS=require(\'aws-sdk\');' : '';
    const requireCfnResponse = props.requireCfnResponse ? 'const response=require(\'cfn-response\');' : '';
    super(scope, id, {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromInline(minify(`${requireAwsSdk}${requireCfnResponse}exports.handler=${props.handler}`)),
      handler: 'index.handler'
    });
  }
}

/**
 * Naive minifier
 */
function minify(code: string): string {
  return code
    .trim()
    .replace(/  +/g, ' ') // Multiple whitespaces
    .replace(/\n\n+/g, '\n') // Multiple new lines
    .replace(/\/\/.+\n/g, '\n') // Line comments
    .replace(/; *\n ?/g, ';') // Superfluous new lines after semicolon
    .replace(/{\n ?/g, '{') // Superfluous new lines after opening brace
    .replace('exports.handler=async handler(', 'exports.handler=async('); // allows short notation in the props
}
