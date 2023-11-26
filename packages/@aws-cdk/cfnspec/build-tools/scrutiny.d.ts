import { schema } from '../lib';
/**
 * Auto-detect common properties to apply scrutiny to by using heuristics
 *
 * Manually enhancing scrutiny attributes for each property does not scale
 * well. Fortunately, the most important ones follow a common naming scheme and
 * we tag all of them at once in this way.
 *
 * If the heuristic scheme gets it wrong in some individual cases, those can be
 * fixed using schema patches.
 */
export declare function detectScrutinyTypes(spec: schema.Specification): void;
