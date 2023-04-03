import * as ecr from '@aws-cdk/aws-ecr';
import { Construct } from 'constructs';
import { Architecture } from './architecture';
import { AssetImageCodeProps, EcrImageCodeProps, Code } from './code';
import { Function, FunctionOptions } from './function';
/**
 * Properties to configure a new DockerImageFunction construct.
 */
export interface DockerImageFunctionProps extends FunctionOptions {
    /**
     * The source code of your Lambda function. You can point to a file in an
     * Amazon Simple Storage Service (Amazon S3) bucket or specify your source
     * code as inline text.
     */
    readonly code: DockerImageCode;
}
/**
 * Code property for the DockerImageFunction construct
 */
export declare abstract class DockerImageCode {
    /**
     * Use an existing ECR image as the Lambda code.
     * @param repository the ECR repository that the image is in
     * @param props properties to further configure the selected image
     */
    static fromEcr(repository: ecr.IRepository, props?: EcrImageCodeProps): DockerImageCode;
    /**
     * Create an ECR image from the specified asset and bind it as the Lambda code.
     * @param directory the directory from which the asset must be created
     * @param props properties to further configure the selected image
     */
    static fromImageAsset(directory: string, props?: AssetImageCodeProps): DockerImageCode;
    /**
     * Produce a `Code` instance from this `DockerImageCode`.
     * @internal
     */
    abstract _bind(architecture?: Architecture): Code;
}
/**
 * Create a lambda function where the handler is a docker image
 */
export declare class DockerImageFunction extends Function {
    constructor(scope: Construct, id: string, props: DockerImageFunctionProps);
}
