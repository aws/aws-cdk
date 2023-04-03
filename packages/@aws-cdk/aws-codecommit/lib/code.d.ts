import * as assets from '@aws-cdk/aws-s3-assets';
import { Construct } from 'constructs';
import { CfnRepository } from './codecommit.generated';
/**
 * Represents the structure to pass into the underlying CfnRepository class.
 */
export interface CodeConfig {
    /**
     * represents the underlying code structure
     */
    readonly code: CfnRepository.CodeProperty;
}
/**
 * Represents the contents to initialize the repository with.
 */
export declare abstract class Code {
    /**
     * Code from directory.
     * @param directoryPath the path to the local directory containing the contents to initialize the repository with
     * @param branch the name of the branch to create in the repository. Default is "main"
     */
    static fromDirectory(directoryPath: string, branch?: string): Code;
    /**
     * Code from preexisting ZIP file.
     * @param filePath the path to the local ZIP file containing the contents to initialize the repository with
     * @param branch the name of the branch to create in the repository. Default is "main"
     */
    static fromZipFile(filePath: string, branch?: string): Code;
    /**
     * Code from user-supplied asset.
     * @param asset pre-existing asset
     * @param branch the name of the branch to create in the repository. Default is "main"
     */
    static fromAsset(asset: assets.Asset, branch?: string): Code;
    /**
     * This method is called after a repository is passed this instance of Code in its 'code' property.
     *
     * @param scope the binding scope
     */
    abstract bind(scope: Construct): CodeConfig;
}
