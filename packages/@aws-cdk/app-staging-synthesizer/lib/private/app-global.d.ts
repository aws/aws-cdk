import { IConstruct } from 'constructs';
/**
 * Hold an App-wide global variable
 *
 * This is a replacement for a `static` variable, but does the right thing in case people
 * instantiate multiple Apps in the same process space (for example, in unit tests or
 * people using `cli-lib` in advanced configurations).
 *
 * This class assumes that the global you're going to be storing is a mutable object.
 */
export declare class AppScopedGlobal<A> {
    private readonly factory;
    private readonly map;
    constructor(factory: () => A);
    for(ctr: IConstruct): A;
}
