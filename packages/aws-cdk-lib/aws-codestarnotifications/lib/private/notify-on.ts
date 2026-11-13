import type { Construct } from 'constructs';
import type { INotificationRule, NotificationRuleProps } from '../notification-rule';
import { NotificationRule } from '../notification-rule';

/**
 * Create the notification rule for a `notifyOn` call.
 *
 * If `scope` already has a notification rule with this `id`, the events and
 * target are added to that rule instead, so several `notifyOnXxx()` calls can
 * share one notification rule.
 */
export function notifyOn(scope: Construct, id: string, props: NotificationRuleProps): INotificationRule {
  const existing = scope.node.tryFindChild(id);
  if (NotificationRule.isNotificationRule(existing)) {
    existing._merge(props);
    return existing;
  }
  return new NotificationRule(scope, id, props);
}
