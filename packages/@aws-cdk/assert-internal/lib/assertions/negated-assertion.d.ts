import { Assertion } from '../assertion';
import { Inspector } from '../inspector';
export declare class NegatedAssertion<I extends Inspector> extends Assertion<I> {
    private readonly negated;
    constructor(negated: Assertion<I>);
    assertUsing(inspector: I): boolean;
    get description(): string;
}
