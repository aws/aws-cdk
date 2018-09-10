import { Test } from 'nodeunit';
import { Construct, jsx, Root } from '../../lib';

export = {
    'jsx can be used to create "trees" of constructs'(test: Test) {
        const tree = <MyRoot>
            <MyConstruct id='child1' prop1='hi' prop2={21} >
                <MyConstruct id='child11' prop1='there' />
                <MyConstruct id='child12' prop1='boo' />
            </MyConstruct>
            <MyConstruct id='child2' prop1='xxx' prop2={111} />
        </MyRoot>;

        const root = jsx.construct(tree);
        // tslint:disable-next-line:max-line-length
        test.equal(root.toTreeString(), 'MyRoot\n  MyConstruct [child1]\n    MyConstruct [child11]\n    MyConstruct [child12]\n  MyConstruct [child2]\n');
        test.equal((root.findChild('child1').findChild('child12') as MyConstruct).calculate(), 'prop1=boo, id=child12');
        test.equal((root.findChild('child2') as MyConstruct).calculate(), 'prop1=xxx, prop2=111, id=child2');

        test.done();
    },

    'jsx.construct(tree) will actually create the object'(test: Test) {
        const my = jsx.construct(<MyConstruct id='foo' prop1='hey'/>) as MyConstruct;
        test.equal(my.calculate(), 'prop1=hey, id=foo');
        test.done();
    },

    'jsx.construct(tree, parent) can be used to add a JSX tree into an existing construct tree'(test: Test) {
        const root = new Root();

        jsx.construct(<MyConstruct id='child' prop1='hey'/>, root);

        test.equal(root.findChild('child').id, 'child');
        test.done();
    }
};

class MyRoot extends Root {
    protected jsxProps: any;
}

interface MyConstructProps {
    prop1: string;
    prop2?: number;
}

class MyConstruct extends Construct {
    public foo: number;

    /**
     * This syntax tells TypeScript which properties are required for this construct.
     * Only classes with the "jsx" property can be used in JSX syntax.
     */
    protected jsxProps?: MyConstructProps;

    private str: string;

    /**
     * Constructor will always receive `props` as the 3rd argument with properties passed via JSX.
     */
    constructor(parent: Construct, id: string, props: MyConstructProps) {
        super(parent, id);

        this.str = 'prop1=' + props.prop1;
        if (props.prop2) {
            this.str += ', prop2=' + props.prop2.toString();
        }
        this.str += ', id=' + this.id;
        this.foo = 123;
    }

    public calculate() {
        return this.str;
    }
}
