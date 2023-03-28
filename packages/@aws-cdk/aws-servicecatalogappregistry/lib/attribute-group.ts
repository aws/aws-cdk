import { CfnResourceShare } from '@aws-cdk/aws-ram';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IApplication } from './application';
import { getPrincipalsforSharing, hashValues, ShareOptions, SharePermission } from './common';
import { InputValidator } from './private/validation';
import { CfnAttributeGroup, CfnAttributeGroupAssociation } from './servicecatalogappregistry.generated';

const ATTRIBUTE_GROUP_READ_ONLY_RAM_PERMISSION_ARN = 'arn:aws:ram::aws:permission/AWSRAMPermissionServiceCatalogAppRegistryAttributeGroupReadOnly';
const ATTRIBUTE_GROUP_ALLOW_ACCESS_RAM_PERMISSION_ARN = 'arn:aws:ram::aws:permission/AWSRAMPermissionServiceCatalogAppRegistryAttributeGroupAllowAssociation';

/**
 * A Service Catalog AppRegistry Attribute Group.
 */
export interface IAttributeGroup extends cdk.IResource {
  /**
   * The ARN of the attribute group.
   * @attribute
   */
  readonly attributeGroupArn: string;

  /**
   * The ID of the attribute group.
   * @attribute
   */
  readonly attributeGroupId: string;

  /**
   * Share the attribute group resource with other IAM entities, accounts, or OUs.
   *
   * @param id The construct name for the share.
   * @param shareOptions The options for the share.
   */
  shareAttributeGroup(id: string, shareOptions: ShareOptions): void;
}

/**
 * Properties for a Service Catalog AppRegistry Attribute Group
 */
export interface AttributeGroupProps {
  /**
   * Enforces a particular physical attribute group name.
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

abstract class AttributeGroupBase extends cdk.Resource implements IAttributeGroup {
  public abstract readonly attributeGroupArn: string;
  public abstract readonly attributeGroupId: string;
  private readonly associatedApplications: Set<string> = new Set();

  /**
   * Associate an application with attribute group
   * If the attribute group is already associated, it will ignore duplicate request.
   */
  public associateWith(application: IApplication): void {
    if (!this.associatedApplications.has(application.node.addr)) {
      const hashId = this.generateUniqueHash(application.node.addr);
      new CfnAttributeGroupAssociation(this, `ApplicationAttributeGroupAssociation${hashId}`, {
        application: application.stack === cdk.Stack.of(this) ? application.applicationId : application.applicationName ?? application.applicationId,
        attributeGroup: this.attributeGroupId,
      });

      this.associatedApplications.add(application.node.addr);
    }
  }

  public shareAttributeGroup(id: string, shareOptions: ShareOptions): void {
    const principals = getPrincipalsforSharing(shareOptions);
    new CfnResourceShare(this, id, {
      name: shareOptions.name,
      allowExternalPrincipals: false,
      principals: principals,
      resourceArns: [this.attributeGroupArn],
      permissionArns: [this.getAttributeGroupSharePermissionARN(shareOptions)],
    });
  }

  /**
   * Get the correct permission ARN based on the SharePermission
   */
  protected getAttributeGroupSharePermissionARN(shareOptions: ShareOptions): string {
    switch (shareOptions.sharePermission) {
      case SharePermission.ALLOW_ACCESS:
        return ATTRIBUTE_GROUP_ALLOW_ACCESS_RAM_PERMISSION_ARN;
      case SharePermission.READ_ONLY:
        return ATTRIBUTE_GROUP_READ_ONLY_RAM_PERMISSION_ARN;

      default:
        return shareOptions.sharePermission ?? ATTRIBUTE_GROUP_READ_ONLY_RAM_PERMISSION_ARN;
    }
  }

  /**
   * Create a unique hash
   */
  protected abstract generateUniqueHash(resourceAddress: string): string;
}

/**
 * A Service Catalog AppRegistry Attribute Group.
 */
export class AttributeGroup extends AttributeGroupBase implements IAttributeGroup {
  /**
   * Imports an attribute group construct that represents an external attribute group.
   *
   * @param scope The parent creating construct (usually `this`).
   * @param id The construct's name.
   * @param attributeGroupArn the Amazon Resource Name of the existing AppRegistry attribute group
   */
  public static fromAttributeGroupArn(scope: Construct, id: string, attributeGroupArn: string): IAttributeGroup {
    const arn = cdk.Stack.of(scope).splitArn(attributeGroupArn, cdk.ArnFormat.SLASH_RESOURCE_SLASH_RESOURCE_NAME);
    const attributeGroupId = arn.resourceName;

    if (!attributeGroupId) {
      throw new Error('Missing required Attribute Group ID from Attribute Group ARN: ' + attributeGroupArn);
    }

    class Import extends AttributeGroupBase {
      public readonly attributeGroupArn = attributeGroupArn;
      public readonly attributeGroupId = attributeGroupId!;

      protected generateUniqueHash(resourceAddress: string): string {
        return hashValues(this.attributeGroupArn, resourceAddress);
      }
    }

    return new Import(scope, id, {
      environmentFromArn: attributeGroupArn,
    });
  }

  public readonly attributeGroupArn: string;
  public readonly attributeGroupId: string;
  private readonly nodeAddress: string;

  constructor(scope: Construct, id: string, props: AttributeGroupProps) {
    super(scope, id);

    this.validateAttributeGroupProps(props);

    const attributeGroup = new CfnAttributeGroup(this, 'Resource', {
      name: props.attributeGroupName,
      description: props.description,
      attributes: props.attributes,
    });

    this.attributeGroupArn = attributeGroup.attrArn;
    this.attributeGroupId = attributeGroup.attrId;
    this.nodeAddress = cdk.Names.nodeUniqueId(attributeGroup.node);
  }

  protected generateUniqueHash(resourceAddress: string): string {
    return hashValues(this.nodeAddress, resourceAddress);
  }

  private validateAttributeGroupProps(props: AttributeGroupProps) {
    InputValidator.validateLength(this.node.path, 'attribute group name', 1, 256, props.attributeGroupName);
    InputValidator.validateRegex(this.node.path, 'attribute group name', /^[a-zA-Z0-9-_]+$/, props.attributeGroupName);
    InputValidator.validateLength(this.node.path, 'attribute group description', 0, 1024, props.description);
  }
}
