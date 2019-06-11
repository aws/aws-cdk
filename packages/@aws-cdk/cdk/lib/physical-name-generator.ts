import crypto = require('crypto');
import { IResource } from './resource';
import { Stack } from './stack';
import { Token } from './token';

export function generatePhysicalName(resource: IResource): string {
  const stack = Stack.of(resource);
  const stackPart = new PrefixNamePart(stack.stackName, 25);
  const idPart = new SuffixNamePart(resource.node.uniqueId, 24);

  let region: string | undefined = stack.region;
  if (Token.isUnresolved(region)) {
    region = undefined;
  }

  let account: string | undefined = stack.account;
  if (Token.isUnresolved(account)) {
    account = undefined;
  }

  const parts = [stackPart, idPart]
    .map(part => part.generate());

  const hashLength = 12;
  const sha256 = crypto.createHash('sha256')
    .update(stackPart.bareStr)
    .update(idPart.bareStr)
    .update(region || '')
    .update(account || '');
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
