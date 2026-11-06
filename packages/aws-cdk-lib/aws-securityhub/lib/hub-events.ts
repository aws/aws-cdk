import * as events from '../../aws-events';
import { Stack, Token, TokenComparison, ValidationError } from '../../core';
import { lit } from '../../core/lib/private/literal-string';
import type { IHubRef } from '../../interfaces/generated/aws-securityhub-interfaces.generated';

/** EventBridge integrations for a Security Hub CSPM hub. */
export class HubEvents {
  /** Create event helpers for an L1, L2, or imported hub reference. */
  public static fromHub(hub: IHubRef): HubEvents {
    return new HubEvents(hub);
  }

  private constructor(private readonly hub: IHubRef) {}

  /**
   * Create a rule for Security Hub events in the referenced account and Region.
   *
   * The rule is created in the reference's stack, or crossStackScope if supplied.
   * Cross-account event forwarding is not configured by this helper.
   * Source, account and Region filters are fixed by the hub reference and must
   * not be supplied in eventPattern. Typed helpers also reserve detailType.
   */
  public onEvent(id: string, options: events.OnEventOptions = {}): events.Rule {
    return this.createRule(id, options);
  }

  /** Create a rule for newly imported or updated findings. */
  public onImportedFindings(id: string, options: events.OnEventOptions = {}): events.Rule {
    return this.createRule(id, options, 'Security Hub Findings - Imported');
  }

  /** Create a rule for findings sent by a Security Hub custom action. */
  public onCustomAction(id: string, options: events.OnEventOptions = {}): events.Rule {
    return this.createRule(id, options, 'Security Hub Findings - Custom Action');
  }

  /** Create a rule for insight results sent by a custom action. */
  public onInsightResults(id: string, options: events.OnEventOptions = {}): events.Rule {
    return this.createRule(id, options, 'Security Hub Insight Results');
  }

  private createRule(id: string, options: events.OnEventOptions, detailType?: string): events.Rule {
    const scope = options.crossStackScope ?? this.hub;
    const pattern = options.eventPattern;
    if (pattern && (pattern.source !== undefined || pattern.account !== undefined || pattern.region !== undefined ||
      (detailType !== undefined && pattern.detailType !== undefined))) {
      throw new ValidationError(lit`HubEventReservedFilters`, 'Security Hub eventPattern must not specify source, account, region, or a typed helper\'s detailType.', scope);
    }
    const stack = Stack.of(scope);
    if (Token.compareStrings(stack.account, this.hub.env.account) === TokenComparison.DIFFERENT ||
      Token.compareStrings(stack.region, this.hub.env.region) === TokenComparison.DIFFERENT) {
      throw new ValidationError(lit`HubEventEnvironmentMismatch`, 'Security Hub event rules must be created in the same account and Region as the hub.', scope);
    }
    const rule = new events.Rule(scope, id, {
      ...options,
      eventPattern: {
        ...options.eventPattern,
        source: ['aws.securityhub'],
        account: [this.hub.env.account],
        region: [this.hub.env.region],
        detailType: detailType ? [detailType] : options.eventPattern?.detailType,
      },
    });
    rule.addTarget(options.target);
    return rule;
  }
}
