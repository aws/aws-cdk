import { PolicyStatement } from '@aws-cdk/aws-iam';
import lambda = require('@aws-cdk/aws-lambda');
import { IStepFunctionsTask, StepFunctionsTaskConfig, Task } from '@aws-cdk/aws-stepfunctions';
import { JsonPathToken } from '@aws-cdk/aws-stepfunctions/lib/json-path';
import { Stack } from '@aws-cdk/cdk';
import { isArray, isObject } from 'util';

/**
 * Defines the payload for the Lambda function
 *
 * This is a dictionary style, where keys can be suffixed by ".$" to access the input element
 *  (value has to start with "$.") or the context (value has to start with "$$.")
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/input-output-contextobject.html
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-parameters.html
 */
export declare type LambdaTaskPayload = {
  [key: string]: any;
};

/**
 * Properties to run a Lambda function task in StepFunctions
 */
export interface RunLambdaTaskProps {
  /**
   * Whether to use a callback pattern. The workflow execution will be stopped until a call to sendTaskSuccess is made with the
   *  provided task token (that must be passed as part of the payload, check LambdaTaskKnownPath.TokenInputPath)
   *
   * If not defined, it will use the synchronous invocation.
   *
   * @default false
   */
  readonly waitForTaskToken?: boolean;

  /**
   * Defines if the step function waits for the output of the Lambda function or just sends the message and forgets the output.
   *
   * If not defined, it will use the request / response invocation model.
   *
   * @default false
   */
  readonly fireAndForget?: boolean;

  /**
   * Defines the payload for your Lambda function.
   *
   * If not specified, the task will be executed with a passthrough payload, the external event will be used directly.
   * It must be specified if waitForTaskToken is set, and it must contain LambdaTaskKnownPath.TokenInputPath
   */
  readonly payload?: LambdaTaskPayload;
}

/**
 * These are known and useful paths in the management of StepFunctions integration
 */
export enum LambdaTaskKnownPath {
  /**
   * This is the path to the actual payload that is returned by the execution of a Step Function in Sync mode.
   */
  InvokePayloadOutputPath = "$.Payload",
  /**
   * When you work on a Lambda callback pattern, this is the path to use for retrieving the task token
   */
  TokenInputPath = "$$.Task.Token"
}

/**
 * Internal interface used in searching for the task token in a Payload
 */
interface SearchForTaskTokenResults {
  /**
   * The task token was found (if found, the other parameters are at their default value)
   */
  found: boolean;

  /**
   * If not found, did we find a value in the payload that contained the task token, but missing the training '.$'
   */
  foundTokenWithoutParameter: boolean;

  /**
   * What are the pathes where we we found this value
   */
  foundTokenWithoutParameterPaths: string[];

  /**
   * If not found, did we find a value in the payload that had the task token without two leading '$' signs?
   */
  foundSingleDollarToken: boolean;

  /**
   * What are the pathes where we we found this value
   */
  foundSingleDollarTokenPaths: string[];
}

/**
 * A StepFunctions Task to invoke a Lambda function, allowing the use of the new AWS Service integration patterns.
 *
 * When used in Sync mode, the output will contain the execution context, and the actual reply will be
 *  available in the KnownPath.SyncPayloadOutputPath part (you can use this directly as an OutputPath of your Task)
 * When used in WaitForToken mode, the output will be the content of the message sent to sendTaskSuccess()
 */
export class RunLambdaTask implements IStepFunctionsTask {
  /**
   * Creates a new Lambda function integration for an AWS StepFunction Task
   *
   * @param lambdaFunction the lambda function being called, the platform will call the $LATEST version
   * @param props the configuration properties of this Lambda function execution
   */
  public static fromFunction(lambdaFunction: lambda.Function, props?: RunLambdaTaskProps): RunLambdaTask {
    return new RunLambdaTask(lambdaFunction.functionName, undefined, props);
  }

  /**
   * Creates a new Lambda function integration for an AWS StepFunction Task
   *
   * @param lambdaFunction the lambda function being called
   * @param alias the AWS Lambda function alias being called
   * @param props the configuration properties of this Lambda function execution
   */
  public static fromAlias(lambdaFunction: lambda.Function, alias: lambda.Alias, props?: RunLambdaTaskProps): RunLambdaTask {
    return new RunLambdaTask(lambdaFunction.functionName, alias.aliasName, props);
  }

  /**
   * Creates a new Lambda function integration for an AWS StepFunction Task
   *
   * @param lambdaVersion the AWS Lambda function version being called
   * @param props the configuration properties of this Lambda function execution
   */
  public static fromVersion(lambdaVersion: lambda.Version, props?: RunLambdaTaskProps): RunLambdaTask {
    return new RunLambdaTask(lambdaVersion.lambda.functionName, lambdaVersion.version, props);
  }

  private readonly functionName: string;
  private readonly functionQualifier: string | undefined;
  private readonly waitForTaskToken: boolean;
  private readonly fireAndForget: boolean;
  private readonly payload: LambdaTaskPayload | undefined;

  /**
   * Creates a new Lambda function integration for an AWS StepFunction Task
   *
   * @param functionName the name of the lambda function neing executed
   * @param functionQualifier the version information (version number, alias) of the function being executed (default $LATEST)
   * @param props the configuration properties of this Lambda function execution
   */
  constructor(functionName: string, functionQualifier?: string, props?: RunLambdaTaskProps) {
    if (props === undefined) {
      props = {};
    }
    this.functionName = functionName;
    this.functionQualifier = functionQualifier;
    this.waitForTaskToken = (props.waitForTaskToken === undefined) ? false : props.waitForTaskToken;
    this.fireAndForget = (props.fireAndForget === undefined) ? false : props.fireAndForget;
    this.payload = props.payload;
  }

  public bind(_task: Task): StepFunctionsTaskConfig {
    const stack = Stack.of(_task);
    const functionArn = stack.formatArn({
      service: 'lambda',
      resourceName: this.functionName,
      resource: 'function',
      sep: ':'
    });

    let resourceArn =  "arn:aws:states:::lambda:invoke";
    if (this.waitForTaskToken) {
      resourceArn = resourceArn + '.waitForTaskToken';

      const found = this.searchForTaskToken('', '', this.payload);
      if (!found.found) {
        let message = `You must have a parameterized entry in your payload that references the task token "${LambdaTaskKnownPath.TokenInputPath}"`;
        if (found.foundTokenWithoutParameter) {
          message += `\n- we found it in the following places: "${found.foundTokenWithoutParameterPaths.join('", "')}"` +
           ' but none of them have a parameter key (finishing by ".$")';
        }
        if (found.foundSingleDollarToken) {
          message += `\n- we found a similar symbol "${LambdaTaskKnownPath.TokenInputPath.substr(1)}"` +
            ` in the following places: "${found.foundSingleDollarTokenPaths.join('", "')}"`;
        }
        throw new Error(message);
      }
    }

    return {
      resourceArn,
      policyStatements: [
        new PolicyStatement().addAction("lambda:InvokeFunction").addResource(functionArn)
      ],
      parameters: {
        FunctionName: this.functionName,
        Qualifier: this.functionQualifier,
        InvocationType: (this.fireAndForget ? 'Event' : 'RequestResponse'),
        Payload: this.payload
      },
      metricPrefixSingular: 'LambdaFunction',
      metricPrefixPlural: 'LambdaFunctions',
      metricDimensions: {
        LambdaFunctionArn: functionArn
      }
    };
  }

  private searchForTaskToken(path: string, key: string, value?: any, result?: SearchForTaskTokenResults): SearchForTaskTokenResults {
    if (result === undefined) {
      result = {
        found: false,
        foundTokenWithoutParameter: false,
        foundTokenWithoutParameterPaths: [],
        foundSingleDollarToken: false,
        foundSingleDollarTokenPaths: []
      };
    }

    if (typeof(value) === "string") {
      if (value === "$$.Task.Token" || value === "$$.Task" || value === "$$") {
        if (key.endsWith(".$")) {
          result.found = true;
        } else {
          result.foundTokenWithoutParameter = true;
          result.foundTokenWithoutParameterPaths.push(path);
        }
      } else if (value === "$.Task.Token" || value === "$.Task") {
        result.foundSingleDollarToken = true;
        result.foundSingleDollarTokenPaths.push(path);
      }
    } else if (isArray(value)) {
      for (let i = 0; i < value.length; ++i) {
        this.searchForTaskToken(`${path}[${i}]`, '', value[i], result);
      }
    } else if (isObject(value)) {
      if (JsonPathToken.isJsonPathToken(value)) {
        this.searchForTaskToken(path, key, value.path, result);
      } else {
        const entries = Object.entries(value);
        for (const entry of entries) {
          this.searchForTaskToken(path.length === 0 ? entry[0] : `${path}.${entry[0]}`, entry[0], entry[1], result);
          if (result.found) {
            return result;
          }
        }
      }
    }
    return result;
  }
}
