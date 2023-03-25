import { IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnPrefixList } from './ec2.generated';

/**
 * A Prefix List
 */
export interface IPrefixList extends IResource {
  /**
   * The Id of the Prefix List
   *
   * @attribute
   */
  readonly prefixListId: string;
}

/**
 * The IP address type.
 */
export enum AddressFamily {
  IP_V4 = 'IPv4',
  IP_V6 = 'IPv6',
}

/**
 * Options to add a prefixlist
 */
export interface PrefixListOptions {
  /**
   * The maximum number of entries for the prefix list.
   *
   * @default Automatically-calculated
   */
  readonly maxEntries?: number;
}

/**
 * Properties for creating a prefix list.
 */
export interface PrefixListProps extends PrefixListOptions {
  /**
   * The address family of the prefix list.
   *
   * @default AddressFamily.IP_V4
   */
  readonly addressFamily?: AddressFamily;

  /**
   * The name of the prefix list.
   *
   * @default None
   *
   * @remarks
   * It is not recommended to use an explicit name.
   */
  readonly prefixListName?: string;

  /**
   * The list of entries for the prefix list.
   *
   * @default []
   */
  readonly entries?: CfnPrefixList.EntryProperty[];
}

/**
 * The base class for a Prefix List
 */
abstract class PrefixListBase extends Resource implements IPrefixList {
  /**
   * The Id of the Prefix List
   *
   * @attribute
   */
  public abstract readonly prefixListId: string;
}

/**
 * A managed prefix list.
 * @resource AWS::EC2::PrefixList
 */
export class PrefixList extends PrefixListBase {
  /**
   * Look up prefix list by id.
   *
   */
  public static fromPrefixListId(scope: Construct, id: string, prefixListId: string): IPrefixList {
    class Import extends Resource implements IPrefixList {
      public readonly prefixListId = prefixListId;
    }
    return new Import(scope, id);
  }
  /**
   * The Id of the Prefix List
   *
   * @attribute
   */
  public readonly prefixListId: string;

  /**
   * The Name of the Prefix List
   *
   */
  public readonly prefixListName: string;

  /**
   * The ARN of the Prefix List
   *
   */
  public readonly prefixListArn: string;

  /**
   * The OwnerId of the Prefix List
   *
   */
  public readonly ownerId: string;

  /**
   * The Version of the Prefix List
   *
   */
  public readonly version: number;

  /**
   * The AddressFamily of the Prefix List
   *
   */
  public readonly addressFamily: string;

  constructor(scope: Construct, id: string, props?: PrefixListProps) {
    super(scope, id, {
      physicalName: props?.prefixListName,
    });

    if (props?.prefixListName) {
      if ( props.prefixListName.startsWith('com.amazonaws')) {
        throw new Error('The name cannot start with \'com.amazonaws.\'');
      };
      if (props.prefixListName.length > 255 ) {
        throw new Error('Lengths exceeding 255 characters cannot be set.');
      };
    };

    this.prefixListName = props?.prefixListName || id;

    if (!props?.maxEntries && !props?.entries) {
      throw new Error('Set maxEntries or enrties.');
    }

    const prefixList = new CfnPrefixList(this, 'PrefixList', {
      addressFamily: props.addressFamily || AddressFamily.IP_V4,
      maxEntries: props.maxEntries || props.entries!.length,
      prefixListName: this.prefixListName,
      entries: props.entries || [],
    });

    this.prefixListId = prefixList.attrPrefixListId;
    this.prefixListArn = prefixList.attrArn;
    this.ownerId = prefixList.attrOwnerId;
    this.version = prefixList.attrVersion;
    this.addressFamily = prefixList.addressFamily;

    this.node.defaultChild = prefixList;
  }
}
