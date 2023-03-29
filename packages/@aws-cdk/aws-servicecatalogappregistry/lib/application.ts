import { CfnResourceShare } from '@aws-cdk/aws-ram';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { StageStackAssociator } from './aspects/stack-associator';
import { AttributeGroup, IAttributeGroup } from './attribute-group';
import { getPrincipalsforSharing, hashValues, ShareOptions, SharePermission } from './common';
import { isAccountUnresolved } from './private/utils';
import { InputValidator } from './private/validation';
import { CfnApplication, CfnAttributeGroupAssociation, CfnResourceAssociation } from './servicecatalogappregistry.generated';

const APPLICATION_READ_ONLY_RAM_PERMISSION_ARN = 'arn:aws:ram::aws:permission/AWSRAMPermissionServiceCatalogAppRegistryApplicationReadOnly';
const APPLICATION_ALLOW_ACCESS_RAM_PERMISSION_ARN = 'arn:aws:ram::aws:permission/AWSRAMPermissionServiceCatalogAppRegistryApplicationAllowAssociation';

/**
 * Properties for a Service Catalog AppRegistry Attribute Group
 */
export interface AttributeGroupAssociationProps {
  /**
   * Name for attribute group.
   *
   */
  readonly attributeGroupName: string;

  /**
   * Description for attribute group.
   * @default - No description provided
   */
  readonly description?: string;

  /**
   * A JSON of nested key-value pairs that represent the attributes in the group.
   * Attributes maybe an empty JSON '{}', but must be explicitly stated.
   */
  readonly attributes: { [key: string]: any };
}

/**
 * A Service Catalog AppRegistry Application.
 */
export interface IApplication extends cdk.IResource {
  /**
   * The ARN of the application.
   * @attribute
   */
  readonly applicationArn: string;

  /**
   * The ID of the application.
   * @attribute
   */
  readonly applicationId: string;

  /**
   * The name of the application.
   * @attribute
   */
  readonly applicationName?: string;

  /**
   * Associate this application with an attribute group.
   *
   * @param attributeGroup AppRegistry attribute group
   */
  associateAttributeGroup(attributeGroup: IAttributeGroup): void;

  /**
   * Create an attribute group and associate this application with the created attribute group.
   *
   * @param id name of the AttributeGroup construct to be created.
   * @param attributeGroupProps AppRegistry attribute group props
   */
  addAttributeGroup(id: string, attributeGroupProps: AttributeGroupAssociationProps): IAttributeGroup;

  /**
   * Associate this application with a CloudFormation stack.
   *
   * @deprecated Use `associateApplicationWithStack` instead.
   * @param stack a CFN stack
   */
  associateStack(stack: cdk.Stack): void;

  /**
   * Associate a Cloudformation statck with the application in the given stack.
   *
   * @param stack a CFN stack
   */
  associateApplicationWithStack(stack: cdk.Stack): void;

  /**
   * Share this application with other IAM entities, accounts, or OUs.
   *
   * @param id The construct name for the share.
   * @param shareOptions The options for the share.
   */
  shareApplication(id: string, shareOptions: ShareOptions): void;

  /**
   * Associate this application with all stacks under the construct node.
   * NOTE: This method won't automatically register stacks under pipeline stages,
   * and requires association of each pipeline stage by calling this method with stage Construct.
   *
   * @param construct cdk Construct
   */
  associateAllStacksInScope(construct: Construct): void;

}

/**
 * Properties for a Service Catalog AppRegistry Application
 */
export interface ApplicationProps {
  /**
   * Enforces a particular physical application name.
   */
  readonly applicationName: string;

  /**
   * Description for application.
   * @default - No description provided
   */
  readonly description?: string;
}

abstract class ApplicationBase extends cdk.Resource implements IApplication {
  public abstract readonly applicationArn: string;
  public abstract readonly applicationId: string;
  public abstract readonly applicationName?: string;
  private readonly associatedAttributeGroups: Set<string> = new Set();
  private readonly associatedResources: Set<string> = new Set();

  /**
   * Associate an attribute group with application
   * If the attribute group is already associated, it will ignore duplicate request.
   *
   * @deprecated Use `AttributeGroup.associateWith` instead.
   */
  public associateAttributeGroup(attributeGroup: IAttributeGroup): void {
    if (!this.associatedAttributeGroups.has(attributeGroup.node.addr)) {
      const hashId = this.generateUniqueHash(attributeGroup.node.addr);
      new CfnAttributeGroupAssociation(this, `AttributeGroupAssociation${hashId}`, {
        application: this.applicationId,
        attributeGroup: attributeGroup.attributeGroupId,
      });
      this.associatedAttributeGroups.add(attributeGroup.node.addr);
    }
  }

  /**
   * Create an attribute group and associate this application with the created attribute group.
   */
  public addAttributeGroup(id: string, props: AttributeGroupAssociationProps): IAttributeGroup {
    const attributeGroup = new AttributeGroup(this, id, {
      attributeGroupName: props.attributeGroupName,
      attributes: props.attributes,
      description: props.description,
    });
    new CfnAttributeGroupAssociation(this, `AttributeGroupAssociation${this.generateUniqueHash(attributeGroup.node.addr)}`, {
      application: this.applicationId,
      attributeGroup: attributeGroup.attributeGroupId,
    });
    this.associatedAttributeGroups.add(attributeGroup.node.addr);
    return attributeGroup;
  }

  /**
   * Associate a stack with the application
   * If the resource is already associated, it will ignore duplicate request.
   * A stack can only be associated with one application.
   *
   * @deprecated Use `associateApplicationWithStack` instead.
   */
  public associateStack(stack: cdk.Stack): void {
    if (!this.associatedResources.has(stack.node.addr)) {
      const hashId = this.generateUniqueHash(stack.node.addr);
      new CfnResourceAssociation(this, `ResourceAssociation${hashId}`, {
        application: this.applicationId,
        resource: stack.stackId,
        resourceType: 'CFN_STACK',
      });
      this.associatedResources.add(stack.node.addr);
    }
  }

  /**
   * Associate stack with the application in the stack passed as parameter.
   *
   * A stack can only be associated with one application.
   */
  public associateApplicationWithStack(stack: cdk.Stack): void {
    if (!this.associatedResources.has(stack.node.addr)) {
      new CfnResourceAssociation(stack, 'AppRegistryAssociation', {
        application: stack === cdk.Stack.of(this) ? this.applicationId : this.applicationName ?? this.applicationId,
        resource: stack.stackId,
        resourceType: 'CFN_STACK',
      });

      this.associatedResources.add(stack.node.addr);
      if (stack !== cdk.Stack.of(this) && this.isSameAccount(stack) && !this.isStageScope(stack) && !stack.nested) {
        stack.addDependency(cdk.Stack.of(this));
      }
    }
  }

  /**
   * Share an application with accounts, organizations and OUs, and IAM roles and users.
   * The application will become available to end users within those principals.
   *
   * @param id The construct name for the share.
   * @param shareOptions The options for the share.
   */
  public shareApplication(id: string, shareOptions: ShareOptions): void {
    const principals = getPrincipalsforSharing(shareOptions);
    new CfnResourceShare(this, id, {
      name: shareOptions.name,
      allowExternalPrincipals: false,
      principals: principals,
      resourceArns: [this.applicationArn],
      permissionArns: [this.getApplicationSharePermissionARN(shareOptions)],
    });
  }

  /**
   * Associate all stacks present in construct's aspect with application, including cross-account stacks.
   *
   * NOTE: This method won't automatically register stacks under pipeline stages,
   * and requires association of each pipeline stage by calling this method with stage Construct.
   *
   */
  public associateAllStacksInScope(scope: Construct): void {
    cdk.Aspects.of(scope).add(new StageStackAssociator(this, {
      associateCrossAccountStacks: true,
    }));
  }

  /**
   * Create a unique id
   */
  protected abstract generateUniqueHash(resourceAddress: string): string;

  /**
   * Get the correct permission ARN based on the SharePermission
   */
  private getApplicationSharePermissionARN(shareOptions: ShareOptions): string {
    switch (shareOptions.sharePermission) {
      case SharePermission.ALLOW_ACCESS:
        return APPLICATION_ALLOW_ACCESS_RAM_PERMISSION_ARN;
      case SharePermission.READ_ONLY:
        return APPLICATION_READ_ONLY_RAM_PERMISSION_ARN;

      default:
        return shareOptions.sharePermission ?? APPLICATION_READ_ONLY_RAM_PERMISSION_ARN;
    }
  }

  /**
  *  Checks whether a stack is defined in a Stage or not.
  */
  private isStageScope(stack : cdk.Stack): boolean {
    return !(stack.node.scope instanceof cdk.App) && (stack.node.scope instanceof cdk.Stage);
  }

  /**
   * Verifies if application and the visited node is deployed in different account.
   */
  private isSameAccount(stack: cdk.Stack): boolean {
    return isAccountUnresolved(this.env.account, stack.account) || this.env.account === stack.account;
  }

}

/**
 * A Service Catalog AppRegistry Application.
 */
export class Application extends ApplicationBase {
  /**
   * Imports an Application construct that represents an external application.
   *
   * @param scope The parent creating construct (usually `this`).
   * @param id The construct's name.
   * @param applicationArn the Amazon Resource Name of the existing AppRegistry Application
   */
  public static fromApplicationArn(scope: Construct, id: string, applicationArn: string): IApplication {
    const arn = cdk.Stack.of(scope).splitArn(applicationArn, cdk.ArnFormat.SLASH_RESOURCE_SLASH_RESOURCE_NAME);
    const applicationId = arn.resourceName;

    if (!applicationId) {
      throw new Error('Missing required Application ID from Application ARN: ' + applicationArn);
    }

    class Import extends ApplicationBase {
      public readonly applicationArn = applicationArn;
      public readonly applicationId = applicationId!;
      public readonly applicationName = undefined;

      protected generateUniqueHash(resourceAddress: string): string {
        return hashValues(this.applicationArn, resourceAddress);
      }
    }

    return new Import(scope, id, {
      environmentFromArn: applicationArn,
    });
  }

  /**
   * Application manager URL for the Application.
   * @attribute
   */
  public readonly applicationManagerUrl?: string;
  public readonly applicationArn: string;
  public readonly applicationId: string;
  public readonly applicationName?: string;
  private readonly nodeAddress: string;

  constructor(scope: Construct, id: string, props: ApplicationProps) {
    super(scope, id);

    this.validateApplicationProps(props);

    const application = new CfnApplication(this, 'Resource', {
      name: props.applicationName,
      description: props.description,
    });

    this.applicationArn = application.attrArn;
    this.applicationId = application.attrId;
    this.applicationName = props.applicationName;
    this.nodeAddress = cdk.Names.nodeUniqueId(application.node);

    this.applicationManagerUrl =
        `https://${this.env.region}.console.aws.amazon.com/systems-manager/appmanager/application/AWS_AppRegistry_Application-${this.applicationName}`;
  }

  protected generateUniqueHash(resourceAddress: string): string {
    return hashValues(this.nodeAddress, resourceAddress);
  }

  private validateApplicationProps(props: ApplicationProps) {
    InputValidator.validateLength(this.node.path, 'application name', 1, 256, props.applicationName);
    InputValidator.validateRegex(this.node.path, 'application name', /^[a-zA-Z0-9-_]+$/, props.applicationName);
    InputValidator.validateLength(this.node.path, 'application description', 0, 1024, props.description);
  }
}
