import { Match } from './match';
import { Matcher } from './matcher';
import { Stack, Stage } from '../../core';
import { AssertionError } from './private/error';

type ManifestTags = { [key: string]: string };

/**
 * Allows assertions on the tags associated with a synthesized CDK stack's
 * manifest. Stack tags are not part of the synthesized template, so can only be
 * checked from the manifest in this manner.
 */
export class Tags {
  /**
   * Find tags associated with a synthesized CDK `Stack`.
   *
   * @param stack the CDK Stack to find tags on.
   */
  public static fromStack(stack: Stack): Tags {
    return new Tags(getManifestTags(stack));
  }

  private readonly _tags: ManifestTags;

  private constructor(tags: ManifestTags) {
    this._tags = tags;
  }

  /**
   * Assert that the given Matcher or object matches the tags associated with
   * the synthesized CDK Stack's manifest.
   *
   * @param tags the expected set of tags. This should be a
   * string or Matcher object.
   */
  public hasValues(tags: any): void {
    // The Cloud Assembly API defaults tags to {} when undefined. Using
    // Match.absent() will not work as the caller expects, so we push them
    // towards a working API.
    if (Matcher.isMatcher(tags) && tags.name === 'absent') {
      throw new AssertionError(
        'Match.absent() will never match Tags because "{}" is the default value. Use Tags.hasNone() instead.',
      );
    }

    const matcher = Matcher.isMatcher(tags) ? tags : Match.objectLike(tags);

    const result = matcher.test(this.all());
    if (result.hasFailed()) {
      throw new AssertionError(
        'Stack tags did not match as expected:\n' + result.renderMismatch(),
      );
    }
  }

  /**
   * Assert that the there are no tags associated with the synthesized CDK
   * Stack's manifest.
   *
   * This is a convenience method over `hasValues(Match.exact({}))`, and is
   * present because the more obvious method of detecting no tags
   * (`Match.absent()`) will not work. Manifests default the tag set to an empty
   * object.
   */
  public hasNone(): void {
    this.hasValues(Match.exact({}));
  }

  /**
   * Get the tags associated with the manifest. This will be an empty object if
   * no tags were supplied.
   *
   * @returns The tags associated with the stack's synthesized manifest.
   */
  public all(): ManifestTags {
    return this._tags;
  }
}

function getManifestTags(stack: Stack): ManifestTags {
  const root = stack.node.root;
  if (!Stage.isStage(root)) {
    throw new AssertionError('unexpected: all stacks must be part of a Stage or an App');
  }

  // synthesis is not forced: the stack will only be synthesized once regardless
  // of the number of times this is called.
  const assembly = root.synth();

  const artifact = assembly.getStackArtifact(stack.artifactId);
  return artifact.tags;
}
