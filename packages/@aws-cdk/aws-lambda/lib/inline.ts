import { Construct } from '@aws-cdk/cdk';
import { InlineCode } from './code';
import { Function } from './lambda';
import { InlinableJavaScriptRuntime, Runtime } from './runtime';

/**
 * Defines the handler code for an inline JavaScript lambda function.
 *
 * AWS Lambda invokes your Lambda function via a handler object. A handler
 * represents the name of your Lambda function (and serves as the entry point
 * that AWS Lambda uses to execute your function code. For example:
 */
export interface IJavaScriptLambdaHandler {
  /**
   * The main Lambda entrypoint.
   *
   * @param event Event sources can range from a supported AWS service or
   * custom applications that invoke your Lambda function. For examples, see
   * [Sample Events Published by Event
   * Sources](https://docs.aws.amazon.com/lambda/latest/dg/eventsources.html).
   *
   * @param context AWS Lambda uses this parameter to provide details of your
   * Lambda function's execution. For more information, see [The Context
   * Object](https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html).
   *
   * @param callback The Node.js runtimes v6.10 and v8.10 support the optional
   * callback parameter. You can use it to explicitly return information back
   * to the caller. Signature is `callback(err, response)`.
   */
  fn(event: any, context: any, callback: any): void;
}

export interface InlineJavaScriptLambdaProps {
  /**
   * The lambda handler as a javascript function.
   *
   * This must be a javascript function object. The reason it is `any` is due
   * to limitations of the jsii compiler.
   */
  handler: IJavaScriptLambdaHandler;

  /**
   * A description of the function.
   */
  description?: string;

  /**
   * The function execution time (in seconds) after which Lambda terminates
   * the function. Because the execution time affects cost, set this value
   * based on the function's expected execution time.
   *
   * @default 30 seconds.
   */
  timeout?: number;

  /**
   * Key-value pairs that Lambda caches and makes available for your Lambda
   * functions. Use environment variables to apply configuration changes, such
   * as test and production environment configurations, without changing your
   * Lambda function source code.
   */
  environment?: { [key: string]: any };

  /**
   * The runtime environment for the Lambda function that you are uploading.
   * For valid values, see the Runtime property in the AWS Lambda Developer
   * Guide.
   *
   * @default NodeJS810
   */
  runtime?: InlinableJavaScriptRuntime;

  /**
   * A name for the function. If you don't specify a name, AWS CloudFormation
   * generates a unique physical ID and uses that ID for the function's name.
   * For more information, see Name Type.
   */
  functionName?: string;

  /**
   * The amount of memory, in MB, that is allocated to your Lambda function.
   * Lambda uses this value to proportionally allocate the amount of CPU
   * power. For more information, see Resource Model in the AWS Lambda
   * Developer Guide.
   *
   * @default The default value is 128 MB
   */
  memorySize?: number;
}

/**
 * A lambda function with inline node.js code.
 *
 * Usage:
 *
 *  new InlineJavaScriptLambda(this, 'MyFunc', {
 *    handler: {
 *    fn: (event, context, callback) => {
 *      console.log('hello, world');
 *      callback();
 *    }
 *    }
 *  });
 *
 * This will define a node.js 6.10 function with the provided function has
 * the handler code.
 */
export class InlineJavaScriptFunction extends Function {
  constructor(parent: Construct, name: string, props: InlineJavaScriptLambdaProps) {
    const code = new InlineCode(renderCode(props.handler));
    const runtime: InlinableJavaScriptRuntime = props.runtime || Runtime.NodeJS610;
    const handler = 'index.handler';
    const timeout = props.timeout || 30;
    super(parent, name, {
      code,
      runtime,
      handler,
      timeout,
      description: props.description,
      memorySize: props.memorySize,
      functionName: props.functionName,
      environment: props.environment,
    });
  }
}

function renderCode(handler: IJavaScriptLambdaHandler) {
  return `exports.handler = ${handler.fn.toString()}`;
}
