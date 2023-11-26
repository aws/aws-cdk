/**
 * Run validations on the spec evolution, on the pull request.
 *
 * First `git checkout`s the old commit, builds the spec, does the
 * same for the new commit, then runs comparisons on the both.
 *
 * Expects and uses git.
 */
export declare function validateSpecificationEvolution(specProducer: () => Promise<any>): Promise<void>;
