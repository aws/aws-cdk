import { CfnResourceShare } from 'aws-cdk-lib/aws-ram';
import { CfnAttributeGroup, CfnAttributeGroupAssociation } from 'aws-cdk-lib/aws-servicecatalogappregistry';
import * as cdk from 'aws-cdk-lib/core';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import type { Construct } from 'constructs';
import type { IApplication } from './application';
import type { ShareOptions } from './common';
import { getPrincipalsforSharing, hashValues, SharePermission } from './common';
import { InputValidator } from './private/validation';

const ATTRIBUTE_GROUP_READ_ONLY_RAM_PERMISSION_ARN = `arn:${cdk.Aws.PARTITION}:ram::aws:permission/AWSRAMPermissionServiceCatalogAppRegistryAttributeGroupReadOnly`;
const ATTRIBUTE_GROUP_ALLOW_ACCESS_RAM_PERMISSION_ARN = `arn:${cdk.Aws.PARTITION}:ram::aws:permission/AWSRAMPermissionServiceCatalogAppRegistryAttributeGroupAllowAssociation`;

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
   * The attributes that compose the attribute group, as a JSON of nested key-value pairs.
   *
   * For an attribute group created in this stack, these are the attributes supplied at creation.
   * For an attribute group imported via `fromAttributeGroupAttributes`, these are the attributes passed
   * at import time, since AppRegistry does not return attributes from an ARN.
   *
   * @default - the attributes supplied at creation; for imports, the attributes passed to
   * `fromAttributeGroupAttributes`, or `undefined` if none were provided
   */
  readonly attributes?: { [key: string]: any };

  /**
   * Share the attribute group resource with other IAM entities, accounts, or OUs.
   *
   * @param id The construct name for the share.
   * @param shareOptions The options for the share.
   */
  shareAttributeGroup(id: string, shareOptions: ShareOptions): void;

  /**
   * Associate an application with attribute group
   * If the attribute group is already associated, it will ignore duplicate request.
   */
  associateWith(application: IApplication): void;
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

/**
 * Properties for importing an existing Service Catalog AppRegistry Attribute Group.
 */
export interface AttributeGroupAttributes {
  /**
   * The Amazon Resource Name (ARN) of the existing AppRegistry attribute group.
   */
  readonly attributeGroupArn: string;

  /**
   * The attributes that compose the attribute group, as a JSON of nested key-value pairs.
   *
   * AppRegistry does not return attributes from an ARN, so provide them here if your stack needs to
   * read them back via the imported attribute group's `attributes` property.
   *
   * @default - the imported attribute group's `attributes` resolves to `undefined`
   */
  readonly attributes?: { [key: string]: any };
}

abstract class AttributeGroupBase extends cdk.Resource implements IAttributeGroup {
  public abstract readonly attributeGroupArn: string;
  public abstract readonly attributeGroupId: string;
  public abstract readonly attributes?: { [key: string]: any };
  private readonly associatedApplications: Set<string> = new Set();

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
@propertyInjectable
export class AttributeGroup extends AttributeGroupBase implements IAttributeGroup {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-servicecatalogappregistry-alpha.AttributeGroup';

  /**
   * Imports an attribute group construct that represents an external attribute group.
   *
   * The imported attribute group's `attributes` property resolves to `undefined`. Use
   * `fromAttributeGroupAttributes` instead if you need it populated.
   *
   * @param scope The parent creating construct (usually `this`).
   * @param id The construct's name.
   * @param attributeGroupArn the Amazon Resource Name of the existing AppRegistry attribute group
   */
  public static fromAttributeGroupArn(scope: Construct, id: string, attributeGroupArn: string): IAttributeGroup {
    return AttributeGroup.fromAttributeGroupAttributes(scope, id, { attributeGroupArn });
  }

  /**
   * Imports an attribute group construct that represents an external attribute group, including its
   * attributes.
   *
   * Use this instead of `fromAttributeGroupArn` when you want the imported attribute group's
   * `attributes` property to be populated, since AppRegistry does not return attributes from an ARN.
   *
   * @param scope The parent creating construct (usually `this`).
   * @param id The construct's name.
   * @param attrs the attributes of the existing AppRegistry attribute group being imported.
   */
  public static fromAttributeGroupAttributes(scope: Construct, id: string, attrs: AttributeGroupAttributes): IAttributeGroup {
    const arn = cdk.Stack.of(scope).splitArn(attrs.attributeGroupArn, cdk.ArnFormat.SLASH_RESOURCE_SLASH_RESOURCE_NAME);
    const attributeGroupId = arn.resourceName;

    if (!attributeGroupId) {
      throw new Error('Missing required Attribute Group ID from Attribute Group ARN: ' + attrs.attributeGroupArn);
    }

    class Import extends AttributeGroupBase {
      public readonly attributeGroupArn = attrs.attributeGroupArn;
      public readonly attributeGroupId = attributeGroupId!;
      public readonly attributes = attrs.attributes;

      protected generateUniqueHash(resourceAddress: string): string {
        return hashValues(this.attributeGroupArn, resourceAddress);
      }
    }

    return new Import(scope, id, {
      environmentFromArn: attrs.attributeGroupArn,
    });
  }

  public readonly attributeGroupArn: string;
  public readonly attributeGroupId: string;
  public readonly attributes?: { [key: string]: any };
  private readonly nodeAddress: string;

  constructor(scope: Construct, id: string, props: AttributeGroupProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.validateAttributeGroupProps(props);

    const attributeGroup = new CfnAttributeGroup(this, 'Resource', {
      name: props.attributeGroupName,
      description: props.description,
      attributes: props.attributes,
    });

    this.attributeGroupArn = attributeGroup.attrArn;
    this.attributeGroupId = attributeGroup.attrId;
    this.attributes = props.attributes;
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
