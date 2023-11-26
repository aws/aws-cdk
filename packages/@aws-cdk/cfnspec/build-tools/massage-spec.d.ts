import { schema } from '../lib';
export declare function massageSpec(spec: schema.Specification): void;
/**
 * Modifies the provided specification so that ``ResourceTypes`` and ``PropertyTypes`` are listed in alphabetical order.
 *
 * @param spec an AWS CloudFormation Resource Specification document.
 *
 * @returns ``spec``, after having sorted the ``ResourceTypes`` and ``PropertyTypes`` sections alphabetically.
 */
export declare function normalize(spec: schema.Specification): schema.Specification;
