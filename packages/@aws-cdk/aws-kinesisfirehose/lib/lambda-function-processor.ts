import * as lambda from '@aws-cdk/aws-lambda';
import { Construct } from 'constructs';
import { DataProcessorBindOptions, DataProcessorConfig, DataProcessorProps, IDataProcessor } from './processor';

/**
 * Use an AWS Lambda function to transform records.
 */
export class LambdaFunctionProcessor implements IDataProcessor {
  constructor(private readonly lambdaFunction: lambda.IFunction, private readonly props: DataProcessorProps = {}) {
    this.props = props;
  }

  public bind(_scope: Construct, options: DataProcessorBindOptions): DataProcessorConfig {
    this.lambdaFunction.grantInvoke(options.role);

    const parameters = [{ parameterName: 'RoleArn', parameterValue: options.role.roleArn }];
    parameters.push({ parameterName: 'LambdaArn', parameterValue: this.lambdaFunction.functionArn });

    if (this.props.bufferInterval) {
      parameters.push({ parameterName: 'BufferIntervalInSeconds', parameterValue: this.props.bufferInterval.toSeconds().toString() });
    }
    if (this.props.bufferSize) {
      parameters.push({ parameterName: 'BufferSizeInMBs', parameterValue: this.props.bufferSize.toMebibytes().toString() });
    }
    if (this.props.retries) {
      parameters.push({ parameterName: 'NumberOfRetries', parameterValue: this.props.retries.toString() });
    }
    return {
      dataProcessor: {
        type: 'Lambda',
        parameters: parameters,
      },
    };
  }
}
