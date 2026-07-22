import { UnscopedValidationError } from '../errors';
import type { ResourceContextProps, TemplateContextProps, ContextRef } from '../metadata-context';
import { lit } from './literal-string';

/**
 * The key under which context is stored in the CloudFormation `Metadata`
 * section, both at template level and at resource level.
 */
export const METADATA_CONTEXT_KEY = 'Context';

/**
 * The construct-node metadata type used to stage resource context entries
 * until the rendering aspect writes them onto CloudFormation resources.
 */
export const RESOURCE_CONTEXT_METADATA_TYPE = 'aws:cdk:metadata-context';

/**
 * Render authored props into the v1 wire format.
 */
export function renderResourceContext(context: ResourceContextProps): Record<string, any> {
  const out: Record<string, any> = {};
  if (context.why !== undefined) {
    out.why = context.why;
  }
  if (context.must !== undefined && context.must.length > 0) {
    out.must = [...context.must];
  }
  if (context.mutable !== undefined) {
    out.mutable = context.mutable;
  }
  if (context.mutability !== undefined && Object.keys(context.mutability).length > 0) {
    out.mutability = { ...context.mutability };
  }
  if (context.trust !== undefined) {
    const trust: Record<string, any> = {
      // The v1 wire format requires src and conf; apply meaningful defaults
      // for context declared in CDK code (ContextTrustSource.AUTHORED and
      // ContextTrustConfidence.MEDIUM, as wire literals to keep this module
      // free of runtime imports from the public module).
      src: context.trust.source ?? 'authored',
      conf: context.trust.confidence ?? 'medium',
    };
    if (context.trust.citation !== undefined) {
      trust.cite = context.trust.citation;
    }
    if (context.trust.note !== undefined) {
      trust.note = context.trust.note;
    }
    out.trust = trust;
  }
  if (context.ops !== undefined) {
    out.ops = context.ops;
  }
  if (context.gaps !== undefined && context.gaps.length > 0) {
    out.gaps = [...context.gaps];
  }
  if (context.deps !== undefined && context.deps.length > 0) {
    out.deps = [...context.deps];
  }
  if (context.failureModes !== undefined && context.failureModes.length > 0) {
    out.failureModes = [...context.failureModes];
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
  for (const scalar of ['why', 'mutable', 'trust', 'ops']) {
    if (overriding[scalar] !== undefined) {
      out[scalar] = overriding[scalar];
    }
  }
  for (const listField of ['must', 'gaps', 'deps', 'failureModes']) {
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
  if (Object.values(renderResourceContext(context)).length === 0) {
    throw new UnscopedValidationError(lit`EmptyMetadataContext`, 'MetadataContext requires at least one context field (why, must, mutable, mutability, trust, ops, gaps, deps or failureModes)');
  }
  for (const [field, entries] of Object.entries({ must: context.must, gaps: context.gaps, deps: context.deps, failureModes: context.failureModes })) {
    for (const entry of entries ?? []) {
      if (entry.trim() === '') {
        throw new UnscopedValidationError(lit`EmptyMetadataContextEntry`, `MetadataContext '${field}' entries must be non-empty strings`);
      }
    }
  }
}

export function validateTemplateContext(context: TemplateContextProps) {
  const empty = context.arch === undefined
    && (context.must === undefined || context.must.length === 0)
    && (context.refs === undefined || context.refs.length === 0)
    && context.owner === undefined;
  if (empty) {
    throw new UnscopedValidationError(lit`EmptyMetadataContext`, 'MetadataContext.addToTemplate() requires at least one context field (arch, must, refs or owner)');
  }
  for (const entry of context.must ?? []) {
    if (entry.trim() === '') {
      throw new UnscopedValidationError(lit`EmptyMetadataContextEntry`, 'MetadataContext template-level \'must\' entries must be non-empty strings');
    }
  }
  for (const ref of context.refs ?? []) {
    if (ref.at.trim() === '') {
      throw new UnscopedValidationError(lit`EmptyMetadataContextRef`, 'MetadataContext refs require a non-empty \'at\' URI');
    }
  }
}
