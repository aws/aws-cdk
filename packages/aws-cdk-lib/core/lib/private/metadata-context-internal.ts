import type { IConstruct } from 'constructs';
import { ValidationError } from '../errors';
import type { CfnResourceMetadataContextProps, CfnTemplateMetadataContextProps, CfnContextRef } from '../metadata-context';
import { Token } from '../token';
import { lit } from './literal-string';

export const METADATA_CONTEXT_KEY = 'com.aws.cloudformation.Context';

export function renderResourceContext(context: CfnResourceMetadataContextProps): Record<string, any> {
  const out: Record<string, any> = {};
  if (context.why !== undefined) {
    out.why = context.why;
  }
  if (context.must !== undefined) {
    out.must = copyArray(context.must);
  }
  if (context.mutable !== undefined) {
    out.mutable = context.mutable;
  }
  if (context.mutability !== undefined) {
    if (Token.isUnresolved(context.mutability)) {
      out.mutability = context.mutability;
    } else {
      const entries = Object.entries(context.mutability);
      const deviations = entries.filter(([, level]) => level !== context.mutable);
      if (entries.length === 0 || deviations.length > 0) {
        out.mutability = Object.fromEntries(deviations);
      }
    }
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
    out.deps = copyArray(context.deps);
  }
  return out;
}

export function renderTemplateContext(context: CfnTemplateMetadataContextProps): Record<string, any> {
  const out: Record<string, any> = {};
  if (context.arch !== undefined) {
    out.arch = context.arch;
  }
  if (context.must !== undefined) {
    out.must = copyArray(context.must);
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

function copyArray<T>(values: T[]): T[] {
  return Token.isUnresolved(values) ? values : [...values];
}

export function validateResourceContext(context: CfnResourceMetadataContextProps): string[] {
  return validateTrust(context.trust);
}

function validateTrust(trust: CfnResourceMetadataContextProps['trust']): string[] {
  if (trust === undefined) {
    return [];
  }
  const errors: string[] = [];
  if (trust.src === undefined) {
    errors.push('trust requires \'src\' when provided');
  }
  if (trust.conf === undefined) {
    errors.push('trust requires \'conf\' when provided');
  }
  return errors;
}

export function validateTemplateContext(scope: IConstruct, context: CfnTemplateMetadataContextProps) {
  rejectUnresolvedToken(scope, 'arch', context.arch);
  rejectUnresolvedToken(scope, 'must', context.must);
  for (const [index, entry] of (context.must ?? []).entries()) {
    rejectUnresolvedToken(scope, `must[${index}]`, entry);
  }

  rejectUnresolvedToken(scope, 'ref', context.ref);
  for (const [index, ref] of (context.ref ?? []).entries()) {
    rejectUnresolvedToken(scope, `ref[${index}]`, ref);
    if (typeof ref.at !== 'string') {
      throw new ValidationError(lit`MissingMetadataContextRefAt`, 'ref entries require an \'at\' path', scope);
    }
    rejectUnresolvedToken(scope, `ref[${index}].at`, ref.at);
    rejectUnresolvedToken(scope, `ref[${index}].has`, ref.has);
    rejectUnresolvedToken(scope, `ref[${index}].scope`, ref.scope);
  }
  rejectUnresolvedToken(scope, 'owner', context.owner);
}

function rejectUnresolvedToken(scope: IConstruct, path: string, value: any): void {
  if (Token.isUnresolved(value)) {
    throw new ValidationError(
      lit`UnresolvedTokenInTemplateMetadataContext`,
      `template context field '${path}' cannot contain unresolved tokens because CloudFormation does not resolve intrinsic functions in template metadata`,
      scope,
    );
  }
}
