import iam = require('@aws-cdk/aws-iam');
import sfn = require('@aws-cdk/aws-stepfunctions');
import cdk = require('@aws-cdk/cdk');
import { AlgorithmSpecification, Channel, OutputDataConfig, ResourceConfig, StoppingCondition, Tag, VpcConfig } from './sagemaker-base-types';

/**
 * Basic properties for SageMaker CreateTrainingJob tasks.
 */
export interface CreateTrainingJobkProps {

    /**
     * Name of the training job.
     */
    readonly trainingJobName: string;

    /**
     * Identifies the training algorithm to use.
     */
    readonly algorithmSpec: AlgorithmSpecification;

    /**
     * Enables encryption between ML compute instances.
     */
    readonly enableInterContainerTrafficEncryption?: boolean;

    /**
     * Isolates the training container.
     */
    readonly enableNetworkIsolation?: boolean;

    /**
     * Algorithm-specific parameters that influence the quality of the model.
     */
    readonly hyperparameters?: {[key: string]: any};

    /**
     * Array of Channel objects. Each channel is a named input source.
     */
    readonly inputDataConfig: Channel[];

    /**
     * Path to the S3 bucket where you want to store model artifacts.
     */
    readonly outputDataConfig: OutputDataConfig;

    /**
     * Resources to use for model training.
     */
    readonly resourceConfig: ResourceConfig;

    /**
     * IAM role that Amazon SageMaker can assume to perform tasks on your behalf.
     */
    readonly role: iam.Role;

    /**
     * Stopping condition
     */
    readonly stoppingCondition?: StoppingCondition;

    /**
     * Tags
     */
    readonly tags?: Tag[];

    /**
     * VPC config
     */
    readonly vpcConfig?: VpcConfig;
}