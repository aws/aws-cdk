import type { IConstruct } from 'constructs';
import { Token, ValidationError } from '../../core';
import { lit } from '../../core/lib/private/literal-string';

export function validateWeight(scope: IConstruct, x?: number) {
  if (x !== undefined && !Token.isUnresolved(x) && (x < 0 || x > 255)) {
    throw new ValidationError(lit`MustBeWeightBetween`, `'weight' must be between 0 and 255, got: ${x}`, scope);
  }
}
