import * as AWS from 'aws-sdk';
import { ConfigurationOptions } from 'aws-sdk/lib/config';

/** @experimental */
export interface ISDK {
  cloudFormation(): AWS.CloudFormation;

  ec2(): AWS.EC2;

  ssm(): AWS.SSM;

  s3(): AWS.S3;

  route53(): AWS.Route53;

  ecr(): AWS.ECR;

  sts(): AWS.STS;
}

/**
 * Base functionality of SDK without credential fetching
 */
export class SDK implements ISDK {
  private readonly config: ConfigurationOptions;

  /**
   * Default retry options for SDK clients
   *
   * Biggest bottleneck is CloudFormation, with a 1tps call rate. We want to be
   * a little more tenacious than the defaults, and with a little more breathing
   * room between calls (defaults are {retries=3, base=100}).
   *
   * I've left this running in a tight loop for an hour and the throttle errors
   * haven't escaped the retry mechanism.
   */
  private readonly retryOptions = { maxRetries: 6, retryDelayOptions: { base: 300 }};

  constructor(credentials: AWS.Credentials, region: string, httpOptions: ConfigurationOptions = {}) {
    this.config = {
      ...httpOptions,
      ...this.retryOptions,
      credentials,
      region,
    };
  }

  public cloudFormation(): AWS.CloudFormation {
    return new AWS.CloudFormation(this.config);
  }

  public ec2(): AWS.EC2 {
    return new AWS.EC2(this.config);
  }

  public ssm(): AWS.SSM {
    return new AWS.SSM(this.config);
  }

  public s3(): AWS.S3 {
    return new AWS.S3(this.config);
  }

  public route53(): AWS.Route53 {
    return new AWS.Route53(this.config);
  }

  public ecr(): AWS.ECR {
    return new AWS.ECR(this.config);
  }

  public sts(): AWS.STS {
    return new AWS.STS(this.config);
  }
}