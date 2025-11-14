import type { IConstruct } from 'constructs';
import { CfnResource } from 'aws-cdk-lib/core';

/**
 * Selects constructs from a construct tree based on various criteria.
 */
export abstract class ConstructSelector {
  /**
   * Selects all constructs in the tree.
   */
  static all(): ConstructSelector {
    return new AllConstructsSelector();
  }

  /**
   * Selects CfnResource constructs or the default CfnResource child.
   */
  static cfnResource(): ConstructSelector {
    return new CfnResourceSelector();
  }

  /**
   * Selects constructs of a specific type.
   */
  static resourcesOfType(type: string | any): ConstructSelector {
    return new ResourceTypeSelector(type);
  }

  /**
   * Selects constructs whose IDs match a pattern.
   */
  static byId(pattern: any): ConstructSelector {
    return new IdPatternSelector(pattern);
  }

  /**
   * Selects constructs from the given scope based on the selector's criteria.
   */
  abstract select(scope: IConstruct): IConstruct[];
}

class AllConstructsSelector extends ConstructSelector {
  select(scope: IConstruct): IConstruct[] {
    return scope.node.findAll();
  }
}

class CfnResourceSelector extends ConstructSelector {
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

class ResourceTypeSelector extends ConstructSelector {
  constructor(private readonly type: string | any) {
    super();
  }

  select(scope: IConstruct): IConstruct[] {
    const result: IConstruct[] = [];
    const visit = (node: IConstruct) => {
      if (typeof this.type === 'string') {
        if (CfnResource.isCfnResource(node) && node.cfnResourceType === this.type) {
          result.push(node);
        }
      } else if ('isCfnResource' in this.type && 'CFN_RESOURCE_TYPE_NAME' in this.type) {
        if (CfnResource.isCfnResource(node) && node.cfnResourceType === this.type.CFN_RESOURCE_TYPE_NAME) {
          result.push(node);
        }
      } else {
        if (node instanceof this.type) {
          result.push(node);
        }
      }
      for (const child of node.node.children) {
        visit(child);
      }
    };
    visit(scope);
    return result;
  }
}

class IdPatternSelector extends ConstructSelector {
  constructor(private readonly pattern: any) {
    super();
  }

  select(scope: IConstruct): IConstruct[] {
    const result: IConstruct[] = [];
    const visit = (node: IConstruct) => {
      if (this.pattern && typeof this.pattern.test === 'function' && this.pattern.test(node.node.id)) {
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
