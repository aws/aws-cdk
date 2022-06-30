import { ArnFormat, Stack, CfnTag } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { EndpointAttributes, EndpointBase, IEndpoint } from './endpoint-base';
import { CfnEndpoint } from './sagemaker.generated';
import { validateEndpointProps } from './validate-props';

/**
 * Properties for creating a new Endpoint.
 */
export interface EndpointProps {
  /**
   * A physical name for the endpoint.
   *
   * @default CloudFormation-generated name
   */
  readonly endpointName?: string;

  /**
   * The name for the configuration for the endpoint.
   */
  readonly endpointConfigName: string;

  /**
   * Tags to apply to the endpoint.
   *
   * @default {}
   */
  readonly tags?: { [key: string]: string };
}

/**
 * A new Amazon Sagemaker endpoint.
 */
export class Endpoint extends EndpointBase {
  /**
   * Import an existing endpoint from endpoint attributes.
   *
   * @param scope the parent Construct for this new Construct
   * @param id the logical ID of this new Construct
   * @param attrs the properties of the referenced endpoint
   * @returns a Construct representing a reference to an existing endpoint
   */
  public static fromEndpointAttributes(scope: Construct, id: string, attrs: EndpointAttributes): IEndpoint {

    class ImportedEndpoint extends EndpointBase {
      public readonly endpointArn = attrs.endpointArn;
      public readonly endpointName = attrs.endpointName || this.parseEndpointNameFromArn(attrs.endpointArn);

      private parseEndpointNameFromArn(endpointArn: string): string {
        const stack = Stack.of(scope);
        const parsedArn = stack.splitArn(endpointArn, ArnFormat.SLASH_RESOURCE_NAME);
        if (!parsedArn.resourceName) {
          throw new Error(`Can not get endpoint name from ARN ${endpointArn}, please provide endpoint name.`);
        }
        return parsedArn.resourceName!!;
      }
    }

    return new ImportedEndpoint(scope, id);
  }

  /**
   * The ARN of the endpoint.
   */
  public readonly endpointArn: string;

  /**
   * The physical name of the endpoint.
   */
  public readonly endpointName: string;

  constructor(scope: Construct, id: string, props: EndpointProps) {
    super(scope, id, {
      physicalName: props.endpointName,
    });

    validateEndpointProps(props);

    const endpoint = new CfnEndpoint(this, 'Resource', {
      endpointName: this.physicalName,
      endpointConfigName: props.endpointConfigName,
      tags: this.renderTags(props.tags),
    });

    this.endpointArn = this.getResourceArnAttribute(endpoint.ref, {
      service: 'sagemaker',
      resource: 'endpoint',
      resourceName: this.physicalName,
    });
    this.endpointName = this.getResourceNameAttribute(endpoint.attrEndpointName);
  }

  /**
   * Render the configured Tags to be added to the endpoint properties.
   */
  private renderTags(tags?: { [key: string]: string }): CfnTag[] | undefined {
    if (!tags) { return undefined; }
    return Object.keys(tags).map((key) => {
      return {
        key: key,
        value: tags[key],
      };
    });
  }
}
