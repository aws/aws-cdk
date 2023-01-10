import * as s3_assets from '@aws-cdk/aws-s3-assets';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';

/**
 * Result of binding `Code` into a `Function`.
 */
export interface CodeConfig {
  /**
   * The location of the code in S3 (mutually exclusive with `inlineCode`.
   * @default - code is not an s3 location
   */
  readonly s3Location?: string;

  /**
   * Inline code (mutually exclusive with `s3Location`).
   * @default - code is not inline code
   */
  readonly inlineCode?: string;
}

/**
 * Represents source code for an AppSync Function or Resolver.
 */
export abstract class Code {
  /**
   * Loads the function code from a local disk path.
   *
   * @param path The path to the source code file.
   */
  public static fromAsset(path: string, options?: s3_assets.AssetOptions): AssetCode {
    return new AssetCode(path, options);
  }

  /**
   * Inline code for AppSync function
   * @returns `InlineCode` with inline code.
   * @param code The actual handler code (limited to 4KiB)
   */
  public static fromInline(code: string): InlineCode {
    return new InlineCode(code);
  }

  /**
   * Bind source code to an AppSync Function or resolver.
   */
  public abstract bind(scope: Construct): CodeConfig;
}

/**
 * Represents a local file with source code used for an AppSync Function or Resolver.
 */
export class AssetCode extends Code {
  private asset?: s3_assets.Asset;

  /**
   * @param path The path to the asset file.
   */
  constructor(public readonly path: string, private readonly options: s3_assets.AssetOptions = { }) {
    super();
  }

  public bind(scope: Construct): CodeConfig {
    // If the same AssetCode is used multiple times, retain only the first instantiation.
    if (!this.asset) {
      this.asset = new s3_assets.Asset(scope, 'Code', {
        path: this.path,
        ...this.options,
      });
    } else if (cdk.Stack.of(this.asset) !== cdk.Stack.of(scope)) {
      throw new Error(`Asset is already associated with another stack '${cdk.Stack.of(this.asset).stackName}'. ` +
        'Create a new Code instance for every stack.');
    }

    return {
      s3Location: this.asset.s3ObjectUrl,
    };
  }
}

/**
 * AppSync function code from an inline string.
 */
export class InlineCode extends Code {
  constructor(private code: string) {
    super();

    if (code.length === 0) {
      throw new Error('AppSync Inline code cannot be empty');
    }
  }

  public bind(_scope: Construct): CodeConfig {
    return {
      inlineCode: this.code,
    };
  }
}
