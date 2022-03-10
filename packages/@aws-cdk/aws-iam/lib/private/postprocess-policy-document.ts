import * as cdk from '@aws-cdk/core';
import { LITERAL_STRING_KEY } from '../util';
import { mergeStatements } from './merge-statements';

/**
 * A Token postprocesser for policy documents
 *
 * Removes duplicate statements, merges statements, and assign Sids if necessary
 *
 * Because policy documents can contain all kinds of crazy things,
 * we do all the necessary work here after the document has been mostly resolved
 * into a predictable CloudFormation form.
 */
export class PostProcessPolicyDocument implements cdk.IPostProcessor {
  constructor(private readonly autoAssignSids: boolean, private readonly minimize: boolean) {
  }

  public postProcess(input: any, _context: cdk.IResolveContext): any {
    if (!input || !input.Statement) {
      return input;
    }

    if (this.minimize) {
      input.Statement = mergeStatements(input.Statement);
    }

    // Also remove full-on duplicates (this will not be necessary if
    // we minimized, but it might still dedupe statements we didn't
    // minimize like 'Deny' statements, and definitely is still necessary
    // if we didn't minimize)
    const jsonStatements = new Set<string>();
    const uniqueStatements: any[] = [];

    for (const statement of input.Statement) {
      const jsonStatement = JSON.stringify(statement);
      if (!jsonStatements.has(jsonStatement)) {
        uniqueStatements.push(statement);
        jsonStatements.add(jsonStatement);
      }
    }

    // assign unique SIDs (the statement index) if `autoAssignSids` is enabled
    const statements = uniqueStatements.map((s, i) => {
      if (this.autoAssignSids && !s.Sid) {
        s.Sid = i.toString();
      }

      return s;
    });

    return {
      ...input,
      Statement: statements,
    };
  }
}

// An IAM value is a string or a CloudFormation intrinsic
export type IamValue = string | Record<string, any> | Array<string | Record<string, any>>;

export interface StatementSchema {
  readonly Sid?: string;
  readonly Effect?: string;
  readonly Principal?: Record<string, IamValue>;
  readonly NotPrincipal?: Record<string, IamValue>;
  readonly Resource?: IamValue;
  readonly NotResource?: IamValue;
  readonly Action?: IamValue;
  readonly NotAction?: IamValue;
  readonly Condition?: unknown;
}


export function normalizeStatement(s: StatementSchema) {
  return noUndef({
    Action: _norm(s.Action, { unique: true }),
    NotAction: _norm(s.NotAction, { unique: true }),
    Condition: _norm(s.Condition),
    Effect: _norm(s.Effect),
    Principal: _normPrincipal(s.Principal),
    NotPrincipal: _normPrincipal(s.NotPrincipal),
    Resource: _norm(s.Resource, { unique: true }),
    NotResource: _norm(s.NotResource, { unique: true }),
    Sid: _norm(s.Sid),
  });

  function _norm(values: any, { unique = false }: { unique: boolean } = { unique: false }) {

    if (values == null) {
      return undefined;
    }

    if (cdk.Token.isUnresolved(values)) {
      return values;
    }

    if (Array.isArray(values)) {
      if (!values || values.length === 0) {
        return undefined;
      }

      if (values.length === 1) {
        return values[0];
      }

      return unique ? Array.from(new Set(values)) : values;
    }

    if (values && typeof(values) === 'object') {
      if (Object.keys(values).length === 0) {
        return undefined;
      }
    }

    return values;
  }

  function _normPrincipal(principal?: { [key: string]: any }) {
    if (!principal) { return undefined; }

    const keys = Object.keys(principal);
    if (keys.length === 0) { return undefined; }

    // This is handling a special case for round-tripping a literal
    // string principal loaded from JSON.
    if (LITERAL_STRING_KEY in principal) {
      return principal[LITERAL_STRING_KEY][0];
    }

    const result: any = {};
    for (const key of keys) {
      const normVal = _norm(principal[key]);
      if (normVal) {
        result[key] = normVal;
      }
    }
    return result;
  }
}

function noUndef(x: any): any {
  const ret: any = {};
  for (const [key, value] of Object.entries(x)) {
    if (value !== undefined) {
      ret[key] = value;
    }
  }
  return ret;
}
