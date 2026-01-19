import { IConstruct } from 'constructs';
import { ValidationError } from '../../../core/lib/errors';
import { INetworkAclRef, ISubnetRef } from '../ec2.generated';
import { INetworkAcl } from '../network-acl';
import { ISubnet } from '../vpc';

export function asNetworkAcl(x: INetworkAclRef, scope: IConstruct): INetworkAcl {
  if ('addEntry' in x) {
    return x as INetworkAcl;
  }
  throw new ValidationError(`Provided networkAcl is not an instance of INetworkAcl: ${x.constructor.name}`, scope);
}

export function asSubnet(x: ISubnetRef, scope: IConstruct): ISubnet {
  if ('subnetId' in x) {
    return x as ISubnet;
  }
  throw new ValidationError(`Provided subnet is not an instance of ISubnet: ${x.constructor.name}`, scope);
}
