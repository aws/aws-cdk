import * as lambda from '@aws-cdk/aws-lambda';
import { Construct } from 'constructs';
import { DataProcessorBindOptions, DataProcessorConfig, DataProcessorProps, DataProcessorIdentifier, IDataProcessor } from './processor';

/**
 * Use an AWS Lambda function to transform records.
 */
export class LambdaFunctionProcessor implements IDataProcessor {
  /**
   * The constructor props of the LambdaFunctionProcessor.
   */
  public readonly props: DataProcessorProps;

  private readonly processorIdentifier: DataProcessorIdentifier;

  constructor(private readonly lambdaFunction: lambda.IFunction, props: DataProcessorProps = {}) {
    this.props = props;
    this.processorIdentifier = {
      parameterName: 'LambdaArn',
      parameterValue: lambdaFunction.functionArn,
    };
  }

  public bind(_scope: Construct, options: DataProcessorBindOptions): DataProcessorConfig {
    this.lambdaFunction.grantInvoke(options.role);

    return {
      processorType: 'Lambda',
      processorIdentifier: this.processorIdentifier,
    };
  }
}
