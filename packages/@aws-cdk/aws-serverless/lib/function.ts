import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import events = require('@aws-cdk/aws-lambda-event-sources');
import s3 = require('@aws-cdk/aws-s3');
import sns = require('@aws-cdk/aws-sns');
import sqs = require('@aws-cdk/aws-sqs');
import cdk = require('@aws-cdk/cdk');

export interface S3Location {
  bucket: string;
  key: string;
  version: string;
}

export interface FunctionProps {
  /**
   * Required. Function within your code that is called to begin execution.
   */
  handler: string;

  /**
   * Required. The runtime environment.
   */
  runtime: string;

  /**
   * Either CodeUri or InlineCode must be specified. S3 Uri or location to the
   * function code. The S3 object this Uri references MUST be a Lambda
   * deployment package.
   */
  codeUri?: string | S3Location;

  /**
   * Either CodeUri or InlineCode must be specified. The inline code for the
   * lambda.
   */
  inlineCode?: string;

  /**
   * A name for the function. If you don't specify a name, a unique name will be
   * generated for you. More Info
   */
  functionName?: string;

  /**
   * Description of the function.
   */
  description?: string;

  /**
   * Size of the memory allocated per invocation of the function in MB. Defaults
   * to 128.
   */
  memorySize?: number;

  /**
   * Maximum time that the function can run before it is killed in seconds.
   * Defaults to 3.
   */
  timeout?: number;

  /**
   * ARN of an IAM role to use as this function's execution role. If omitted, a
   * default role is created for this function.
   */
  role?: string;

  /**
   * Configuration for the runtime environment.
   */
  environment?: { [key: string]: string };

  /**
   * A map (string to Event source object) that defines the events that trigger
   * this function. Keys are limited to alphanumeric characters.
   */
  events?: {
    [name: string]: Event
  }
}

export interface DynamoEvent extends events.DynamoEventSourceProps {
  tableArn: string;
}

export interface SnsEvent {
  topicArn: string;
}

export interface SqsEvent extends events.SqsEventSourceProps {
  queueArn: string;
}

export interface ApiEvent {
  path: string;
  method: string;
}

export interface Event {
  type: EventType;
  properties: DynamoEvent | SnsEvent | SqsEvent | ApiEvent;
}

export enum EventType {
  Api,
  DynamoDB,
  Kinesis,
  S3,
  SNS,
  SQS
}

export class Function extends cdk.Construct {
  private readonly handler: lambda.Function;

  constructor(scope: cdk.Construct, id: string, props: FunctionProps) {
    super(scope, id);

    this.handler = new lambda.Function(this, 'Default', {
      handler: props.handler,
      runtime: new lambda.Runtime(props.runtime),
      code: this.parseCode(props),
      environment: props.environment,
      functionName: props.functionName,
      description: props.description,
      memorySize: props.memorySize,
      role: props.role ? iam.Role.import(this, 'Role', { roleArn: props.role }) : undefined
    });

    for (const [ name, event ] of Object.entries(props.events || {})) {
      this.addEvent(name, event);
    }
  }

  public addEvent(name: string, event: Event) {
    switch (event.type) {
      case EventType.SNS:
        const snsEvent = event.properties as SnsEvent;
        const topic = sns.Topic.import(this, name, { topicArn: snsEvent.topicArn, topicName: snsEvent.topicArn });
        this.handler.addEventSource(new events.SnsEventSource(topic));
        break;

      case EventType.SQS:
        const sqsEvent = event.properties as SqsEvent;
        const queue = sqs.Queue.import(this, name, { queueArn: sqsEvent.queueArn, queueUrl: 'url' });
        this.handler.addEventSource(new events.SqsEventSource(queue, sqsEvent));
        break;

      case EventType.Api:
        const  apiEvent = event.properties as ApiEvent;
        this.handler.addEventSource(new events.ApiEventSource(apiEvent.method, apiEvent.path));
        break;

      default:
        throw new Error(`Invalid event type ${event.type} for event ${name}`);
    }
  }

  private parseCode(props: FunctionProps) {
    if (props.codeUri && props.inlineCode) {
      throw new Error(`"codeUri" and "inlineCode" are mutually exclusive`);
    }

    if (props.inlineCode) {
      return lambda.Code.inline(props.inlineCode);
    }

    if (props.codeUri) {
      if (typeof(props.codeUri) === 'string') {
        return lambda.Code.asset(props.codeUri);
      }

      const bucket = s3.Bucket.import(this, 'code', { bucketName: props.codeUri.bucket });
      return lambda.Code.bucket(bucket, props.codeUri.key, props.codeUri.version);
    }

    throw new Error(`either "codeUri" or "inlineCode" must be specified`);
  }
}
