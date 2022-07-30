import { CfnResourceShare } from '@aws-cdk/aws-ram';
import * as cdk from '@aws-cdk/core';
import { Names } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IAttributeGroup } from './attribute-group';
import { getPrincipalsforSharing, hashValues, ShareOptions, SharePermission } from './common';
import { InputValidator } from './private/validation';
import { CfnApplication, CfnAttributeGroupAssociation, CfnResourceAssociation } from './servicecatalogappregistry.generated';

const APPLICATION_READ_ONLY_RAM_PERMISSION_ARN = 'arn:aws:ram::aws:permission/AWSRAMPermissionServiceCatalogAppRegistryApplicationReadOnly';
const APPLICATION_ALLOW_ACCESS_RAM_PERMISSION_ARN = 'arn:aws:ram::aws:permission/AWSRAMPermissionServiceCatalogAppRegistryApplicationAllowAssociation';

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
   * Associate thisapplication with an attribute group.
   *
   * @param attributeGroup AppRegistry attribute group
   */
  associateAttributeGroup(attributeGroup: IAttributeGroup): void;

  /**
   * Associate this application with a CloudFormation stack.
   *
   * @param stack a CFN stack
   */
  associateStack(stack: cdk.Stack): void;

  /**
   * Share this application with other IAM entities, accounts, or OUs.
   *
   * @param shareOptions The options for the share.
   */
  shareApplication(shareOptions: ShareOptions): void;
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
  private readonly associatedAttributeGroups: Set<string> = new Set();
  private readonly associatedResources: Set<string> = new Set();

  /**
   * Associate an attribute group with application
   * If the attribute group is already associated, it will ignore duplicate request.
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
   * Associate a stack with the application
   * If the resource is already associated, it will ignore duplicate request.
   * A stack can only be associated with one application.
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
   * Share an application with accounts, organizations and OUs, and IAM roles and users.
   * The application will become available to end users within those principals.
   *
   * @param shareOptions The options for the share.
   */
  public shareApplication(shareOptions: ShareOptions): void {
    const principals = getPrincipalsforSharing(shareOptions);
    const shareName = `RAMShare${hashValues(Names.nodeUniqueId(this.node), this.node.children.length.toString())}`;
    new CfnResourceShare(this, shareName, {
      name: shareName,
      allowExternalPrincipals: false,
      principals: principals,
      resourceArns: [this.applicationArn],
      permissionArns: [this.getApplicationSharePermissionARN(shareOptions)],
    });
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
}

/**
 * A Service Catalog AppRegistry Application.
 */
export class Application extends ApplicationBase {
  /**
   * Imports an Application construct that represents an external application.
   *
   * @param scope The parent creating construct (usually `this`).
   *
   * @param id The construct's name.
   *
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

      protected generateUniqueHash(resourceAddress: string): string {
        return hashValues(this.applicationArn, resourceAddress);
      }
    }

    return new Import(scope, id, {
      environmentFromArn: applicationArn,
    });
  }

  public readonly applicationArn: string;
  public readonly applicationId: string;
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
    this.nodeAddress = cdk.Names.nodeUniqueId(application.node);
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
