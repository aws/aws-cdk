import * as iam from '../../aws-iam';
import { ValidationRule } from '../../core/lib/helpers-internal';

export interface Mixin<In, Out extends In> {
  readonly validations: ValidationRule<object>[];
  apply(resource: In): Out;
}

export interface HasResourcePolicy {
  addToResourcePolicy(permission: iam.PolicyStatement): iam.AddToResourcePolicyResult;
}

export class WithResourcePolicy<T> implements Mixin<T, T & HasResourcePolicy> {
  public get validations(): ValidationRule<object>[] {
    return [];
  }

  apply(_resource: T): T & HasResourcePolicy {
    throw new Error('Method not implemented.');
  }
}
