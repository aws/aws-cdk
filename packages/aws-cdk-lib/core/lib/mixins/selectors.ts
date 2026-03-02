import type { IConstruct, Node } from 'constructs';
import { CfnResource } from '../cfn-resource';

/**
 * Selects constructs from a construct tree.
 */
export interface IConstructSelector {
  /**
   * Selects constructs from the given scope based on the selector's criteria.
   */
  select(scope: IConstruct): IConstruct[];
}

/**
 * Selects constructs from a construct tree based on various criteria.
 */
export class ConstructSelector {
  /**
   * Selects all constructs in the tree.
   */
  static all(): IConstructSelector {
    return new AllConstructsSelector();
  }

  /**
   * Selects CfnResource constructs or the default CfnResource child.
   */
  static cfnResource(): IConstructSelector {
    return new CfnResourceSelector();
  }

  /**
   * Selects only the provided construct.
   */
  static onlyItself(): IConstructSelector {
    return new OnlyItselfSelector();
  }

  /**
   * Selects constructs of a specific type.
   */
  static resourcesOfType(...types: string[]): IConstructSelector {
    return new ResourceTypeSelector(types);
  }

  /**
   * Selects constructs whose construct IDs match a pattern.
   * Uses glob like matching.
   */
  static byId(pattern: string): IConstructSelector {
    return new IdPatternSelector(pattern, 'id');
  }

  /**
   * Selects constructs whose construct paths match a pattern.
   * Uses glob like matching.
   */
  static byPath(pattern: string): IConstructSelector {
    return new IdPatternSelector(pattern, 'path');
  }
}

class AllConstructsSelector implements IConstructSelector {
  select(scope: IConstruct): IConstruct[] {
    return scope.node.findAll();
  }
}

class CfnResourceSelector implements IConstructSelector {
  select(scope: IConstruct): IConstruct[] {
    if (CfnResource.isCfnResource(scope)) {
      return [scope];
    }
    const defaultChild = scope.node.defaultChild;
    if (CfnResource.isCfnResource(defaultChild)) {
      return [defaultChild];
    }
    return [];
  }
}

class ResourceTypeSelector implements IConstructSelector {
  constructor(private readonly types: string[]) {
  }

  select(scope: IConstruct): IConstruct[] {
    const result: IConstruct[] = [];
    const visit = (node: IConstruct) => {
      if (CfnResource.isCfnResource(node) && this.types.includes(node.cfnResourceType)) {
        result.push(node);
      }
      for (const child of node.node.children) {
        visit(child);
      }
    };
    visit(scope);
    return result;
  }
}

// Must be a 'require' to not run afoul of ESM module import rules
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { minimatch } = require('minimatch');

class IdPatternSelector implements IConstructSelector {
  constructor(private readonly pattern: string, private field: keyof Node) {}

  select(scope: IConstruct): IConstruct[] {
    const result: IConstruct[] = [];
    const visit = (node: IConstruct) => {
      if (minimatch(node.node[this.field], this.pattern)) {
        result.push(node);
      }
      for (const child of node.node.children) {
        visit(child);
      }
    };
    visit(scope);
    return result;
  }
}

class OnlyItselfSelector implements IConstructSelector {
  select(scope: IConstruct): IConstruct[] {
    return [scope];
  }
}
