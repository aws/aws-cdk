/*eslint no-bitwise: ["error", { "allow": ["~", "|", "<<", "&"] }] */

import { ISubnet, SubnetType } from 'aws-cdk-lib/aws-ec2';

/**
 * Turn an arbitrary string into one that can be used as a CloudFormation identifier by stripping special characters
 *
 * (At the moment, no efforts are taken to prevent collisions, but we can add that later when it becomes necessary).
 */
export function slugify(x: string): string {
  return x.replace(/[^a-zA-Z0-9]/g, '');
}

/**
 * The default names for every subnet type
 */
export function defaultSubnetName(type: SubnetType) {
  switch (type) {
    case SubnetType.PUBLIC: return 'Public';
    case SubnetType.PRIVATE_WITH_NAT:
    case SubnetType.PRIVATE_WITH_EGRESS:
    case SubnetType.PRIVATE:
      return 'Private';
    case SubnetType.PRIVATE_ISOLATED:
    case SubnetType.ISOLATED:
      return 'Isolated';
  }
}

/**
 * Return a subnet name from its construct ID
 *
 * All subnet names look like NAME <> "Subnet" <> INDEX
 */
export function subnetGroupNameFromConstructId(subnet: ISubnet) {
  return subnet.node.id.replace(/Subnet\d+$/, '');
}

/**
 * Make the subnet construct ID from a name and number
 */
export function subnetId(name: string, i: number) {
  return `${name}Subnet${i + 1}`;
}

/**
 * Generate the list of numbers of [0..n)
 */
export function range(n: number): number[] {
  const ret: number[] = [];
  for (let i = 0; i < n; i++) {
    ret.push(i);
  }
  return ret;
}

/**
 * Return the union of table IDs from all selected subnets
 */
export function allRouteTableIds(subnets: ISubnet[]): string[] {
  const ret = new Set<string>();
  for (const subnet of subnets) {
    if (subnet.routeTable && subnet.routeTable.routeTableId) {
      ret.add(subnet.routeTable.routeTableId);
    }
  }
  return Array.from(ret);
}

export function flatten<A>(xs: A[][]): A[] {
  return Array.prototype.concat.apply([], xs);
}

/**
 * NetworkUtils contains helpers to work with network constructs (subnets/ranges)
 */
export class NetworkUtils {

  /**
   * Validates an IPv4 string
   *
   * returns true of the string contains 4 numbers between 0-255 delimited by
   * a `.` character
   */
  public static validIp(ipAddress: string): boolean {
    const octets = ipAddress.split('.');
    if (octets.length !== 4) {
      return false;
    }
    return octets.map((octet: string) => parseInt(octet, 10)).
      filter((octet: number) => octet >= 0 && octet <= 255).length === 4;
  }

  /**
   * Converts a string IPv4 to a number
   *
   * takes an IP Address (e.g. 174.66.173.168) and converts to a number
   * (e.g 2923605416); currently only supports IPv4
   *
   * Uses the formula:
   * (first octet * 256³) + (second octet * 256²) + (third octet * 256) +
   * (fourth octet)
   *
   * @param  {string} the IP address (e.g. 174.66.173.168)
   * @returns {number} the integer value of the IP address (e.g 2923605416)
   */
  public static ipToNum(ipAddress: string): number {
    if (!this.validIp(ipAddress)) {
      throw new Error(`${ipAddress} is not valid`);
    }

    return ipAddress
      .split('.')
      .reduce(
        (p: number, c: string, i: number) => p + parseInt(c, 10) * 256 ** (3 - i),
        0,
      );
  }

  /**
   * Takes number and converts it to IPv4 address string
   *
   * Takes a number (e.g 2923605416) and converts it to an IPv4 address string
   * currently only supports IPv4
   *
   * @param  {number} the integer value of the IP address (e.g 2923605416)
   * @returns {string} the IPv4 address (e.g. 174.66.173.168)
   */
  public static numToIp(ipNum: number): string {
    // this all because bitwise math is signed
    let remaining = ipNum;
    const address = new Array<number>();
    for (let i = 0; i < 4; i++) {
      if (remaining !== 0) {
        address.push(Math.floor(remaining / 256 ** (3 - i)));
        remaining = remaining % 256 ** (3 - i);
      } else {
        address.push(0);
      }
    }
    const ipAddress: string = address.join('.');
    if ( !this.validIp(ipAddress) ) {
      throw new Error(`${ipAddress} is not a valid IP Address`);
    }
    return ipAddress;
  }
}

export class CidrBlock {

  /**
   * Calculates the netmask for a given CIDR mask
   *
   * For example:
   * CidrBlock.calculateNetmask(24) returns '255.255.255.0'
   */
  public static calculateNetmask(mask: number): string {
    return NetworkUtils.numToIp(2 ** 32 - 2 ** (32 - mask));
  }

  /**
   * Calculates the number IP addresses in a CIDR Mask
   *
   * For example:
   * CidrBlock.calculateNetsize(24) returns 256
   */
  public static calculateNetsize(mask: number): number {
    return 2 ** (32 - mask);
  }

  /*
   * The CIDR Block represented as a string e.g. '10.0.0.0/21'
   */
  public readonly cidr: string;

  /*
   * The CIDR mask e.g. for CIDR '10.0.0.0/21' returns 21
   */
  public readonly mask: number;

  /*
   * The total number of IP addresses in the CIDR
   */
  public readonly networkSize: number;

  /*
   * The network address provided in CIDR creation offset by the Netsize -1
   */
  private readonly networkAddress: number;

  /*
   * Parses either CIDR notation String or two numbers representing the IP
   * space
   *
   * cidr expects a string '10.0.0.0/16'
   * ipAddress expects a number
   * mask expects a number
   *
   * If the given `cidr` or `ipAddress` is not the beginning of the block,
   * then the next available block will be returned. For example, if
   * `10.0.3.1/28` is given the returned block will represent `10.0.3.16/28`.
   */
  constructor(cidr: string)
  constructor(ipAddress: number, mask: number)
  constructor(ipAddressOrCidr: string | number, mask?: number) {
    if (typeof ipAddressOrCidr === 'string') {
      this.mask = parseInt(ipAddressOrCidr.split('/')[1], 10);
      this.networkAddress = NetworkUtils.ipToNum(ipAddressOrCidr.split('/')[0]) +
        CidrBlock.calculateNetsize(this.mask) - 1;
    } else {
      if (typeof mask === 'number') {
        this.mask = mask;
      } else {
        // this should be impossible
        this.mask = 16;
      }
      this.networkAddress = ipAddressOrCidr + CidrBlock.calculateNetsize(this.mask) - 1;
      this.networkSize = 2 ** (32 - this.mask);
    }
    this.networkSize = 2 ** (32 - this.mask);
    this.cidr = `${this.minIp()}/${this.mask}`;
  }

  /*
   * The maximum IP in the CIDR Block e.g. '10.0.8.255'
   */
  public maxIp(): string {
    // min + (2^(32-mask)) - 1 [zero needs to count]
    return NetworkUtils.numToIp(this.maxAddress());
  }

  /*
   * The minimum IP in the CIDR Block e.g. '10.0.0.0'
   */
  public minIp(): string {
    return NetworkUtils.numToIp(this.minAddress());
  }

  /*
   * Returns the number representation for the minimum IPv4 address
   */
  public minAddress(): number {
    const div = this.networkAddress % this.networkSize;
    return this.networkAddress - div;
  }

  /*
   * Returns the number representation for the maximum IPv4 address
   */
  public maxAddress(): number {
    // min + (2^(32-mask)) - 1 [zero needs to count]
    return this.minAddress() + this.networkSize - 1;
  }

  /*
   * Returns the next CIDR Block of the same mask size
   */
  public nextBlock(): CidrBlock {
    return new CidrBlock(this.maxAddress() + 1, this.mask);
  }

  /*
   * Returns true if this CidrBlock fully contains the provided CidrBlock
   */
  public containsCidr(other: CidrBlock): boolean {
    return (this.maxAddress() >= other.maxAddress()) &&
      (this.minAddress() <= other.minAddress());
  }

  public rangesOverlap(range1: [string, string], range2: [string, string]): boolean {
    const [start1, end1] = range1;
    const [start2, end2] = range2;

    // Check if ranges overlap
    return start1 <= end2 && start2 <= end1;
  }

}

export class CidrBlockIpv6 {
  public cidr: string;
  public cidrPrefix: number;
  private ipParts: bigint[];
  private networkBits: number;
  private networkPart: bigint[];

  constructor(cidr: string) {
    this.cidr = cidr;
    const [ipAddress, prefix] = cidr.split('/');
    this.cidrPrefix = parseInt(prefix, 10);
    this.ipParts = this.parseBigIntParts(ipAddress);
    this.networkBits = this.cidrPrefix;
    this.networkPart = this.ipParts.slice(0, Math.ceil(this.networkBits / 16));
  }

  private parseBigIntParts(ipAddress: string): bigint[] {
    return ipAddress.split(':').map((part) => BigInt(`0x${part.padStart(4, '0')}` || '0'));
  }

  public minIp(): string {
    const startIP = [...this.networkPart];
    for (let i = this.networkPart.length; i < 8; i++) {
      startIP.push(BigInt(0));
    }
    return startIP.map(this.formatIPv6Part).join(':');
  }

  public maxIp(): string {
    const endIP = [...this.networkPart];
    const hostPart = Array(8 - this.networkPart.length).fill(BigInt(0xffff));
    endIP.push(...hostPart);

    return endIP.map(this.formatIPv6Part).join(':');
  }

  private formatIPv6Part = (part: bigint) => part.toString(16).padStart(4, '0');

  public rangesOverlap(range1: string, range2: string): boolean {
    const [start1, end1] = this.getIPv6Range(range1);
    const [start2, end2] = this.getIPv6Range(range2);

    return (start1 <= end2) && (start2 <= end1);
  }

  private getIPv6Range(cidr: string): [bigint, bigint] {
    const [ipv6Address, prefixLength] = cidr.split('/');
    const ipv6Number = this.ipv6ToNumber(ipv6Address);
    /* eslint:disable:no-bitwise */
    const mask = (BigInt(1) << BigInt(128 - Number(prefixLength))) - BigInt(1);
    /* eslint:disable:no-bitwise */
    const networkPrefix = ipv6Number & ~mask;
    const start = networkPrefix;
    /* eslint:disable:no-bitwise */
    const end = networkPrefix | mask;

    return [start, end];
  }

  private ipv6ToNumber(ipv6Address: string): bigint {
    const blocks = this.parseBigIntParts(ipv6Address);
    let ipv6Number = BigInt(0);
    for (const block of blocks) {
      /* tslint:disable:no-bitwise */
      ipv6Number = (ipv6Number << BigInt(16)) + block;
    }
    return ipv6Number;
  }
}

