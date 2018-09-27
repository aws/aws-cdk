import { Construct } from './construct';

export type ConstructConstructor = { new (...args: any[]): Construct };

export namespace jsx {

  /**
   * The JSX factory function. This is what TypeScript converts a JSX statement to.
   *
   * For example:
   *    <Foo p1='a' p2={2}/>
   * will produce this code:
   *    jsx.create(Foo, { p1: 'a', p2: 2 }, []);
   *
   * This function will not actually create any objects, but rather just return a tree of
   * element information for later consumption by jsx.construct(tree), which can be used
   * to materialize an actual construct tree from.
   *
   * @param type The class
   * @param props Property hash
   * @param children Array of children
   * @returns element tree
   */
  export function create(type: ConstructConstructor, props: any, ...children: JSX.Element[]): JSX.Element {
    if (!(type.prototype instanceof Construct)) {
      throw new Error('All nodes must derive from Construct: ' + type);
    }

    return {
      type, props: props || {}, children
    };
  }

  /**
   * Converts a JSX tree to a construct tree.
   * Creates all construct objects and associate them together as children.
   * @param tree The JSX tree
   * @param parent Optional parent for the construct tree
   * @returns A Construct object
   */
  export function construct(tree: JSX.Element, parent?: Construct): Construct {
    const id = (tree.props && tree.props.id) || '';
    const root = new tree.type(parent, id, tree.props); // create root
    createChildren(root, tree.children);
    return root;
  }

  function createChildren(parent: Construct, children: any[]) {
    for (const child of children) {
      const id = (child.props && child.props.id) || '';
      const childObj = new child.type(parent, id, child.props);
      createChildren(childObj, child.children);
    }
  }
}

declare global {
  namespace JSX {
    /**
     * Declare JSX.Element to be the lazy specification of a Construct
     */
    export interface Element {
      type: ConstructConstructor;

      props: any;

      children: JSX.Element[];
    }

    interface ElementAttributesProperty {
      // Property of the object that TSC will use to see the allowable
      // parameters for every type.
      jsxProps: any;
    }

    interface IntrinsicAttributes {
      // Properties used by the framework, not by the individual classes.
      id: string;
    }
  }
}
