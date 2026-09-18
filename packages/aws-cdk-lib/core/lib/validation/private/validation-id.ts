import { UnscopedValidationError } from '../../errors';
import { lit } from '../../private/literal-string';
import { type Branded } from '../../private/type-brand';

export interface ValidationId {
  readonly namespace?: ValidationNs;
  readonly ruleId: string;
}

/**
 * Parse a validation ID into a namespace and rule name.
 *
 * `::` is used to separate the namespace from the rule name. If no namespace is provided, the `annotation` namespace is assumed.
 *
 * The rule name may not contain `::`, except between brackets.
 *
 * Right now, this parses and validates balanced brackets, because we assume the
 * people who invent identifiers are not maniacs.  If it turns out this causes
 * too many problems, we can remove matching bracket validation and just check
 * for whether any brackets are open, not necessarily whether they match.
 */
export function parseValidationId(id: string): ValidationId {
  let nsSeparator: undefined | number = undefined;

  // Parser loop
  const braceStack: string[] = [];
  for (let i = 0; i < id.length; i++) {
    const c = id[i];
    if (c === ':' && id[i + 1] === ':' && braceStack.length === 0) {
      // Found a namespace separator
      if (nsSeparator !== undefined) {
        throw new UnscopedValidationError(lit`InvalidValidationId`, `Invalid validation rule ID '${id}'. The '::' delimiter is reserved for separating the prefix from the rule name (e.g. 'prefix::RuleName').`);
      }

      nsSeparator = i;
      i += 1;
    } else if ([']', ')', '}'].includes(c)) {
      // Found a closing brace, pop the stack
      const lastBrace = braceStack.pop();
      if (lastBrace === undefined) {
        throw new UnscopedValidationError(lit`InvalidValidationId`, `Invalid validation rule ID '${id}'. Unmatched closing brace '${c}' at position ${i}.`);
      }
      if ((lastBrace === '(' && c !== ')') || (lastBrace === '[' && c !== ']') || (lastBrace === '{' && c !== '}')) {
        throw new UnscopedValidationError(lit`InvalidValidationId`, `Invalid validation rule ID '${id}'. Mismatched closing brace '${c}' at position ${i}. Expected '${lastBrace === '(' ? ')' : lastBrace === '[' ? ']' : '}'}'.`);
      }
    } else if (['[', '(', '{'].includes(c)) {
      // Found an opening brace, push it onto the stack
      braceStack.push(c);
    }
  }

  // Handle result
  if (nsSeparator === undefined) {
    return { ruleId: id };
  }

  if (nsSeparator === 0) {
    throw new UnscopedValidationError(lit`InvalidValidationId`, `Invalid validation rule ID '${id}'. Missing plugin name before '::'.`);
  }

  const namespace = id.substring(0, nsSeparator) as ValidationNs;
  const ruleId = id.substring(nsSeparator + 2);

  return { namespace, ruleId };
}

/**
 * Normalize the given validation ID to a fully qualified ID, using the `annotation` namespace if no namespace is provided.
 */
export function normalizeValidationId(id: string | ValidationId, defaultNamespace: ValidationNs): string {
  const parsed = typeof id === 'string' ? parseValidationId(id) : id;

  // Allow aliases for this namespace, but normalize it to the actual namespace we settled on.
  if (parsed.namespace && ['annotation', 'Construct-Annotations'].includes(parsed.namespace)) {
    return `${ANNOTATION_PLUGIN_NAMESPACE}::${parsed.ruleId}`;
  }

  return `${parsed.namespace ?? defaultNamespace}::${parsed.ruleId}`;
}

/**
 * Normalize the given validation ID to a fully qualified ID, using the `Annotation` namespace if no namespace is provided.
 */
export function normalizeValidationIdForAnnotations(id: string | ValidationId): string {
  return normalizeValidationId(id, ANNOTATION_PLUGIN_NAMESPACE);
}

export type ValidationNs = Branded<string, 'ValidationNs'>;

/**
 * Convert a plugin name to a namespace for validation IDs.
 */
export function namespaceFromPluginName(pluginName: string): ValidationNs {
  if (pluginName === ANNOTATION_PLUGIN_NAME) {
    return ANNOTATION_PLUGIN_NAMESPACE as ValidationNs;
  }

  return pluginName.replace(/ /g, '-') as ValidationNs;
}

/**
 * Convert a namespace to a displayable plugin name
 */
export function pluginNameFromNamespace(namespace: ValidationNs): string {
  // We do not convert the annotation namespace back to its legacy plugin name.
  return namespace.replace(/-/g, ' ');
}

export const ANNOTATION_PLUGIN_NAME = 'Construct Annotations';
export const ANNOTATION_PLUGIN_NAMESPACE = namespaceFromPluginName('Annotation');
