import type { IConstruct } from 'constructs';
import { CfnResource } from '../cfn-resource';
import { memoizedGetter } from './memoize';

/**
 * Matches CfnResources by CloudFormation type and a custom predicate.
 */
export interface ICfnResourceMatcher {
  /**
   * The CloudFormation resource type to match (e.g. 'AWS::S3::Bucket').
   */
  readonly cfnResourceType: string;

  /**
   * Whether the candidate CfnResource matches.
   */
  matches(candidate: CfnResource): boolean;
}

/**
 * Reflection utilities for searching the construct tree.
 *
 * Use `ConstructReflection.of(construct)` to create an instance, then
 * call methods to search for related CfnResources or inspect the construct's
 * position in the tree.
 */
export class ConstructReflection {
  /**
   * Create a reflection for the given construct.
   */
  static of(construct: IConstruct): ConstructReflection {
    return new ConstructReflection(construct);
  }

  private readonly construct: IConstruct;

  private constructor(construct: IConstruct) {
    this.construct = construct;
  }

  /**
   * The owner of this construct, if it is a default child.
   *
   * Returns the parent scope when the construct has an id of `'Resource'` or
   * `'Default'`, indicating it was created as a default child by a
   * higher-level construct. Returns `undefined` otherwise.
   */
  @memoizedGetter
  get defaultChildOwner(): IConstruct | undefined {
    if (this.construct.node.scope && (this.construct.node.id === 'Resource' || this.construct.node.id === 'Default')) {
      return this.construct.node.scope;
    }
    return undefined;
  }

  /**
   * Finds the CfnResource backing this construct.
   *
   * Checks in order: the construct itself, its default child, then searches
   * the broader construct tree for the closest match.
   */
  findCfnResource(matcher: ICfnResourceMatcher): CfnResource | undefined {
    const isCfnType = (c: IConstruct): c is CfnResource => {
      return CfnResource.isCfnResource(c) && c.cfnResourceType === matcher.cfnResourceType;
    };

    if (isCfnType(this.construct)) {
      return this.construct;
    }

    if (this.construct.node.defaultChild && isCfnType(this.construct.node.defaultChild)) {
      return this.construct.node.defaultChild;
    }

    return this.findRelatedCfnResource(matcher);
  }

  /**
   * Finds the closest related CfnResource in the construct tree.
   *
   * Searches children first (depth-first), then ancestors (breadth-first).
   */
  findRelatedCfnResource(matcher: ICfnResourceMatcher): CfnResource | undefined {
    let closestMatch: CfnResource | undefined;
    let closestDistance = Infinity;
    const visited = new Set<IConstruct>();

    const isMatch = (child: IConstruct): child is CfnResource => {
      return CfnResource.isCfnResource(child) && child.cfnResourceType === matcher.cfnResourceType;
    };

    const checkCandidate = (candidate: IConstruct, distance: number) => {
      if (isMatch(candidate) && matcher.matches(candidate) && distance < closestDistance) {
        closestMatch = candidate;
        closestDistance = distance;
      }
    };

    const searchChildren = (parent: IConstruct, distance: number) => {
      if (distance >= closestDistance) {
        return;
      }

      for (const child of parent.node.children) {
        if (visited.has(child)) {
          continue;
        }
        visited.add(child);

        checkCandidate(child, distance);
        searchChildren(child, distance + 1);
      }
    };

    searchChildren(this.construct, 1);

    let ancestor = this.construct.node.scope;
    let ancestorDistance = 1;

    while (ancestor && ancestorDistance < closestDistance) {
      for (const sibling of ancestor.node.children) {
        searchChildren(sibling, ancestorDistance);
      }
      ancestor = ancestor.node.scope;
      ancestorDistance++;
    }

    return closestMatch;
  }
}
