import { Construct } from 'constructs';
import { CfnWebACL } from './wafv2.generated';

/**
 * The type returned from the `bind()` method in {@link DefaultAction}.
 */
export interface DefaultActionConfig {
  /**
   * The configuration for this default action.
   */
  readonly configuration: CfnWebACL.DefaultActionProperty;
}

/**
 * The action to perform if none of the Rules contained in the WebACL match.
 */
export abstract class DefaultAction {
  /**
   * Specifies that AWS WAF should allow requests by default.
   */
  public static allow(): DefaultAction {
    return new AllowAction();
  }

  /**
   * Specifies that AWS WAF should block requests by default.
   */
  public static block(): DefaultAction {
    return new BlockAction();
  }

  /**
   * Returns the DefaultAction configuration.
   */
  public abstract bind(scope: Construct): DefaultActionConfig
}

class AllowAction extends DefaultAction {
  bind(_scope: Construct) {
    return {
      configuration: {
        allow: {},
      },
    };
  }
};

class BlockAction extends DefaultAction {
  bind(_scope: Construct) {
    return {
      configuration: {
        block: {},
      },
    };
  }
};
