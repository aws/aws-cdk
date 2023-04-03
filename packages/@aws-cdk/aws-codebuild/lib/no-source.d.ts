import { Source } from './source';
/**
 * A `NO_SOURCE` CodeBuild Project Source definition.
 * This is the default source type,
 * if none was specified when creating the Project.
 * *Note*: the `NO_SOURCE` type cannot be used as a secondary source,
 * and because of that, you're not allowed to specify an identifier for it.
 *
 * This class is private to the aws-codebuild package.
 */
export declare class NoSource extends Source {
    readonly type = "NO_SOURCE";
    constructor();
}
