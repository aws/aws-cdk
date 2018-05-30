import { Construct } from './construct';

export namespace jsx {

    /**
     * The JSX factory function. This is what TypeScript converts a JSX statement to.
     *
     * For example:
     *      <Foo p1='a' p2={2}/>
     * will produce this code:
     *      jsx.create(Foo, { p1: 'a', p2: 2 }, []);
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
    export function create(type: any, props: any, ...children: any[]) {
        if (!(type.prototype instanceof Construct)) {
            throw new Error('All nodes must derive from Construct: ' + type);
        }

        return {
            type, props, children
        };
    }

    /**
     * Converts a JSX tree to a construct tree.
     * Creates all construct objects and associate them together as children.
     * @param tree The JSX tree
     * @param parent Optional parent for the construct tree
     * @returns A Construct object
     */
    export function construct(tree: any, parent?: Construct): Construct {
        const name = (tree.props && tree.props.name) || '';
        const root = new tree.type(parent, name, tree.props); // create root
        createChildren(root, tree.children);
        return root;
    }

    function createChildren(parent: Construct, children: any[]) {
        for (const child of children) {
            const name = (child.props && child.props.name) || '';
            const childObj = new child.type(parent, name, child.props);
            createChildren(childObj, child.children);
        }
    }

}
