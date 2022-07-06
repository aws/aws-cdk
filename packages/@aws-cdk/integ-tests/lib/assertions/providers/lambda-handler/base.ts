/* eslint-disable no-console */
import * as https from 'https';
import * as url from 'url';

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

  public async handle(): Promise<void> {
    try {
      console.log(`Event: ${JSON.stringify({ ...this.event, ResponseURL: '...' })}`);
      const response = await this.processEvent(this.event.ResourceProperties as unknown as Request);
      console.log(`Event output : ${JSON.stringify(response)}`);
      await this.respond({
        status: 'SUCCESS',
        reason: 'OK',
        data: response,
      });
    } catch (e) {
      console.log(e);
      await this.respond({
        status: 'FAILED',
        reason: e.message ?? 'Internal Error',
      });
    } finally {
      clearTimeout(this.timeout);
    }
  }

  protected abstract processEvent(request: Request): Promise<Response | undefined>;

  private respond(response: HandlerResponse) {
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
      headers: { 'content-type': '', 'content-length': responseBody.length },
    };

    return new Promise((resolve, reject) => {
      try {
        const request = https.request(requestOptions, resolve);
        request.on('error', reject);
        request.write(responseBody);
        request.end();
      } catch (e) {
        reject(e);
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
