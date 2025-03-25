import { Construct } from 'constructs';
import { CfnPrefixList } from './ec2.generated';
import * as cxschema from '../../cloud-assembly-schema';
import { IResource, Lazy, Resource, Names, ContextProvider, Token, ValidationError } from '../../core';
import { addConstructMetadata } from '../../core/lib/metadata-resource';

/**
 * A prefix list
 */
export interface IPrefixList extends IResource {
  /**
   * The ID of the prefix list
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
 * Options to add a prefix list
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
 * The base class for a prefix list
 */
abstract class PrefixListBase extends Resource implements IPrefixList {
  /**
   * The ID of the prefix list
   *
   * @attribute
   */
  public abstract readonly prefixListId: string;
}

/**
 * Properties for looking up an existing managed prefix list.
 */
export interface PrefixListLookupOptions {
  /**
   * The name of the managed prefix list.
   */
  readonly prefixListName: string;
  /**
   * The ID of the AWS account that owns the managed prefix list.
   *
   * @default - Don't filter on ownerId
   */
  readonly ownerId?: string;
  /**
   * The address family of the managed prefix list.
   *
   * @default - Don't filter on addressFamily
   */
  readonly addressFamily?: AddressFamily;
}

/**
 * Result of CC API context query in fromLookup()
 */
interface PrefixListContextResponse {
  /**
   * The id of the prefix list
   */
  readonly PrefixListId: string;
}

/**
 * A managed prefix list.
 * @resource AWS::EC2::PrefixList
 */
export class PrefixList extends PrefixListBase {
  /**
   * Look up prefix list by id.
   */
  public static fromPrefixListId(scope: Construct, id: string, prefixListId: string): IPrefixList {
    class Import extends Resource implements IPrefixList {
      public readonly prefixListId = prefixListId;
    }
    return new Import(scope, id);
  }

  /**
   * Look up prefix list by name
   */
  public static fromLookup(scope: Construct, id: string, options: PrefixListLookupOptions): IPrefixList {
    if (Token.isUnresolved(options.prefixListName)) {
      throw new ValidationError('All arguments to look up a managed prefix list must be concrete (no Tokens)', scope);
    }

    const dummyResponse = { PrefixListId: 'pl-xxxxxxxx' };
    const response: PrefixListContextResponse[] = ContextProvider.getValue(scope, {
      provider: cxschema.ContextProvider.CC_API_PROVIDER,
      props: {
        typeName: 'AWS::EC2::PrefixList',
        propertyMatch: {
          PrefixListName: options.prefixListName,
          ...(options.ownerId ? { OwnerId: options.ownerId } : undefined),
          ...(options.addressFamily ? { AddressFamily: options.addressFamily } : undefined),
        },
        propertiesToReturn: ['PrefixListId'],
      } satisfies Omit<cxschema.CcApiContextQuery, 'account'|'region'>,
      dummyValue: [dummyResponse] satisfies PrefixListContextResponse[],
    }).value;

    // getValue returns a list of result objects. We are expecting 1 result or Error.
    if (response.length === 0) {
      throw new ValidationError(`Could not find any managed prefix lists matching ${JSON.stringify(options)}`, scope);
    } else if (response.length > 1) {
      throw new ValidationError(`Found ${response.length} managed prefix lists matching ${JSON.stringify(options)}; please narrow the search criteria`, scope);
    }

    const prefixList = response[0];
    return this.fromPrefixListId(scope, id, prefixList.PrefixListId);
  }

  /**
   * The ID of the prefix list
   *
   * @attribute
   */
  public readonly prefixListId: string;

  /**
   * The name of the prefix list
   *
   * @attribute
   */
  public readonly prefixListName: string;

  /**
   * The ARN of the prefix list
   *
   * @attribute
   */
  public readonly prefixListArn: string;

  /**
   * The owner ID of the prefix list
   *
   */
  public readonly ownerId: string;

  /**
   * The version of the prefix list
   *
   */
  public readonly version: number;

  /**
   * The address family of the prefix list
   *
   */
  public readonly addressFamily: string;

  constructor(scope: Construct, id: string, props?: PrefixListProps) {
    super(scope, id, {
      physicalName: props?.prefixListName ?? Lazy.string({
        produce: () => Names.uniqueResourceName(this, { maxLength: 255, allowedSpecialCharacters: '.-_' }),
      }),
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    if (props?.prefixListName) {
      if ( props.prefixListName.startsWith('com.amazonaws')) {
        throw new Error('The name cannot start with \'com.amazonaws.\'');
      }
      if (props.prefixListName.length > 255 ) {
        throw new Error('Lengths exceeding 255 characters cannot be set.');
      }
    }

    this.prefixListName = this.physicalName;

    let defaultMaxEntries = 1;
    if (props?.entries && props.entries.length > 0) {
      const entries = props.entries;
      // Regular expressions for validating IPv6 addresses
      if (props?.addressFamily === AddressFamily.IP_V6) {
        const ipv6Regex = /^s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:)))(%.+)?s*(\/([0-9]|[1-9][0-9]|1[0-1][0-9]|12[0-8]))?$/i;
        for (const entry of entries) {
          if (!ipv6Regex.test(entry.cidr)) {
            throw new Error(`Invalid IPv6 address range: ${entry.cidr}`);
          }
        }
      // Regular expressions for validating IPv4 addresses
      } else {
        const ipv4Regex = /^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$/i;
        for (const entry of entries) {
          if (!ipv4Regex.test(entry.cidr)) {
            throw new Error(`Invalid IPv4 address range: ${entry.cidr}`);
          }
        }
      }

      defaultMaxEntries = props.entries.length;
    }

    const prefixList = new CfnPrefixList(this, 'Resource', {
      addressFamily: props?.addressFamily || AddressFamily.IP_V4,
      maxEntries: props?.maxEntries || defaultMaxEntries,
      prefixListName: this.prefixListName,
      entries: props?.entries || [],
    });

    this.prefixListId = prefixList.attrPrefixListId;
    this.prefixListArn = prefixList.attrArn;
    this.ownerId = prefixList.attrOwnerId;
    this.version = prefixList.attrVersion;
    this.addressFamily = prefixList.addressFamily;
  }
}
