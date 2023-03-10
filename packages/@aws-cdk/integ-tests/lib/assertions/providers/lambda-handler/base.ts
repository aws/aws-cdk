/* eslint-disable no-console */
import * as https from 'https';
import * as url from 'url';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as AWS from 'aws-sdk';

interface HandlerResponse {
  readonly status: 'SUCCESS' | 'FAILED';
  readonly reason: 'OK' | string;
  readonly data?: any;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export abstract class CustomResourceHandler<Request extends object, Response extends object> {
  public readonly physicalResourceId: string;
  private readonly timeout: NodeJS.Timeout;
  private timedOut = false;

  constructor(protected readonly event: AWSLambda.CloudFormationCustomResourceEvent, protected readonly context: AWSLambda.Context) {
    this.timeout = setTimeout(async () => {
      await this.respond({
        status: 'FAILED',
        reason: 'Lambda Function Timeout',
        data: this.context.logStreamName,
      });
      this.timedOut = true;
    }, context.getRemainingTimeInMillis() - 1200);
    this.event = event;
    this.physicalResourceId = extractPhysicalResourceId(event);
  }

  /**
   * Handles executing the custom resource event. If `stateMachineArn` is present
   * in the props then trigger the waiter statemachine
   */
  public async handle(): Promise<Response | undefined> {
    try {
      if ('stateMachineArn' in this.event.ResourceProperties) {
        const req: AWS.StepFunctions.StartExecutionInput = {
          stateMachineArn: this.event.ResourceProperties.stateMachineArn,
          name: this.event.RequestId,
          input: JSON.stringify(this.event),
        };
        await this.startExecution(req);
        return;
      } else {
        const response = await this.processEvent(this.event.ResourceProperties as unknown as Request);
        return response;
      }
    } catch (e) {
      console.log(e);
      throw e;
    } finally {
      clearTimeout(this.timeout);
    }
  }

  /**
   * Handle async requests from the waiter state machine
   */
  public async handleIsComplete(): Promise<Response | undefined> {
    try {
      const result = await this.processEvent(this.event.ResourceProperties as unknown as Request);
      return result;
    } catch (e) {
      console.log(e);
      return;
    } finally {
      clearTimeout(this.timeout);
    }
  }

  /**
   * Start a step function state machine which will wait for the request
   * to be successful.
   */
  private async startExecution(req: AWS.StepFunctions.StartExecutionInput): Promise<void> {
    try {
      const sfn = new AWS.StepFunctions();
      await sfn.startExecution(req).promise();
    } finally {
      clearTimeout(this.timeout);
    }
  }

  protected abstract processEvent(request: Request): Promise<Response | undefined>;

  public respond(response: HandlerResponse) {
    if (this.timedOut) {
      return;
    }
    const cfResponse: AWSLambda.CloudFormationCustomResourceResponse = {
      Status: response.status,
      Reason: response.reason,
      PhysicalResourceId: this.physicalResourceId,
      StackId: this.event.StackId,
      RequestId: this.event.RequestId,
      LogicalResourceId: this.event.LogicalResourceId,
      NoEcho: false,
      Data: response.data,
    };
    const responseBody = JSON.stringify(cfResponse);

    console.log('Responding to CloudFormation', responseBody);

    const parsedUrl = url.parse(this.event.ResponseURL);
    const requestOptions = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.path,
      method: 'PUT',
      headers: {
        'content-type': '',
        'content-length': Buffer.byteLength(responseBody, 'utf8'),
      },
    };

    return new Promise((resolve, reject) => {
      try {
        const request = https.request(requestOptions, resolve);
        request.on('error', reject);
        request.write(responseBody);
        request.end();
      } catch (e) {
        reject(e);
      } finally {
        clearTimeout(this.timeout);
      }
    });
  }
}

function extractPhysicalResourceId(event: AWSLambda.CloudFormationCustomResourceEvent): string {
  switch (event.RequestType) {
    case 'Create':
      return event.LogicalResourceId;
    case 'Update':
    case 'Delete':
      return event.PhysicalResourceId;
  }
}
