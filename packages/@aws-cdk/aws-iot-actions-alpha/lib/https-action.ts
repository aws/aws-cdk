import * as iot from '@aws-cdk/aws-iot-alpha';
import * as iam from 'aws-cdk-lib/aws-iam';
import { CommonActionProps } from './common-action-props';
import { singletonActionRole } from './private/role';

export interface HttpActionSigV4Auth {
  /**
   * The service name.
   */
  readonly serviceName: string;
  /**
   * The signing region.
   */
  readonly signingRegion: string;
}

export interface HttpActionHeader {
  /**
   * The HTTP header key.
   */
  readonly key: string;
  /**
   * The HTTP header value. Substitution templates are supported.
   */
  readonly value: string;
}

/**
 * Configuration properties of an HTTPS action.
 *
 * @see https://docs.aws.amazon.com/iot/latest/developerguide/https-rule-action.html
 */
export interface HttpsActionProps extends CommonActionProps {
  /**
   * If specified, AWS IoT uses the confirmation URL to create a matching topic rule destination.
   */
  readonly confirmationUrl?: string;

  /**
   * The headers to include in the HTTPS request to the endpoint.
   */
  readonly headers?: Array<HttpActionHeader>;

  /**
   * Use Sigv4 authorization.
   */
  readonly auth?: HttpActionSigV4Auth;
}

/**
 * The action to send data from an MQTT message to a web application or service.
 */
export class HttpsAction implements iot.IAction {
  private readonly role?: iam.IRole;
  private readonly url: string;
  private readonly confirmationUrl?: string;
  private readonly headers?: Array<HttpActionHeader>;
  private readonly auth?: HttpActionSigV4Auth;

  /**
   * @param url The url to which to send post request.
   * @param props Optional properties to not use default.
   */
  constructor( url: string, props: HttpsActionProps={}) {
    this.url = url;
    this.confirmationUrl = props.confirmationUrl;
    this.headers = props.headers;
    this.role = props.role;
    this.auth = props.auth;
  }

  /**
   * @internal
   */
  public _bind(topicRule: iot.ITopicRule): iot.ActionConfig {
    const role = this.role ?? singletonActionRole(topicRule);
    const sigV4 = this.auth ? {
      sigv4: {
        roleArn: role.roleArn,
        serviceName: this.auth.serviceName,
        signingRegion: this.auth.signingRegion,
      },
    } : this.auth;

    return {
      configuration: {
        http: {
          url: this.url,
          confirmationUrl: this.confirmationUrl,
          headers: this.headers,
          auth: sigV4,
        },
      },
    };
  }
}
