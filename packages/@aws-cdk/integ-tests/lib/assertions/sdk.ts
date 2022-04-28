import { CustomResource, Reference, Lazy } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { EqualsAssertion } from './assertions';
import { IAssertion } from './deploy-assert';
import { md5hash } from './private/hash';
import { AssertionsProvider, SDK_RESOURCE_TYPE_PREFIX } from './providers';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct as CoreConstruct } from '@aws-cdk/core';

/**
 * Options to perform an AWS JavaScript V2 API call
 */
export interface SdkQueryOptions {
  /**
   * The AWS service, i.e. S3
   */
  readonly service: string;

  /**
   * The api call to make, i.e. getBucketLifecycle
   */
  readonly api: string;

  /**
   * Any parameters to pass to the api call
   */
  readonly parameters?: any;
}

/**
 * Options for creating an SDKQuery provider
 */
export interface SdkQueryProps extends SdkQueryOptions {}

export class SdkQuery extends CoreConstruct {
  private readonly sdkCallResource: CustomResource;
  private flattenResponse: string = 'false';

  constructor(scope: Construct, id: string, props: SdkQueryProps) {
    super(scope, id);

    const provider = new AssertionsProvider(this, 'SdkProvider');
    provider.addPolicyStatementFromSdkCall(props.service, props.api);

    this.sdkCallResource = new CustomResource(this, 'Default', {
      serviceToken: provider.serviceToken,
      properties: {
        service: props.service,
        api: props.api,
        parameters: provider.encode(props.parameters),
        flattenResponse: Lazy.string({ produce: () => this.flattenResponse }),
      },
      resourceType: `${SDK_RESOURCE_TYPE_PREFIX}${props.service}${props.api}`,
    });

    // Needed so that all the policies set up by the provider should be available before the custom resource is provisioned.
    this.sdkCallResource.node.addDependency(provider);
  }

  /**
   * Returns the value of an attribute of the custom resource of an arbitrary
   * type. Attributes are returned from the custom resource provider through the
   * `Data` map where the key is the attribute name.
   *
   * @param attributeName the name of the attribute
   * @returns a token for `Fn::GetAtt`. Use `Token.asXxx` to encode the returned `Reference` as a specific type or
   * use the convenience `getAttString` for string attributes.
   */
  public getAtt(attributeName: string): Reference {
    this.flattenResponse = 'true';
    return this.sdkCallResource.getAtt(`apiCallResponse.${attributeName}`);
  }

  /**
   * Returns the value of an attribute of the custom resource of type string.
   * Attributes are returned from the custom resource provider through the
   * `Data` map where the key is the attribute name.
   *
   * @param attributeName the name of the attribute
   * @returns a token for `Fn::GetAtt` encoded as a string.
   */
  public getAttString(attributeName: string): string {
    this.flattenResponse = 'true';
    return this.sdkCallResource.getAttString(`apiCallResponse.${attributeName}`);
  }

  /**
   * Creates an assertion custom resource that will assert that the response
   * from the SDKQuery equals the 'expected' value
   */
  public assertEqual(expected: any, actualAttr?: string): IAssertion {
    const hash = md5hash(expected);
    let inputResourceAtt = 'apiCallResponse';
    if (actualAttr) {
      this.flattenResponse = 'true';
      inputResourceAtt = `apiCallResponse.${actualAttr}`;
    }
    return new EqualsAssertion(this, `AssertEquals${hash}`, {
      expected,
      inputResource: this.sdkCallResource,
      inputResourceAtt,
    });
  }
}
