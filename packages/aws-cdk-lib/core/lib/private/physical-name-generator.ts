import * as crypto from 'crypto';
import { Node } from 'constructs';
import { TokenMap } from './token-map';
import { Names } from '../names';
import { IResolvable, IResolveContext } from '../resolvable';
import { IResource } from '../resource';
import { Stack } from '../stack';
import { Token } from '../token';

export function generatePhysicalName(resource: IResource): string {
  const stack = Stack.of(resource);
  const stackPart = new PrefixNamePart(stack.stackName, 25);
  const idPart = new SuffixNamePart(Names.nodeUniqueId(resource.node), 24);

  const region: string = stack.region;
  if (Token.isUnresolved(region) || !region) {
    throw new Error(`Cannot generate a physical name for ${Node.of(resource).path}, because the region is un-resolved or missing`);
  }

  const account: string = stack.account;
  if (Token.isUnresolved(account) || !account) {
    throw new Error(`Cannot generate a physical name for ${Node.of(resource).path}, because the account is un-resolved or missing`);
  }

  const parts = [stackPart, idPart]
    .map(part => part.generate());

  const hashLength = 12;
  const sha256 = crypto.createHash('sha256')
    .update(stackPart.bareStr)
    .update(idPart.bareStr)
    .update(region)
    .update(account);
  const hash = sha256.digest('hex').slice(0, hashLength);

  const ret = [...parts, hash].join('');

  return ret.toLowerCase();
}

abstract class NamePart {
  public readonly bareStr: string;

  constructor(bareStr: string) {
    this.bareStr = bareStr;
  }

  public abstract generate(): string;
}

class PrefixNamePart extends NamePart {
  constructor(bareStr: string, private readonly prefixLength: number) {
    super(bareStr);
  }

  public generate(): string {
    return this.bareStr.slice(0, this.prefixLength);
  }
}

class SuffixNamePart extends NamePart {
  constructor(str: string, private readonly suffixLength: number) {
    super(str);
  }

  public generate(): string {
    const strLen = this.bareStr.length;
    const startIndex = Math.max(strLen - this.suffixLength, 0);
    return this.bareStr.slice(startIndex, strLen);
  }
}

const GENERATE_IF_NEEDED_SYMBOL = Symbol.for('@aws-cdk/core.<private>.GenerateIfNeeded');

/**
 * This marker token is used by PhysicalName.GENERATE_IF_NEEDED. When that token is passed to the
 * physicalName property of a Resource, it triggers different behavior in the Resource constructor
 * that will allow emission of a generated physical name (when the resource is used across
 * environments) or undefined (when the resource is not shared).
 *
 * This token throws an Error when it is resolved, as a way to prevent inadvertent mis-uses of it.
 */
export class GeneratedWhenNeededMarker implements IResolvable {
  public readonly creationStack: string[] = [];

  constructor() {
    Object.defineProperty(this, GENERATE_IF_NEEDED_SYMBOL, { value: true });
  }

  public resolve(_ctx: IResolveContext): never {
    throw new Error('Invalid physical name passed to CloudFormation. Use "this.physicalName" instead');
  }

  public toString(): string {
    return 'PhysicalName.GENERATE_IF_NEEDED';
  }
}

/**
 * Checks whether a stringified token resolves to a `GeneratedWhenNeededMarker`.
 */
export function isGeneratedWhenNeededMarker(val: string): boolean {
  const token = TokenMap.instance().lookupString(val);
  return !!token && GENERATE_IF_NEEDED_SYMBOL in token;
}
