import * as lambda from '@aws-cdk/aws-lambda';
import { Construct } from 'constructs';
import { DataProcessorBindOptions, DataProcessorConfig, DataProcessorProps, IDataProcessor } from './processor';

/**
 * Use an AWS Lambda function to transform records.
 */
export class LambdaFunctionProcessor implements IDataProcessor {
  /**
   * The constructor props of the LambdaFunctionProcessor.
   */
  public readonly props: DataProcessorProps;

  constructor(private readonly lambdaFunction: lambda.IFunction, props: DataProcessorProps = {}) {
    this.props = props;
  }

  public bind(_scope: Construct, options: DataProcessorBindOptions): DataProcessorConfig {
    this.lambdaFunction.grantInvoke(options.role);

    return {
      processorType: 'Lambda',
      processorIdentifier: {
        parameterName: 'LambdaArn',
        parameterValue: this.lambdaFunction.functionArn,
      },
    };
  }
}
