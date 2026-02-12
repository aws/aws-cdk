import { UnscopedValidationError } from '../../../core/lib/errors';
import type { CfnListenerRule } from '../elasticloadbalancingv2.generated';

/**
 * Properties for a rewrite rule
 */
export interface RewriteRule {
  /**
   * The regex pattern to match
   */
  readonly regex: string;
  /**
   * The string to replace the matched pattern
   */
  readonly replace: string;
}

/**
 * Transform types for listener rules
 */
export enum TransformType {
  /**
   * Host header rewrite transform
   */
  HOST_HEADER_REWRITE = 'host-header-rewrite',
  /**
   * URL rewrite transform
   */
  URL_REWRITE = 'url-rewrite',
}

/**
 * Listener rule transforms
 */
export class ListenerTransform {
  /**
   * Create a host header rewrite transform
   */
  public static hostHeaderRewrite(rewrites: RewriteRule[]): ListenerTransform {
    return new ListenerTransform(TransformType.HOST_HEADER_REWRITE, rewrites);
  }

  /**
   * Create a URL rewrite transform
   */
  public static urlRewrite(rewrites: RewriteRule[]): ListenerTransform {
    return new ListenerTransform(TransformType.URL_REWRITE, rewrites);
  }

  /**
   * Get the transform type
   */
  public get type(): TransformType {
    return this._type;
  }

  private constructor(
    private readonly _type: TransformType,
    private readonly rewrites: RewriteRule[],
  ) {
    this.validateRewrites(rewrites);
  }

  private validateRewrites(rewrites: RewriteRule[]): void {
    if (rewrites.length !== 1) {
      throw new UnscopedValidationError(`Exactly one rewrite rule must be specified, got ${rewrites.length}.`);
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

  /**
   * Render the raw Cfn listener rule transform object
   */
  public renderRawTransform(): CfnListenerRule.TransformProperty {
    const rewritesConfig = this.rewrites.map(rewrite => ({
      regex: rewrite.regex,
      replace: rewrite.replace,
    }));

    switch (this._type) {
      case TransformType.HOST_HEADER_REWRITE:
        return {
          type: this._type,
          hostHeaderRewriteConfig: {
            rewrites: rewritesConfig,
          },
        };
      case TransformType.URL_REWRITE:
        return {
          type: this._type,
          urlRewriteConfig: {
            rewrites: rewritesConfig,
          },
        };
      default:
        throw new UnscopedValidationError(`Unsupported transform type: ${this._type}`);
    }
  }
}
