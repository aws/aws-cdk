import { Assertion } from '../assertion';
import { Inspector } from '../inspector';
export declare class AndAssertion<InspectorClass extends Inspector> extends Assertion<InspectorClass> {
    private readonly first;
    private readonly second;
    description: string;
    constructor(first: Assertion<InspectorClass>, second: Assertion<InspectorClass>);
    assertUsing(_inspector: InspectorClass): boolean;
    assertOrThrow(inspector: InspectorClass): void;
}
