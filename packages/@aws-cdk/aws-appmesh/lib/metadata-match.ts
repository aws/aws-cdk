import { CfnRoute } from './appmesh.generated';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

/**
 * Configuration for `MetadataMatch`
 */
export interface MetadataMatchConfig {
  /**
   * The gRPC route metadata match.
   */
  readonly metadataMatch: CfnRoute.GrpcRouteMetadataProperty;
}

/**
 * Used to generate metadata matching methods.
 */
export abstract class MetadataMatch {
  /**
   * The value of the metadata with the given name in the request must match the
   * specified value exactly.
   *
   * @param metadataName the name of the gRPC metadata to match against
   * @param metadataValue The exact value to test against
   */
  static valueIs(metadataName: string, metadataValue: string): MetadataMatch {
    return new MetadataMatchImpl(metadataName, false, { exact: metadataValue });
  }

  /**
   * The value of the metadata with the given name in the request must not match
   * the specified value exactly.
   *
   * @param metadataName the name of the gRPC metadata to match against
   * @param metadataValue The exact value to test against
   */
  static valueIsNot(metadataName: string, metadataValue: string): MetadataMatch {
    return new MetadataMatchImpl(metadataName, true, { exact: metadataValue });
  }

  /**
   * The value of the metadata with the given name in the request must start with
   * the specified characters.
   *
   * @param metadataName the name of the gRPC metadata to match against
   * @param prefix The prefix to test against
   */
  static valueStartsWith(metadataName: string, prefix: string): MetadataMatch {
    return new MetadataMatchImpl(metadataName, false, { prefix });
  }

  /**
   * The value of the metadata with the given name in the request must not start
   * with the specified characters.
   *
   * @param metadataName the name of the gRPC metadata to match against
   * @param prefix The prefix to test against
   */
  static valueDoesNotStartWith(metadataName: string, prefix: string): MetadataMatch {
    return new MetadataMatchImpl(metadataName, true, { prefix });
  }

  /**
   * The value of the metadata with the given name in the request must end with
   * the specified characters.
   *
   * @param metadataName the name of the gRPC metadata to match against
   * @param suffix The suffix to test against
   */
  static valueEndsWith(metadataName: string, suffix: string): MetadataMatch {
    return new MetadataMatchImpl(metadataName, false, { suffix });
  }

  /**
   * The value of the metadata with the given name in the request must not end
   * with the specified characters.
   *
   * @param metadataName the name of the gRPC metadata to match against
   * @param suffix The suffix to test against
   */
  static valueDoesNotEndWith(metadataName: string, suffix: string): MetadataMatch {
    return new MetadataMatchImpl(metadataName, true, { suffix });
  }

  /**
   * The value of the metadata with the given name in the request must include
   * the specified characters.
   *
   * @param metadataName the name of the gRPC metadata to match against
   * @param regex The regex to test against
   */
  static valueMatchesRegex(metadataName: string, regex: string): MetadataMatch {
    return new MetadataMatchImpl(metadataName, false, { regex });
  }

  /**
   * The value of the metadata with the given name in the request must not
   * include the specified characters.
   *
   * @param metadataName the name of the gRPC metadata to match against
   * @param regex The regex to test against
   */
  static valueDoesNotMatchRegex(metadataName: string, regex: string): MetadataMatch {
    return new MetadataMatchImpl(metadataName, true, { regex });
  }

  /**
   * The value of the metadata with the given name in the request must be in a
   * range of values.
   *
   * @param metadataName the name of the gRPC metadata to match against
   * @param start Match on values starting at and including this value
   * @param end Match on values up to but not including this value
   */
  static valuesIsInRange(metadataName: string, start: number, end: number): MetadataMatch {
    return new MetadataMatchImpl(metadataName, false, {
      range: {
        start,
        end,
      },
    });
  }

  /**
   * The value of the metadata with the given name in the request must not be in
   * a range of values.
   *
   * @param metadataName the name of the gRPC metadata to match against
   * @param start Match on values starting at and including this value
   * @param end Match on values up to but not including this value
   */
  static valuesIsNotInRange(metadataName: string, start: number, end: number): MetadataMatch {
    return new MetadataMatchImpl(metadataName, true, {
      range: {
        start,
        end,
      },
    });
  }

  /**
   * Returns the metadata match configuration.
   */
  public abstract bind(scope: Construct): MetadataMatchConfig;
}

class MetadataMatchImpl extends MetadataMatch {
  constructor(
    private readonly metadataName: string,
    private readonly invert: boolean,
    private readonly matchProperty: CfnRoute.GrpcRouteMetadataMatchMethodProperty,
  ) {
    super();
  }

  bind(_scope: Construct): MetadataMatchConfig {
    return {
      metadataMatch: {
        name: this.metadataName,
        invert: this.invert,
        match: this.matchProperty,
      },
    };
  }
}
