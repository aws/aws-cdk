// aws-sdk available at runtime for lambdas
// eslint-disable-next-line import/no-extraneous-dependencies
import { Amplify, S3 } from 'aws-sdk';
import { AmplifyJobId, IsCompleteResponse, ResourceEvent, ResourceHandler } from './common';

export interface AmplifyAssetDeploymentProps {
  AppId: string;
  BranchName: string;
  S3BucketName: string;
  S3ObjectKey: string;
  TimeoutSeconds: number;
}

export class AmplifyAssetDeploymentHandler extends ResourceHandler {
  private readonly props: AmplifyAssetDeploymentProps;
  protected readonly amplify: Amplify;
  protected readonly s3: S3;

  constructor(amplify: Amplify, s3: S3, event: ResourceEvent) {
    super(event);

    this.props = parseProps(this.event.ResourceProperties);
    this.amplify = amplify;
    this.s3 = s3;
  }

  // ------
  // CREATE
  // ------

  protected async onCreate(): Promise<AmplifyJobId> {
    // eslint-disable-next-line no-console
    console.log('deploying to Amplify with options:', JSON.stringify(this.props, undefined, 2));

    // Verify no jobs are currently running.
    const jobs = await this.amplify
      .listJobs({
        appId: this.props.AppId,
        branchName: this.props.BranchName,
        maxResults: 1,
      })
      .promise();

    if (
      jobs.jobSummaries &&
      jobs.jobSummaries.find(summary => summary.status === 'PENDING')
    ) {
      return Promise.reject('Amplify job already running. Aborting deployment.');
    }

    // Create a pre-signed get URL of the asset so Amplify can retrieve it.
    const assetUrl = this.s3.getSignedUrl('getObject', {
      Bucket: this.props.S3BucketName,
      Key: this.props.S3ObjectKey,
    });

    // Deploy the asset to Amplify.
    const deployment = await this.amplify
      .startDeployment({
        appId: this.props.AppId,
        branchName: this.props.BranchName,
        sourceUrl: assetUrl,
      })
      .promise();

    return {
      AmplifyJobId: deployment.jobSummary.jobId,
    };
  }

  protected async isCreateComplete() {
    return this.isActive(this.event.AmplifyJobId);
  }

  // ------
  // DELETE
  // ------

  protected async onDelete(): Promise<void> {
    // We can't delete this resource as it's a deployment.
    return;
  }

  protected async isDeleteComplete(): Promise<IsCompleteResponse> {
    // We can't delete this resource as it's a deployment.
    return {
      IsComplete: true,
    };
  }

  // ------
  // UPDATE
  // ------

  protected async onUpdate() {
    return this.onCreate();
  }

  protected async isUpdateComplete() {
    return this.isActive(this.event.AmplifyJobId);
  }

  private async isActive(jobId?: string): Promise<IsCompleteResponse> {
    if (!jobId) {
      throw new Error('Unable to determine Amplify job status without job id');
    }

    const job = await this.amplify
      .getJob({
        appId: this.props.AppId,
        branchName: this.props.BranchName,
        jobId: jobId,
      })
      .promise();

    if (job.job.summary.status === 'SUCCEED') {
      return {
        IsComplete: true,
        Data: {
          JobId: jobId,
          Status: job.job.summary.status,
        },
      };
    } if (job.job.summary.status === 'FAILED' || job.job.summary.status === 'CANCELLED') {
      throw new Error(`Amplify job failed with status: ${job.job.summary.status}`);
    } else {
      return {
        IsComplete: false,
      };
    }
  }
}

function parseProps(props: any): AmplifyAssetDeploymentProps {
  return props;
}
