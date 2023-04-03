import { Construct } from 'constructs';
/**
 * BuildSpec for CodeBuild projects
 */
export declare abstract class BuildSpec {
    static fromObject(value: {
        [key: string]: any;
    }): BuildSpec;
    /**
     * Create a buildspec from an object that will be rendered as YAML in the resulting CloudFormation template.
     *
     * @param value the object containing the buildspec that will be rendered as YAML
     */
    static fromObjectToYaml(value: {
        [key: string]: any;
    }): BuildSpec;
    /**
     * Use a file from the source as buildspec
     *
     * Use this if you want to use a file different from 'buildspec.yml'`
     */
    static fromSourceFilename(filename: string): BuildSpec;
    /**
      * Use the contents of a local file as the build spec string
      *
      * Use this if you have a local .yml or .json file that you want to use as the buildspec
      */
    static fromAsset(path: string): BuildSpec;
    /**
     * Whether the buildspec is directly available or deferred until build-time
     */
    abstract readonly isImmediate: boolean;
    protected constructor();
    /**
     * Render the represented BuildSpec
     */
    abstract toBuildSpec(scope?: Construct): string;
}
/**
 * Merge two buildspecs into a new BuildSpec by doing a deep merge
 *
 * We decided to disallow merging of artifact specs, which is
 * actually impossible since we can't merge two buildspecs with a
 * single primary output into a buildspec with multiple outputs.
 * In case of multiple outputs they must have identifiers but we won't have that information.
 *
 * In case of test reports we replace the whole object with the RHS (instead of recursively merging)
*/
export declare function mergeBuildSpecs(lhs: BuildSpec, rhs: BuildSpec): BuildSpec;
