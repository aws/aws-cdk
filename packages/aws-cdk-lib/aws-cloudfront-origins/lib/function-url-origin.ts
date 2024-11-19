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
  public static withOriginAccessControl(lambdaFunctionUrl: lambda.IFunctionUrl, props?: FunctionUrlOriginWithOACProps): cloudfront.IOrigin {
    return new FunctionUrlOriginWithOAC(lambdaFunctionUrl, props);
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
  private readonly props: FunctionUrlOriginWithOACProps;

  constructor(lambdaFunctionUrl: lambda.IFunctionUrl, props: FunctionUrlOriginWithOACProps = {}) {
    const domainName = cdk.Fn.select(2, cdk.Fn.split('/', lambdaFunctionUrl.url));
    super(domainName, props);
    this.functionUrl = lambdaFunctionUrl;
    this.originAccessControl = props?.originAccessControl;

    this.props = props;

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

  public bind(scope: Construct, options: cloudfront.OriginBindOptions): cloudfront.OriginBindConfig {
    const originBindConfig = super.bind(scope, options);

    if (!this.originAccessControl) {
      this.originAccessControl = new cloudfront.FunctionUrlOriginAccessControl(scope, 'FunctionUrlOriginAccessControl');
    }
    this.validateAuthType();

    this.addInvokePermission(scope, options);

    return {
      ...originBindConfig,
      originProperty: {
        ...originBindConfig.originProperty!,
        originAccessControlId: this.originAccessControl?.originAccessControlId,
      },
    };
  }

  private addInvokePermission(scope: Construct, options: cloudfront.OriginBindOptions) {
    const distributionId = options.distributionId;

    new lambda.CfnPermission(scope, `InvokeFromApiFor${options.originId}`, {
      principal: 'cloudfront.amazonaws.com',
      action: 'lambda:InvokeFunctionUrl',
      functionName: this.functionUrl.functionArn,
      sourceArn: `arn:${cdk.Aws.PARTITION}:cloudfront::${cdk.Aws.ACCOUNT_ID}:distribution/${distributionId}`,
    });
  }

  /**
   * Validation method: Ensures that when the OAC signing method is SIGV4_ALWAYS, the authType is set to AWS_IAM.
   */
  private validateAuthType() {
    const cfnOriginAccessControl = this.originAccessControl?.node.children.find(
      (child) => child instanceof cloudfront.CfnOriginAccessControl,
    ) as cloudfront.CfnOriginAccessControl;
    const originConfig = cfnOriginAccessControl.originAccessControlConfig;
    const originAccessControlConfig = originConfig as cloudfront.CfnOriginAccessControl.OriginAccessControlConfigProperty;

    const isAlwaysSigning: boolean =
      originAccessControlConfig.signingBehavior === cloudfront.SigningBehavior.ALWAYS &&
      originAccessControlConfig.signingProtocol === cloudfront.SigningProtocol.SIGV4;

    const isAuthTypeIsNone: boolean = this.functionUrl.authType !== lambda.FunctionUrlAuthType.AWS_IAM;

    if (isAlwaysSigning && isAuthTypeIsNone) {
      throw new Error('The authType of the Function URL must be set to AWS_IAM when origin access control signing method is SIGV4_ALWAYS.');
    }

  }
}
