import { Construct } from 'constructs';
import { CfnKeyGroup, IKeyGroupRef, IPublicKeyRef, KeyGroupReference } from './cloudfront.generated';
import { IResource, Names, Resource } from '../../core';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';

/**
 * Represents a Key Group
 */
export interface IKeyGroup extends IResource, IKeyGroupRef {
  /**
   * The ID of the key group.
   * @attribute
   */
  readonly keyGroupId: string;
}

/**
 * Properties for creating a Public Key
 */
export interface KeyGroupProps {
  /**
   * A name to identify the key group.
   * @default - generated from the `id`
   */
  readonly keyGroupName?: string;

  /**
   * A comment to describe the key group.
   * @default - no comment
   */
  readonly comment?: string;

  /**
   * A list of public keys to add to the key group.
   */
  readonly items: IPublicKeyRef[];
}

/**
 * A Key Group configuration
 *
 * @resource AWS::CloudFront::KeyGroup
 */
@propertyInjectable
export class KeyGroup extends Resource implements IKeyGroup {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-cloudfront.KeyGroup';

  /** Imports a Key Group from its id. */
  public static fromKeyGroupId(scope: Construct, id: string, keyGroupId: string): IKeyGroup {
    return new class extends Resource implements IKeyGroup {
      public readonly keyGroupId = keyGroupId;
      public readonly keyGroupRef = {
        keyGroupId: keyGroupId,
      };
    }(scope, id);
  }
  public readonly keyGroupId: string;

  public readonly keyGroupRef: KeyGroupReference;

  constructor(scope: Construct, id: string, props: KeyGroupProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    const resource = new CfnKeyGroup(this, 'Resource', {
      keyGroupConfig: {
        name: props.keyGroupName ?? this.generateName(),
        comment: props.comment,
        items: props.items.map(key => key.publicKeyRef.publicKeyId),
      },
    });

    this.keyGroupRef = resource.keyGroupRef;
    this.keyGroupId = resource.ref;
  }

  private generateName(): string {
    const name = Names.uniqueId(this);
    if (name.length > 80) {
      return name.substring(0, 40) + name.substring(name.length - 40);
    }
    return name;
  }
}
