import { Stack } from '@aws-cdk/core';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from '@aws-cdk/custom-resources';

import { Construct, IConstruct } from 'constructs';
export interface IOrganizationRoot extends IConstruct {
  readonly organizationRootId: string;
}

export interface OrganizationRootProps {}

export interface OrganizationRootAttributes {
  readonly organizationRootId: string;
}

export class OrganizationRoot extends Construct implements IOrganizationRoot {
  public static fromOrganizationRootAttributes(scope: Construct, id: string, attrs: OrganizationRootAttributes): IOrganizationRoot {
    class Import extends Construct implements IOrganizationRoot {
      readonly organizationRootId: string = attrs.organizationRootId;
    }

    return new Import(scope, id);
  }
  public static getOrCreate(scope: Construct): IOrganizationRoot {
    const stack = Stack.of(scope);
    const id ='@aws-cdk/aws-organizations.OrganizationRoot';
    return stack.node.tryFindChild(id) as IOrganizationRoot ?? new OrganizationRoot(stack, id, {});
  }

  public readonly organizationRootId: string;

  /**
   * @internal
   */
  public constructor(scope: Construct, id: string, props?: OrganizationRootProps) {
    super(scope, id);

    props;

    const resource = new AwsCustomResource(this, 'Resource', {
      resourceType: 'Custom::OrganizationRoot',
      onUpdate: {
        service: 'Organizations',
        action: 'listRoots', // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html#listRoots-property
        region: 'us-east-1',
        physicalResourceId: PhysicalResourceId.fromResponse('Roots.0.Id'),
      },
      installLatestAwsSdk: false,
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
    });

    this.organizationRootId = resource.getResponseField('Roots.0.Id');
  }
}