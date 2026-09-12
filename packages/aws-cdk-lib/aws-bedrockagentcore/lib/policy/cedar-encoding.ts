import { Token, Tokenization } from '../../../core';
import { UnscopedValidationError } from '../../../core/lib/errors';
import { lit } from '../../../core/lib/helpers-internal';

/**
 * Internal Cedar encoding helpers.
 *
 * The `PolicyStatement` builder puts caller-supplied values into generated Cedar
 * policy text. These helpers keep every caller value inside a single Cedar string
 * literal (data positions) or validate it against the Cedar identifier grammar
 * (identifier positions), and fail at synthesis otherwise. They never transform a
 * value, so a value that survives is byte-identical to what the caller passed.
 *
 * This module is intentionally NOT exported from `lib/index.ts`.
 */

// A double quote ends a Cedar string literal. A backslash can escape the closing
// quote. A raw carriage return is fatal per cedar-policy-core unescape
// (BareCarriageReturn). Every other character is one `[^"\\]` body element in the
// STRINGLIT token, so the result is provably a single string literal.
//
// NOTE: because this rule forbids emitting a backslash, it MUST NOT be used to
// render a Cedar `like` pattern, where a literal `*` has to be written as `\*`.
// A future `like()` method needs its own pattern encoder.
const CEDAR_UNSAFE = /["\\\r]/;

// An unpaired surrogate has no valid output form: Node encodes it as U+FFFD, which
// changes the value silently. `\p{Surrogate}` matches a lone surrogate but not a
// valid pair, so an emoji (a valid surrogate pair) is not rejected.
const CEDAR_LONE_SURROGATE = /\p{Surrogate}/u;

// IDENT is `[_a-zA-Z][_a-zA-Z0-9]*`, a path is `IDENT {'::' IDENT}`.
const CEDAR_IDENT = /^[_a-zA-Z][_a-zA-Z0-9]*$/;
const CEDAR_RESERVED_IDS = new Set(['true', 'false', 'if', 'then', 'else', 'in', 'is', 'like', 'has', '__cedar']);

// A complete, already-quoted action UID such as `AgentCore::Action::"read"`.
const QUOTED_ACTION_UID = /^([_a-zA-Z][_a-zA-Z0-9]*(?:::[_a-zA-Z][_a-zA-Z0-9]*)*)::"(.*)"$/s;

// The body production of the STRINGLIT token in grammar.lalrpop, `"(\\.|[^"\\])*"`,
// with a raw CR excluded in both branches. A body that matches cannot end the
// literal early, so the emitted UID is provably one string literal.
const CEDAR_ACTION_BODY = /^(?:[^"\\\r]|\\[^\n\r])*$/;

/**
 * Render a value as a Cedar string literal, or fail at synthesis.
 *
 * A token marker is safe here and needs no branch: a marker only ever contains
 * characters from `a-zA-Z0-9:._-` plus `${Token[` and `]}`, so it can never hold a
 * quote, a backslash, or a carriage return.
 */
export function cedarString(value: string, field: string): string {
  if (CEDAR_UNSAFE.test(value)) {
    throw new UnscopedValidationError(lit`InvalidCedarStringValue`,
      `${field} cannot contain a double quote, a backslash, or a carriage return, ` +
      'because a generated Cedar policy cannot represent them. Rewrite the whole ' +
      `statement with PolicyStatement.fromCedar() if you need them, got: ${JSON.stringify(value)}`);
  }
  if (CEDAR_LONE_SURROGATE.test(value)) {
    throw new UnscopedValidationError(lit`InvalidCedarUnicode`,
      `${field} contains an unpaired UTF-16 surrogate, so it is not well-formed Unicode`);
  }
  return `"${value}"`;
}

/**
 * A Cedar entity id: a string literal that must not be empty. Real AgentCore ids are
 * ARNs or action names, so an empty id is always a mistake. For a principal the
 * type-only form is the documented way to match any entity of a type, so callers get
 * that hint. Emptiness is checked here, at the entity-id sites, and deliberately not
 * in `cedarString`, because an empty condition value (for example `x == ""`) is valid.
 */
export function cedarEntityId(value: string, field: string, hint?: string): string {
  if (value === '') {
    throw new UnscopedValidationError(lit`EmptyCedarEntityId`,
      `${field} cannot be an empty string${hint ? `. ${hint}` : ''}`);
  }
  return cedarString(value, field);
}

/**
 * An entity type or namespace path such as `AgentCore::Gateway`.
 */
export function cedarPath(value: string, field: string): string {
  if (Token.isUnresolved(value)) {
    throw new UnscopedValidationError(lit`UnresolvedCedarPath`,
      `${field} must be a concrete Cedar entity type such as 'AgentCore::Gateway'. ` +
      'Synthesis cannot validate an unresolved token here');
  }
  const segments = value.split('::');
  if (segments.some((s) => !CEDAR_IDENT.test(s) || CEDAR_RESERVED_IDS.has(s))) {
    throw new UnscopedValidationError(lit`InvalidCedarPath`,
      `${field} must be Cedar identifiers joined by '::', for example 'AgentCore::Gateway', got: ${JSON.stringify(value)}`);
  }
  return value;
}

/**
 * An attribute path off `principal`, `resource`, or `context`, for example
 * `principal.department` or `principal.address.city`. A segment that is not a Cedar
 * identifier is rendered with the bracket form, which is equivalent to dot access.
 */
export function cedarAttrPath(root: string, attribute: string): string {
  // Reject before splitting. A token marker holds a dot, so `split('.')` would break it.
  if (Token.isUnresolved(attribute)) {
    throw new UnscopedValidationError(lit`UnresolvedCedarAttribute`,
      "attribute must be a concrete name such as 'department', or a dotted path such as " +
      "'address.city'. Synthesis cannot validate an unresolved token here");
  }
  return attribute.split('.').reduce(
    (acc, segment) => (CEDAR_IDENT.test(segment) && !CEDAR_RESERVED_IDS.has(segment))
      ? `${acc}.${segment}`
      : `${acc}[${cedarString(segment, 'attribute')}]`,
    root);
}

/**
 * A Cedar long. Cedar has no decimal literal, so only integers work.
 */
export function cedarLong(value: number, field: string): string {
  if (!Number.isSafeInteger(value)) {
    throw new UnscopedValidationError(lit`InvalidCedarLong`,
      `${field} must be an integer, because Cedar has no decimal literal, got: ${value}`);
  }
  return value.toString();
}

/**
 * Render a Cedar action entity UID, or fail at synthesis.
 */
export function cedarActionUid(action: string): string {
  // 1. The caller wrote a complete UID, such as `Action::"read"`. Validate the body
  //    and emit it as it is. Escaping it again would double its backslashes. This
  //    runs first so that `Action::"${tokenId}"`, which works today, keeps working.
  const quoted = QUOTED_ACTION_UID.exec(action);
  if (quoted && CEDAR_ACTION_BODY.test(quoted[2]) && !CEDAR_LONE_SURROGATE.test(quoted[2])) {
    return `${cedarActionPath(quoted[1])}::"${quoted[2]}"`;
  }
  // 2. A token, not in quoted form. A marker can hold `::`, so never derive structure
  //    by splitting a string that may hold one. The entity type must be concrete.
  if (Token.isUnresolved(action)) {
    const fragments = Tokenization.reverseString(action);
    const leading: string = fragments.firstToken ? '' : fragments.firstValue;
    const prefix = actionTypePrefix(leading);
    if (prefix === undefined) {
      throw new UnscopedValidationError(lit`UnresolvedCedarAction`,
        `action must start with a concrete Cedar action entity type such as 'AgentCore::Action::', got: ${JSON.stringify(action)}`);
    }
    return `${cedarActionPath(prefix.slice(0, -2))}::${cedarEntityId(action.slice(prefix.length), 'action id')}`;
  }
  // 3. Concrete and unquoted. The first two segments are the entity type, the rest is the id.
  const segments = action.split('::');
  if (segments.length < 3 || segments[1] !== 'Action') {
    throw new UnscopedValidationError(lit`InvalidCedarAction`,
      'action must be a qualified Cedar action id such as \'AgentCore::Action::GetGateway\', ' +
      `or a quoted UID such as 'MyApp::Sub::Action::"GetGateway"', got: ${JSON.stringify(action)}`);
  }
  return `${cedarActionPath(segments.slice(0, 2).join('::'))}::${cedarEntityId(segments.slice(2).join('::'), 'action id')}`;
}

/**
 * The `Ns::Action::` prefix inside a concrete leading literal, or undefined.
 */
function actionTypePrefix(leading: string): string | undefined {
  const segments = leading.split('::');
  return (segments.length >= 3 && segments[1] === 'Action')
    ? `${segments[0]}::${segments[1]}::`
    : undefined;
}

/**
 * An action entity type. Cedar requires the basename to be `Action`.
 */
function cedarActionPath(value: string): string {
  const path = cedarPath(value, 'action namespace');
  if (path.split('::').pop() !== 'Action') {
    throw new UnscopedValidationError(lit`InvalidCedarActionType`,
      `action entity type must end in 'Action', for example 'AgentCore::Action', got: ${JSON.stringify(path)}`);
  }
  return path;
}
