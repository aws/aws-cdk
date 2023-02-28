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

export enum AddressFamily {
  IP_V4 = 'IPv4',
  IP_V6 = 'IPv6',
}

// export interface Entry extends CfnPrefixList.EntryProperty {
//   readonly Cidr: string,
//   readonly Discription?: string,
// }


/**
 * Options to add a flow log to a VPC
 */
export interface PrefixListOptions {
  /**
   * The type of traffic to log. You can log traffic that the resource accepts or rejects, or all traffic.
   *
   * @default Automatically calculated
   */
  readonly maxEntries?: number;
}

/**
 * Properties of a VPC Flow Log
 */
export interface PrefixListProps extends PrefixListOptions {
  /**
   * The name of the FlowLog
   *
   * It is not recommended to use an explicit name.
   *
   * @default AddressFamily.IP_V4
   */
  readonly addressFamily?: AddressFamily;

  /**
   * A name for the prefix list.
   */
  readonly prefixListName?: string;

  /**
   * A name for the prefix list.
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
   * The Id of the Prefix List
   *
   * @attribute
   */
  public readonly prefixListId: string;
  /**
   * The Name of the Prefix List
   *
   */
  public readonly name: string;

  constructor(scope: Construct, id: string, props: PrefixListProps) {
    super(scope, id, {
      physicalName: props.prefixListName,
    });

    if (props.prefixListName) {
      if ( props.prefixListName.startsWith('com.amazonaws')) {
        throw new Error('The name cannot start with \'com.amazonaws.\'');
      };
      if (props.prefixListName.length > 255 ) {
        throw new Error('Lengths exceeding 255 characters cannot be set.');
      };
    };

    this.name = props.prefixListName || id;

    if (!props.maxEntries && !props.entries) {
      throw new Error('Set maxEntries or enrties.');
    }

    const prefixList = new CfnPrefixList(this, 'PrefixList', {
      addressFamily: props.addressFamily || AddressFamily.IP_V4,
      maxEntries: props.maxEntries || props.entries!.length,
      prefixListName: this.name,
      entries: props.entries || [],
    });

    this.prefixListId = prefixList.ref;
    this.node.defaultChild = prefixList;
  }
}
