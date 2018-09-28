import cdk = require('@aws-cdk/cdk');
import { Integration, IntegrationOptions, IntegrationType } from '../integration';
import { parseAwsApiCall } from '../util';

export interface AwsIntegrationProps {
  /**
   * Use AWS_PROXY integration.
   *
   * @default false
   */
  proxy?: boolean;

  /**
   * The name of the integrated AWS service (e.g. `s3`)
   */
  service: string;

  /**
   * A designated subdomain supported by certain AWS service for fast
   * host-name lookup.
   */
  subdomain?: string;

  /**
   * The path to use for path-base APIs.
   *
   * For example, for S3 GET, you can set path to `bucket/key`.
   * For lambda, you can set path to `2015-03-31/functions/${function-arn}/invocations`
   *
   * Mutually exclusive with the `action` options.
   */
  path?: string;

  /**
   * The AWS action to perform in the integration.
   *
   * Use `actionParams` to specify key-value params for the action.
   *
   * Mutually exclusive with `path`.
   */
  action?: string;

  /**
   * Parameters for the action.
   *
   * `action` must be set, and `path` must be undefined.
   * The action params will be URL encoded.
   */
  actionParameters?: { [key: string]: string };

  /**
   * Integration options, such as content handling, request/response mapping, etc.
   */
  options?: IntegrationOptions
}

/**
 * This type of integration lets an API expose AWS service actions. It is
 * intended for calling all AWS service actions, but is not recommended for
 * calling a Lambda function, because the Lambda custom integration is a legacy
 * technology.
 */
export class AwsIntegration extends Integration {
  constructor(props: AwsIntegrationProps) {
    const backend = props.subdomain ? `${props.subdomain}.${props.service}` : props.service;
    const type = props.proxy ? IntegrationType.AwsProxy : IntegrationType.Aws;
    const { apiType, apiValue } = parseAwsApiCall(props.path, props.action, props.actionParameters);
    super({
      type,
      integrationHttpMethod: 'POST',
      uri: cdk.ArnUtils.fromComponents({
        service: 'apigateway',
        account: backend,
        resource: apiType,
        sep: '/',
        resourceName: apiValue,
      }),
      options: props.options,
    });
  }
}
