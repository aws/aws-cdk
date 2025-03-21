import { Construct } from 'constructs';
import * as lambda from '../../../aws-lambda';
import { Tokenization } from '../../../core';
import { CfnDeliveryStream } from '../kinesisfirehose.generated';
import { DataProcessorBindOptions, DataProcessorConfig, DataProcessorProps, IDataProcessor } from '../processor';

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

    const parameters: CfnDeliveryStream.ProcessorParameterProperty[] = [
      { parameterName: 'RoleArn', parameterValue: options.role.roleArn },
      { parameterName: 'LambdaArn', parameterValue: this.lambdaFunction.functionArn },
    ];
    if (this.props.bufferInterval) {
      parameters.push({ parameterName: 'BufferIntervalInSeconds', parameterValue: Tokenization.stringifyNumber(this.props.bufferInterval.toSeconds()) });
    }
    if (this.props.bufferSize) {
      parameters.push({ parameterName: 'BufferSizeInMBs', parameterValue: Tokenization.stringifyNumber(this.props.bufferSize.toMebibytes()) });
    }
    if (this.props.retries) {
      parameters.push({ parameterName: 'NumberOfRetries', parameterValue: Tokenization.stringifyNumber(this.props.retries) });
    }

    return {
      processorType: 'Lambda',
      processorIdentifier: { parameterName: '', parameterValue: '' },
      parameters,
    };
  }
}
