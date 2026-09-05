import { UnscopedValidationError } from '../errors';
import type { ResourceContextProps, TemplateContextProps, ContextRef } from '../metadata-context';
import { lit } from './literal-string';

/**
 * The construct-node metadata type used to stage resource context entries
 * until the rendering aspect writes them onto CloudFormation resources.
 */
export const RESOURCE_CONTEXT_METADATA_TYPE = 'aws:cdk:metadata-context';

/**
 * Render explicitly authored props into the advisory schema.
 *
 * The public TypeScript/jsii prop names (`defaultMutability`,
 * `propertyMutability`) are rendered under the canonical wire keys
 * (`mutable`, `mutability`) so the emitted schema vocabulary is unchanged.
 */
export function renderResourceContext(context: ResourceContextProps): Record<string, any> {
  const out: Record<string, any> = {};
  if (context.why !== undefined) {
    out.why = context.why;
  }
  if (context.must !== undefined && context.must.length > 0) {
    out.must = [...context.must];
  }
  if (context.defaultMutability !== undefined) {
    out.mutable = context.defaultMutability;
  }
  if (context.propertyMutability !== undefined && Object.keys(context.propertyMutability).length > 0) {
    out.mutability = { ...context.propertyMutability };
  }
  if (context.trust !== undefined) {
    const trust: Record<string, any> = {};
    if (context.trust.source !== undefined) {
      trust.src = context.trust.source;
    }
    if (context.trust.confidence !== undefined) {
      trust.conf = context.trust.confidence;
    }
    if (context.trust.citation !== undefined) {
      trust.cite = context.trust.citation;
    }
    if (context.trust.note !== undefined) {
      trust.note = context.trust.note;
    }
    out.trust = trust;
  }
  if (context.deps !== undefined && context.deps.length > 0) {
    out.deps = [...context.deps];
  }
  return out;
}

/**
 * Merge two rendered context blocks; fields in `overriding` win over
 * `base` for scalars, while list fields accumulate (base first) and the
 * `mutability` map merges per key.
 */
export function mergeResourceContext(base: Record<string, any> | undefined, overriding: Record<string, any>): Record<string, any> {
  if (base === undefined) {
    return { ...overriding };
  }
  const out: Record<string, any> = { ...base };
  for (const scalar of ['why', 'mutable', 'trust']) {
    if (overriding[scalar] !== undefined) {
      out[scalar] = overriding[scalar];
    }
  }
  for (const listField of ['must', 'deps']) {
    if (overriding[listField] !== undefined) {
      out[listField] = dedupe([...(base[listField] ?? []), ...overriding[listField]]);
    }
  }
  if (overriding.mutability !== undefined) {
    out.mutability = { ...(base.mutability ?? {}), ...overriding.mutability };
  }
  return out;
}

export function renderRef(ref: ContextRef): any {
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

export function dedupe(entries: string[]): string[] {
  return [...new Set(entries)];
}

export function validateResourceContext(context: ResourceContextProps) {
  // Every top-level field is optional in the advisory schema, which sets no
  // minLength/minItems, so blank strings and empty arrays are structurally
  // valid and a block may carry only trust or only deps. CDK enforces just the
  // schema's nested requirements: trust provenance and the sparse
  // propertyMutability rule.
  validateTrust(context.trust);
  validatePropertyMutability(context);
}

function validateTrust(trust: ResourceContextProps['trust']) {
  if (trust === undefined) {
    return;
  }
  // The schema requires src and conf whenever a trust object is present; cite
  // and note stay optional, and blank strings are structurally valid.
  if (trust.source === undefined) {
    throw new UnscopedValidationError(lit`MissingMetadataContextTrustSource`, 'MetadataContext trust requires a \'source\' when trust is provided');
  }
  if (trust.confidence === undefined) {
    throw new UnscopedValidationError(lit`MissingMetadataContextTrustConfidence`, 'MetadataContext trust requires a \'confidence\' when trust is provided');
  }
}

function validatePropertyMutability(context: ResourceContextProps) {
  if (context.defaultMutability === undefined || context.propertyMutability === undefined) {
    return;
  }
  for (const [property, mutability] of Object.entries(context.propertyMutability)) {
    if (mutability === context.defaultMutability) {
      throw new UnscopedValidationError(
        lit`RedundantMetadataContextPropertyMutability`,
        `MetadataContext propertyMutability entry '${property}' must not repeat defaultMutability ${JSON.stringify(context.defaultMutability)}; the map records deviations only`,
      );
    }
  }
}

export function validateTemplateContext(context: TemplateContextProps) {
  // Every top-level field is optional and blank strings are structurally
  // valid, so an empty declaration is a harmless no-op handled by the caller.
  // The schema does require an `at` on every rich ref object, so enforce its
  // presence and type — but not that it is non-blank (an empty string is a
  // valid string).
  for (const ref of context.refs ?? []) {
    if (typeof ref.at !== 'string') {
      throw new UnscopedValidationError(lit`MissingMetadataContextRefAt`, 'MetadataContext refs require an \'at\' path');
    }
  }
}
