import { Artifact } from '../artifact';
/**
 * Validation function that checks if the number of artifacts is within the given bounds
 */
export declare function validateArtifactBounds(type: string, artifacts: Artifact[], min: number, max: number, category: string, provider: string): string[];
/**
 * Validation function that guarantees that an action is or is not a source action. This is useful because Source actions can only be
 * in the first stage of a pipeline, and the first stage can only contain source actions.
 */
export declare function validateSourceAction(mustBeSource: boolean, category: string, actionName: string, stageName: string): string[];
/**
 * Validate the given name of a pipeline component. Pipeline component names all have the same restrictions.
 * This can be used to validate the name of all components of a pipeline.
 */
export declare function validateName(thing: string, name: string | undefined): void;
export declare function validateArtifactName(artifactName: string | undefined): void;
export declare function validateNamespaceName(namespaceName: string | undefined): void;
