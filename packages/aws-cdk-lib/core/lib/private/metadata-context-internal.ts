import type { IConstruct } from 'constructs';
import { ValidationError } from '../errors';
import type { CfnResourceContextProps, CfnTemplateContextProps, CfnContextRef } from '../metadata-context';
import { lit } from './literal-string';

/** The Amazon-owned key under which CloudFormation Context is stored. */
export const METADATA_CONTEXT_KEY = 'com.aws.cloudformation.Context';

/**
 * Render explicitly authored props into the advisory schema.
 *
 * The public property names are identical to the field names defined by the
 * published CloudFormation Metadata Context schema, so rendering only drops
 * absent fields and copies arrays/maps defensively. Empty strings, arrays and
 * maps are structurally valid and are kept.
 */
export function renderResourceContext(context: CfnResourceContextProps): Record<string, any> {
  const out: Record<string, any> = {};
  if (context.why !== undefined) {
    out.why = context.why;
  }
  if (context.must !== undefined) {
    out.must = [...context.must];
  }
  if (context.mutable !== undefined) {
    out.mutable = context.mutable;
  }
  if (context.mutability !== undefined) {
    out.mutability = { ...context.mutability };
  }
  if (context.trust !== undefined) {
    const trust: Record<string, any> = {};
    if (context.trust.src !== undefined) {
      trust.src = context.trust.src;
    }
    if (context.trust.conf !== undefined) {
      trust.conf = context.trust.conf;
    }
    if (context.trust.cite !== undefined) {
      trust.cite = context.trust.cite;
    }
    if (context.trust.note !== undefined) {
      trust.note = context.trust.note;
    }
    out.trust = trust;
  }
  if (context.deps !== undefined) {
    out.deps = [...context.deps];
  }
  return out;
}

/**
 * Render template-level props into the advisory schema, keeping empty values.
 */
export function renderTemplateContext(context: CfnTemplateContextProps): Record<string, any> {
  const out: Record<string, any> = {};
  if (context.arch !== undefined) {
    out.arch = context.arch;
  }
  if (context.must !== undefined) {
    out.must = [...context.must];
  }
  if (context.ref !== undefined) {
    out.ref = context.ref.map(renderRef);
  }
  if (context.owner !== undefined) {
    out.owner = context.owner;
  }
  return out;
}

function renderRef(ref: CfnContextRef): any {
  if (ref.has === undefined && ref.scope === undefined) {
    // Bare-string form keeps templates terse.
    return ref.at;
  }
  const out: Record<string, string> = { at: ref.at };
  if (ref.has !== undefined) {
    out.has = ref.has;
  }
  if (ref.scope !== undefined) {
    out.scope = ref.scope;
  }
  return out;
}

export function validateResourceContext(context: CfnResourceContextProps): string[] {
  // Every top-level field is optional in the advisory schema, which sets no
  // minLength/minItems, so blank strings and empty arrays are structurally
  // valid and a block may carry only trust or only deps. CDK enforces just the
  // schema's nested requirements: trust provenance and the sparse
  // mutability rule.
  return [...validateTrust(context.trust), ...validateMutability(context)];
}

function validateTrust(trust: CfnResourceContextProps['trust']): string[] {
  if (trust === undefined) {
    return [];
  }
  // The schema requires src and conf whenever a trust object is present; cite
  // and note stay optional, and blank strings are structurally valid.
  const errors: string[] = [];
  if (trust.src === undefined) {
    errors.push('MetadataContext trust requires \'src\' when trust is provided');
  }
  if (trust.conf === undefined) {
    errors.push('MetadataContext trust requires \'conf\' when trust is provided');
  }
  return errors;
}

function validateMutability(context: CfnResourceContextProps): string[] {
  if (context.mutable === undefined || context.mutability === undefined) {
    return [];
  }
  return Object.entries(context.mutability)
    .filter(([, level]) => level === context.mutable)
    .map(([property]) => `MetadataContext mutability entry '${property}' must not repeat mutable ${JSON.stringify(context.mutable)}; the map records deviations only`);
}

export function validateTemplateContext(scope: IConstruct, context: CfnTemplateContextProps) {
  // Every top-level field is optional and blank strings are structurally
  // valid. The schema does require an `at` on every rich ref object, so
  // enforce its presence and type — but not that it is non-blank (an empty
  // string is a valid string).
  for (const ref of context.ref ?? []) {
    if (typeof ref.at !== 'string') {
      throw new ValidationError(lit`MissingMetadataContextRefAt`, 'MetadataContext ref entries require an \'at\' path', scope);
    }
  }
}
