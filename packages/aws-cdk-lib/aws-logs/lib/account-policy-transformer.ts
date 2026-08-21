import type { Construct } from 'constructs';
import { AccountPolicyDocument } from './account-policy';
import type { AccountPolicyDocumentConfig } from './private/account-policy-config';
import type { IProcessor } from './transformer';
import { ValidationError } from '../../core';
import { lit } from '../../core/lib/private/literal-string';

/**
 * `IProcessor._render()` returns a single-entry object keyed by the camelCase processor
 * name (for example `parseToOcsf`). Unlike the log-group-level `AWS::Logs::Transformer`
 * resource — whose L1 property conversion PascalCases every key, including nested option
 * fields — the account-level `policyDocument` expects the processor's *own* raw camelCase
 * shape for everything except the top-level processor name itself, which must have its
 * acronym spelled out (for example `parseToOCSF`, not `parseToOcsf`) while keeping the
 * first letter lowercase. Nested fields (`ocsfVersion`, `overwriteIfExists`, etc.) must
 * stay exactly as `_render()` produced them — PascalCasing them is silently ignored by the
 * service rather than rejected.
 *
 * Confirmed against the real `PutAccountPolicy` API (not just documentation): a live test
 * call showed a PascalCased nested field is silently dropped, and the `InvalidParameterException`
 * for an unrecognized processor name lists the exact expected spelling for every processor.
 */
const PROCESSOR_KEY_OVERRIDES: Record<string, string> = {
  parseJson: 'parseJSON',
  parseToOcsf: 'parseToOCSF',
  parseVpc: 'parseVPC',
  parseWaf: 'parseWAF',
};

function toAccountPolicyProcessor(rendered: Record<string, any>): Record<string, any> {
  const [key, value] = Object.entries(rendered)[0];
  return { [PROCESSOR_KEY_OVERRIDES[key] ?? key]: value };
}

/**
 * Properties for a transformer account policy.
 */
export interface TransformerAccountPolicyProps {
  /**
   * The processors to apply, in order.
   */
  readonly processors: IProcessor[];

  /**
   * Restrict this policy to log groups whose name starts with this prefix.
   *
   * Cannot be used together with `selectionCriteria`.
   *
   * @default - applies to all log groups in the account
   */
  readonly logGroupNamePrefix?: string;

  /**
   * Escape hatch: the raw `selectionCriteria` expression to send to CloudFormation.
   *
   * Use this if `logGroupNamePrefix` doesn't cover your case. Cannot be used together with
   * `logGroupNamePrefix`.
   *
   * @default - derived from `logGroupNamePrefix`
   */
  readonly selectionCriteria?: string;
}

/**
 * A CloudWatch Logs account policy that applies a transformer policy to every log group in
 * the account (or a subset of them).
 *
 * Create instances of this class using `AccountPolicyDocument.transformer()`.
 */
export class TransformerAccountPolicyDocument extends AccountPolicyDocument {
  constructor(private readonly props: TransformerAccountPolicyProps) {
    super();
  }

  /**
   * @internal
   */
  public _bind(scope: Construct): AccountPolicyDocumentConfig {
    if (this.props.logGroupNamePrefix !== undefined && this.props.selectionCriteria) {
      throw new ValidationError(lit`ConflictingSelectionCriteria`, 'logGroupNamePrefix and selectionCriteria cannot both be specified', scope);
    }

    return {
      policyType: 'TRANSFORMER_POLICY',
      // Unlike the log-group-level AWS::Logs::Transformer resource (whose CfnTransformer.transformerConfig
      // CFN property is named TransformerConfig), the account-level policyDocument is just the processor
      // array on its own — no wrapping object. Confirmed via a live PutAccountPolicy call.
      policyDocument: JSON.stringify(this.props.processors.map(processor => toAccountPolicyProcessor(processor._render()))),
      selectionCriteria: this.props.selectionCriteria
        ?? (this.props.logGroupNamePrefix !== undefined ? `LogGroupNamePrefix = "${this.props.logGroupNamePrefix}"` : undefined),
    };
  }
}
