import * as lambda from '@aws-cdk/aws-lambda';
import { Duration, Size } from '@aws-cdk/core';
import { IDeliveryStream } from './delivery-stream';

/**
 * Configure the data processor.
 */
export interface DataProcessorProps {
  /**
   * The length of time Kinesis Data Firehose will buffer incoming data before calling the processor.
   *
   * @default Duration.minutes(1)
   */
  readonly bufferInterval?: Duration;

  /**
   * The amount of incoming data Kinesis Data Firehose will buffer before calling the processor.
   *
   * @default Size.mebibytes(3)
   */
  readonly bufferSize?: Size;

  /**
   * The number of times Kinesis Data Firehose will retry the processor invocation after a failure due to network timeout or invocation limits.
   *
   * @default 3
   */
  readonly retries?: number;
}

/**
 * The key-value pair that identifies the underlying processor resource.
 *
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-processorparameter.html
 * @example {
 *   parameterName: 'LambdaArn',
 *   parameterValue: lambdaFunction.functionArn,
 * }
 */
export interface DataProcessorIdentifier {
  /**
   * The parameter name that corresponds to the processor resource's identifier.
   *
   * Must be an accepted value in `CfnDeliveryStream.ProcessoryParameterProperty.ParameterName`.
   */
  readonly parameterName: string;

  /**
   * The identifier of the underlying processor resource.
   */
  readonly parameterValue: string;
}

/**
 * The full configuration of a data processor.
 */
export interface DataProcessorConfig extends DataProcessorProps {
  /**
   * The type of the underlying processor resource.
   *
   * Must be an accepted value in `CfnDeliveryStream.ProcessorProperty.Type`.
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesisfirehose-deliverystream-processor.html#cfn-kinesisfirehose-deliverystream-processor-type
   * @example 'Lambda'
   */
  readonly processorType: string;

  /**
   * The key-value pair that identifies the underlying processor resource.
   */
  readonly processorIdentifier: DataProcessorIdentifier;
}

/**
 * A data processor that Kinesis Data Firehose will call to transform records before delivering data.
 */
export interface IDataProcessor {
  /**
   * Binds this processor to the delivery stream of the destination
   *
   * Implementers should use this method to grant processor invocation permissions to the provided stream and return the
   * necessary configuration to register as a processor.
   */
  bind(deliveryStream: IDeliveryStream): DataProcessorConfig
}

/**
 * Use a Lambda function to transform records.
 */
export class LambdaFunctionProcessor implements IDataProcessor {
  private readonly processorType = 'Lambda';
  private readonly processorIdentifier: DataProcessorIdentifier;
  constructor(private readonly lambdaFunction: lambda.IFunction, private readonly props: DataProcessorProps = {}) {
    this.processorIdentifier = {
      parameterName: 'LambdaArn',
      parameterValue: lambdaFunction.functionArn,
    };
  }

  public bind(deliveryStream: IDeliveryStream): DataProcessorConfig {
    this.lambdaFunction.grantInvoke(deliveryStream);

    return {
      processorType: this.processorType,
      processorIdentifier: this.processorIdentifier,
      ...this.props,
    };
  }
}
