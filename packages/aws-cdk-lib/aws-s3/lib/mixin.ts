import { ValidationRule } from '../../core/lib/helpers-internal';

export interface Mixin<In, Out extends In, Props> {
  readonly validations: ValidationRule<Props>[];
  apply(resource: In): Out;
}
