import { EventPattern } from './event-pattern';
/**
 * Merge the `src` event pattern into the `dest` event pattern by adding all
 * values from `src` into the fields in `dest`.
 *
 * See `rule.addEventPattern` for details.
 */
export declare function mergeEventPattern(dest: any, src: any): any;
/**
 * Transform an eventPattern object into a valid Event Rule Pattern
 * by changing detailType into detail-type when present.
 */
export declare function renderEventPattern(eventPattern: EventPattern): any;
