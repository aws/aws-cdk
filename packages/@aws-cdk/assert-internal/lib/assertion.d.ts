import { Inspector } from './inspector';
export declare abstract class Assertion<InspectorClass extends Inspector> {
    abstract readonly description: string;
    abstract assertUsing(inspector: InspectorClass): boolean;
    /**
     * Assert this thing and another thing
     */
    and(assertion: Assertion<InspectorClass>): Assertion<InspectorClass>;
    assertOrThrow(inspector: InspectorClass): void;
}
export declare abstract class JestFriendlyAssertion<InspectorClass extends Inspector> extends Assertion<InspectorClass> {
    /**
     * Generates an error message that can be used by Jest.
     */
    abstract generateErrorMessage(): string;
}
export declare function not<T extends Inspector>(assertion: Assertion<T>): Assertion<T>;
