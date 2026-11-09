import { UnscopedValidationError } from '../../../core/lib/errors';
import { lit } from '../../../core/lib/private/literal-string';

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
 * Listener rule transforms
 */
export abstract class ListenerTransform {
  /**
   * Create a host header rewrite transform
   *
   * @param rewrites The host header rewrite rules. Currently exactly one rule must be specified.
   */
  public static hostHeaderRewrite(rewrites: RewriteRule[]): ListenerTransform {
    return new HostHeaderRewriteTransform(rewrites);
  }

  /**
   * Create a URL rewrite transform
   *
   * @param rewrites The URL rewrite rules. Currently exactly one rule must be specified.
   */
  public static urlRewrite(rewrites: RewriteRule[]): ListenerTransform {
    return new UrlRewriteTransform(rewrites);
  }

  /**
   * Render the raw Cfn listener rule transform object.
   */
  public abstract renderRawTransform(): any;
}

/**
 * Validate the rewrite rules of a transform
 */
function validateRewrites(rewrites: RewriteRule[]): void {
  if (rewrites.length !== 1) {
    throw new UnscopedValidationError(lit`RewriteCount`, `Exactly one rewrite rule must be specified, got ${rewrites.length}.`);
  }

  rewrites.forEach((rewrite, index) => {
    if (!rewrite.regex) {
      throw new UnscopedValidationError(lit`EmptyRegex`, `Rewrite rule at index ${index}: regex cannot be empty`);
    }
    if (!rewrite.replace) {
      throw new UnscopedValidationError(lit`EmptyReplace`, `Rewrite rule at index ${index}: replace cannot be empty`);
    }
  });
}

function renderRewrites(rewrites: RewriteRule[]) {
  return rewrites.map(rewrite => ({
    regex: rewrite.regex,
    replace: rewrite.replace,
  }));
}

/**
 * Host header rewrite transform of the listener rule
 */
class HostHeaderRewriteTransform extends ListenerTransform {
  constructor(private readonly rewrites: RewriteRule[]) {
    super();
    validateRewrites(rewrites);
  }

  public renderRawTransform(): any {
    return {
      type: 'host-header-rewrite',
      hostHeaderRewriteConfig: {
        rewrites: renderRewrites(this.rewrites),
      },
    };
  }
}

/**
 * URL rewrite transform of the listener rule
 */
class UrlRewriteTransform extends ListenerTransform {
  constructor(private readonly rewrites: RewriteRule[]) {
    super();
    validateRewrites(rewrites);
  }

  public renderRawTransform(): any {
    return {
      type: 'url-rewrite',
      urlRewriteConfig: {
        rewrites: renderRewrites(this.rewrites),
      },
    };
  }
}
