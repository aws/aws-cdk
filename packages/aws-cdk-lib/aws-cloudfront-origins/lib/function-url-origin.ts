import { Construct } from 'constructs';
import { validateSecondsInRangeOrUndefined } from './private/utils';
import * as cloudfront from '../../aws-cloudfront';
import * as lambda from '../../aws-lambda';
import * as cdk from '../../core';

/**
 * Properties for a Lambda Function URL Origin.
 */
export interface FunctionUrlOriginProps extends cloudfront.OriginProps {
  /**
   * Specifies how long, in seconds, CloudFront waits for a response from the origin.
   * The valid range is from 1 to 180 seconds, inclusive.
   *
   * Note that values over 60 seconds are possible only after a limit increase request for the origin response timeout quota
   * has been approved in the target account; otherwise, values over 60 seconds will produce an error at deploy time.
   *
   * @default Duration.seconds(30)
   */
  readonly readTimeout?: cdk.Duration;

  /**
   * Specifies how long, in seconds, CloudFront persists its connection to the origin.
   * The valid range is from 1 to 180 seconds, inclusive.
   *
   * Note that values over 60 seconds are possible only after a limit increase request for the origin response timeout quota
   * has been approved in the target account; otherwise, values over 60 seconds will produce an error at deploy time.
   *
   * @default Duration.seconds(5)
   */
  readonly keepaliveTimeout?: cdk.Duration;
}

/**
 * Properties for configuring a origin using a standard Lambda Functions URLs.
 */
export interface FunctionUrlOriginBaseProps extends cloudfront.OriginProps { }

/**
 * Properties for configuring a Lambda Functions URLs with OAC.
 */
export interface FunctionUrlOriginWithOACProps extends FunctionUrlOriginProps {
  /**
   * An optional Origin Access Control
   *
   * @default - an Origin Access Control will be created.
   */
  readonly originAccessControl?: cloudfront.IOriginAccessControl;

}

/**
 * An Origin for a Lambda Function URL.
 */
export class FunctionUrlOrigin extends cloudfront.OriginBase {
  /**
   * Create a Lambda Function URL Origin with Origin Access Control (OAC) configured
   */
  public static withOriginAccessControl(url: lambda.IFunctionUrl, props?: FunctionUrlOriginWithOACProps): cloudfront.IOrigin {
    return new FunctionUrlOriginWithOAC(url, props);
  }

  constructor(lambdaFunctionUrl: lambda.IFunctionUrl, private readonly props: FunctionUrlOriginProps = {}) {
    // Lambda Function URL is of the form 'https://<lambda-id>.lambda-url.<region>.on.aws/'
    // No need to split URL as we do with REST API, the entire URL is needed
    const domainName = cdk.Fn.select(2, cdk.Fn.split('/', lambdaFunctionUrl.url));
    super(domainName, props);

    validateSecondsInRangeOrUndefined('readTimeout', 1, 180, props.readTimeout);
    validateSecondsInRangeOrUndefined('keepaliveTimeout', 1, 180, props.keepaliveTimeout);
  }

  protected renderCustomOriginConfig(): cloudfront.CfnDistribution.CustomOriginConfigProperty | undefined {
    return {
      originSslProtocols: [cloudfront.OriginSslPolicy.TLS_V1_2],
      originProtocolPolicy: cloudfront.OriginProtocolPolicy.HTTPS_ONLY,
      originReadTimeout: this.props.readTimeout?.toSeconds(),
      originKeepaliveTimeout: this.props.keepaliveTimeout?.toSeconds(),
    };
  }
}

/**
 * An Origin for a Lambda Function URL with OAC.
 */
class FunctionUrlOriginWithOAC extends cloudfront.OriginBase {
  private originAccessControl?: cloudfront.IOriginAccessControl;
  private functionUrl: lambda.IFunctionUrl;

  constructor(lambdaFunctionUrl: lambda.IFunctionUrl, props: FunctionUrlOriginWithOACProps = {}) {
    const domainName = cdk.Fn.select(2, cdk.Fn.split('/', lambdaFunctionUrl.url));
    super(domainName, props);
    this.functionUrl = lambdaFunctionUrl;
    this.originAccessControl = props.originAccessControl;

    validateSecondsInRangeOrUndefined('readTimeout', 1, 180, props.readTimeout);
    validateSecondsInRangeOrUndefined('keepaliveTimeout', 1, 180, props.keepaliveTimeout);
  }

  protected renderCustomOriginConfig(): cloudfront.CfnDistribution.CustomOriginConfigProperty | undefined {
    return {
      originSslProtocols: [cloudfront.OriginSslPolicy.TLS_V1_2],
      originProtocolPolicy: cloudfront.OriginProtocolPolicy.HTTPS_ONLY,
    };
  }

  public bind(scope: Construct, options: cloudfront.OriginBindOptions): cloudfront.OriginBindConfig {
    const originBindConfig = super.bind(scope, options);
    const distributionId = options.distributionId;

    if (!this.originAccessControl) {
      this.originAccessControl = new cloudfront.FunctionUrlOriginAccessControl(scope, 'FunctionUrlOriginAccessControl');
    }

    new lambda.CfnPermission(scope, `InvokeFromApiFor${options.originId}`, {
      principal: 'cloudfront.amazonaws.com',
      action: 'lambda:InvokeFunctionUrl',
      functionName: cdk.Fn.select(6, cdk.Fn.split(':', this.functionUrl.functionArn)),
      sourceArn: `arn:${cdk.Aws.PARTITION}:cloudfront::${cdk.Aws.ACCOUNT_ID}:distribution/${distributionId}`,
    });

    return {
      ...originBindConfig,
      originProperty: {
        ...originBindConfig.originProperty!,
        originAccessControlId: this.originAccessControl?.originAccessControlId,
      },
    };
  }
}
