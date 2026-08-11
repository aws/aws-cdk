import type { Construct } from 'constructs';
import type { FieldIndexAccountPolicyProps } from './account-policy-field-index';
import type { SubscriptionFilterPolicyProps } from './account-policy-subscription-filter';
import type { TransformerAccountPolicyProps } from './account-policy-transformer';
import type { DataProtectionPolicy } from './data-protection-policy';
import { CfnAccountPolicy } from './logs.generated';
import type { AccountPolicyDocumentConfig } from './private/account-policy-config';
import { Resource } from '../../core';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';

/**
 * Represents the contents of an account-level CloudWatch Logs policy.
 *
 * `AccountPolicy` applies a single policy document to an entire account, as opposed to
 * a single log group. Use one of the static factory methods (for example
 * `AccountPolicyDocument.subscriptionFilter()`) to create an instance for a specific
 * policy type.
 */
export abstract class AccountPolicyDocument {
  /**
   * Creates a subscription filter policy that applies to every log group in the account.
   */
  public static subscriptionFilter(props: SubscriptionFilterPolicyProps): AccountPolicyDocument {
    // Lazy import to avoid a circular import dependency during startup: this module is
    // extended by each concrete AccountPolicyDocument subclass, so importing them at the
    // top level here would create a require() cycle.
    // eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/consistent-type-imports
    const mod: typeof import('./account-policy-subscription-filter') = require('./account-policy-subscription-filter');
    return new mod.SubscriptionFilterPolicyDocument(props);
  }

  /**
   * Creates a data protection policy that applies to every log group in the account.
   */
  public static dataProtection(policy: DataProtectionPolicy): AccountPolicyDocument {
    // Lazy import — see comment in subscriptionFilter().
    // eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/consistent-type-imports
    const mod: typeof import('./account-policy-data-protection') = require('./account-policy-data-protection');
    return new mod.DataProtectionAccountPolicyDocument(policy);
  }

  /**
   * Creates a field index policy that applies to every log group in the account (or a
   * subset of them).
   */
  public static fieldIndex(props: FieldIndexAccountPolicyProps): AccountPolicyDocument {
    // Lazy import — see comment in subscriptionFilter().
    // eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/consistent-type-imports
    const mod: typeof import('./account-policy-field-index') = require('./account-policy-field-index');
    return new mod.FieldIndexAccountPolicyDocument(props);
  }

  /**
   * Creates a transformer policy that applies to every log group in the account (or a
   * subset of them).
   */
  public static transformer(props: TransformerAccountPolicyProps): AccountPolicyDocument {
    // Lazy import — see comment in subscriptionFilter().
    // eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/consistent-type-imports
    const mod: typeof import('./account-policy-transformer') = require('./account-policy-transformer');
    return new mod.TransformerAccountPolicyDocument(props);
  }

  /**
   * Renders the CloudFormation representation of this policy document.
   *
   * @internal
   */
  public abstract _bind(scope: Construct): AccountPolicyDocumentConfig;
}

/**
 * Properties for an `AccountPolicy`.
 */
export interface AccountPolicyProps {
  /**
   * A name for the policy.
   *
   * This must be unique within the account.
   */
  readonly policyName: string;

  /**
   * The policy to apply to the account.
   *
   * Use one of the static factory methods on `AccountPolicyDocument`, for example
   * `AccountPolicyDocument.subscriptionFilter()`.
   */
  readonly policy: AccountPolicyDocument;
}

/**
 * An account-level CloudWatch Logs policy.
 *
 * Unlike a log-group-level policy, an `AccountPolicy` applies to every log group in the
 * account (optionally scoped down to a subset of log groups).
 */
@propertyInjectable
export class AccountPolicy extends Resource {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-logs.AccountPolicy';

  constructor(scope: Construct, id: string, props: AccountPolicyProps) {
    super(scope, id, {
      physicalName: props.policyName,
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    const config = props.policy._bind(this);

    new CfnAccountPolicy(this, 'Resource', {
      policyName: this.physicalName,
      policyType: config.policyType,
      policyDocument: config.policyDocument,
      selectionCriteria: config.selectionCriteria,
    });
  }
}
