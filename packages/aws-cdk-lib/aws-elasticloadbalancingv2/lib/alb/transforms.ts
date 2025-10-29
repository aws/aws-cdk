import { UnscopedValidationError } from '../../../core/lib/errors';
import { CfnListenerRule } from '../elasticloadbalancingv2.generated';

/**
 * Properties for a rewrite rule
 */
export interface RewriteRule {
  /**
   * The regular expression pattern to match
   */
  readonly regex: string;

  /**
   * The replacement string
   */
  readonly replace: string;
}

/**
 * Base class for listener rule transforms
 */
export abstract class ListenerTransform {
  /**
   * Render the raw Cfn listener rule transform object.
   */
  public abstract renderRawTransform(): CfnListenerRule.TransformProperty;
}

/**
 * Host header rewrite transform for listener rules
 */
export class HostHeaderRewriteTransform extends ListenerTransform {
  constructor(public readonly rewrites: RewriteRule[]) {
    super();

    if (!rewrites || rewrites.length === 0) {
      throw new UnscopedValidationError('At least one rewrite rule must be specified');
    }

    rewrites.forEach((rewrite, index) => {
      if (!rewrite.regex) {
        throw new UnscopedValidationError(`Rewrite rule at index ${index}: regex cannot be empty`);
      }
      if (!rewrite.replace) {
        throw new UnscopedValidationError(`Rewrite rule at index ${index}: replace cannot be empty`);
      }
    });
  }

  public renderRawTransform(): CfnListenerRule.TransformProperty {
    return {
      type: 'host-header-rewrite',
      hostHeaderRewriteConfig: {
        rewrites: this.rewrites.map(rewrite => ({
          regex: rewrite.regex,
          replace: rewrite.replace,
        })),
      },
    };
  }
}

/**
 * URL rewrite transform for listener rules
 */
export class UrlRewriteTransform extends ListenerTransform {
  constructor(public readonly rewrites: RewriteRule[]) {
    super();

    if (!rewrites || rewrites.length === 0) {
      throw new UnscopedValidationError('At least one rewrite rule must be specified');
    }

    rewrites.forEach((rewrite, index) => {
      if (!rewrite.regex) {
        throw new UnscopedValidationError(`Rewrite rule at index ${index}: regex cannot be empty`);
      }
      if (!rewrite.replace) {
        throw new UnscopedValidationError(`Rewrite rule at index ${index}: replace cannot be empty`);
      }
    });
  }

  public renderRawTransform(): CfnListenerRule.TransformProperty {
    return {
      type: 'url-rewrite',
      urlRewriteConfig: {
        rewrites: this.rewrites.map(rewrite => ({
          regex: rewrite.regex,
          replace: rewrite.replace,
        })),
      },
    };
  }
}
