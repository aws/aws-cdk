import type { QualifiedFunctionBase } from '../function-base';

type Writeable<T> = { -readonly [P in keyof T]: T[P] };

/**
 * Copies the optional `role` and `tenancyConfig` from the underlying function
 * onto a qualified function (an alias or version).
 *
 * Both are declared `readonly` (to match the `IFunction` contract under
 * `exactOptionalPropertyTypes`) but are resolved from the underlying `lambda`
 * after construction, so the writes go through a `Writeable` cast. The
 * `undefined` checks keep the properties absent rather than set to `undefined`,
 * which `exactOptionalPropertyTypes` forbids.
 */
export function copyOptionalFunctionAttributes(qualified: QualifiedFunctionBase): void {
  const writeable = qualified as Writeable<QualifiedFunctionBase>;
  if (qualified.lambda.role !== undefined) {
    writeable.role = qualified.lambda.role;
  }
  if (qualified.lambda.tenancyConfig !== undefined) {
    writeable.tenancyConfig = qualified.lambda.tenancyConfig;
  }
}
