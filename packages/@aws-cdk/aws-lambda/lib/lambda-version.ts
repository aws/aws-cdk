import { Construct } from '@aws-cdk/cdk';
import { FunctionRef } from './lambda-ref';
import { cloudformation } from './lambda.generated';

/**
 * Properties for a new Lambda version
 */
export interface FunctionVersionProps {
  /**
   * SHA256 of the version of the Lambda source code
   *
   * Specify to validate that you're deploying the right version.
   *
   * @default No validation is performed
   */
  codeSha256?: string;

  /**
   * Description of the version
   *
   * @default Description of the Lambda
   */
  description?: string;

  /**
   * Function to get the value of
   */
  lambda: FunctionRef;
}

/**
 * A single newly-deployed version of a Lambda function.
 *
 * This object exists to--at deploy time--query the "then-current" version of
 * the Lambda function that it refers to. This Version object can then be
 * used in `Alias` to refer to a particular deployment of a Lambda.
 *
 * This means that for every new update you deploy to your Lambda (using the
 * CDK and Aliases), you must always create a new Version object. In
 * particular, it must have a different name, so that a new resource is
 * created.
 *
 * If you want to ensure that you're associating the right version with
 * the right deployment, specify the `codeSha256` property while
 * creating the `Version.
 */
export class FunctionVersion extends Construct {
  /**
   * The most recently deployed version of this function.
   */
  public readonly functionVersion: string;

  /**
   * Lambda object this version is associated with
   */
  public readonly lambda: FunctionRef;

  constructor(parent: Construct, name: string, props: FunctionVersionProps) {
    super(parent, name);

    const version = new cloudformation.VersionResource(this, 'Resource', {
      codeSha256: props.codeSha256,
      description: props.description,
      functionName: props.lambda.functionName
    });

    this.functionVersion = version.version;
    this.lambda = props.lambda;
  }
}
