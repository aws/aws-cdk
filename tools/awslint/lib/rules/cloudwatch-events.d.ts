import * as reflect from 'jsii-reflect';
import { Linter } from '../linter';
import { ConstructReflection } from './construct';
export declare const eventsLinter: Linter<EventsReflection>;
export declare class EventsReflection extends ConstructReflection {
    get directEventMethods(): reflect.Method[];
    get cloudTrailEventMethods(): reflect.Method[];
}
