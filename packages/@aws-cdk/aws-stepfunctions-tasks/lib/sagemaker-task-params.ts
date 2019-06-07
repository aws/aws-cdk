import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { AlgorithmSpecification, BatchStrategy,Channel, OutputDataConfig, ResourceConfig,
    TransformInput, TransformOutput, TransformResources, VpcConfig } from './sagemaker-base-types';

/**
 * Parameters for the SageMaker Training Job.
 */
export class TrainingJobParameters extends cdk.Token {

    public trainingJobName: string;
    public role: iam.Role;
    private algorithmSpec: {[key: string]: any} = {};
    private hyperparameters: {[key: string]: any};
    private inputDataConfig = new Array<any>();
    private outputDataConfig: {[key: string]: any} = {};
    private resourceConfig: {[key: string]: any} = {};
    private stoppingCondition: {[key: string]: any} = {};
    private tags = new Array<any>();
    private vpcConfig: {[key: string]: any};

    constructor(name: string, role: iam.Role) {
        super();
        this.trainingJobName = name;
        this.role = role;
    }

    /**
     * Adds the Alogorithm Specification config.
     */
    public addAlgorithmSpec(spec: AlgorithmSpecification): TrainingJobParameters {
        this.algorithmSpec = {
            TrainingInputMode: spec.trainingInputMode,
            ...(spec.trainingImage) ? { TrainingImage: spec.trainingImage } : {},
            ...(spec.algorithmName) ? { AlgorithmName: spec.algorithmName } : {},
        };
        if (spec.metricDefinitions) {
            this.algorithmSpec.MetricDefinitions = [];
            spec.metricDefinitions.forEach(metric => this.algorithmSpec.MetricDefinitions.push( { Name: metric.name, Regex: metric.regex } ));
        }
        return this;
    }

    /**
     * Add a hyperparameter to the config to the parameters.
     */
    public addHyperparameter(key: string, value: string): TrainingJobParameters {
        if (! this.hyperparameters) {
            this.hyperparameters = {};
        }
        this.hyperparameters[key] = value;
        return this;
    }

    /**
     * Add multiple hyperparameters to the config to the parameters.
     */
    public addHyperparameters(params: {[key: string]: any}): TrainingJobParameters {
        Object.keys(params).map(key => {
            this.addHyperparameter(key, params[key]);
        });
        return this;
    }

    /**
     * Add an InputDataConfig to the list of config objects to the parameters.
     */
    public addInputDataConfig(config: Channel): TrainingJobParameters {
        this.inputDataConfig.push({
            ChannelName: config.channelName,
            DataSource: {
                S3DataSource: {
                    S3Uri: config.dataSource.s3DataSource.s3Uri,
                    S3DataType: config.dataSource.s3DataSource.s3DataType,
                    ...(config.dataSource.s3DataSource.s3DataDistributionType) ?
                        { S3DataDistributionType: config.dataSource.s3DataSource.s3DataDistributionType} : {},
                    ...(config.dataSource.s3DataSource.attributeNames) ? { AtttributeNames: config.dataSource.s3DataSource.attributeNames } : {},
                }
            },
            ...(config.compressionType) ? { CompressionType: config.compressionType } : {},
            ...(config.contentType) ? { ContentType: config.contentType } : {},
            ...(config.inputMode) ? { InputMode: config.inputMode } : {},
            ...(config.recordWrapperType) ? { RecordWrapperType: config.recordWrapperType } : {},
        });
        return this;
    }

    /**
     * Add a list of InputDataConfig objects to the parameters.
     */
    public addInputDataConfigs(configs: Channel[]): TrainingJobParameters {
        configs.forEach(config => this.addInputDataConfig(config));
        return this;
    }

    /**
     * Add a single tag pair to the parameters.
     */
    public addTag(name: string, value: string): TrainingJobParameters {
        this.tags.push({ Key: name, Value: value });
        return this;
    }

    /**
     * Add multiple tag pairs to the parameters.
     */
    public addTags(tags: {[key: string]: any}): TrainingJobParameters {
        Object.keys(tags).map(key => {
            this.addTag(key, tags[key]);
        });
        return this;
    }

    /**
     * Adds the Output Data Config to the parameters.
     */
    public addOutputDataConfig(config: OutputDataConfig): TrainingJobParameters {
        this.outputDataConfig = {
            S3OutputPath: config.s3OutputPath,
            ...(config.encryptionKey) ? { KmsKeyId: config.encryptionKey.keyArn } : {},
        };
        return this;
    }

    /**
     * Add a Resource Config to the parameters.
     */
    public addResourceConfig(config: ResourceConfig): TrainingJobParameters {
        this.resourceConfig = {
            InstanceCount: config.instanceCount,
            InstanceType: 'ml.' + config.instanceType,
            VolumeSizeInGB: config.volumeSizeInGB,
            ...(config.volumeKmsKeyId) ? { VolumeKmsKeyId: config.volumeKmsKeyId.keyArn } : {},
        };
        return this;
    }

    /**
     * Add a Stopping Condition to the parameters.
     */
    public addStoppingCondition(maxRuntime: number): TrainingJobParameters {
        this.stoppingCondition = { MaxRuntimeInSeconds: maxRuntime };
        return this;
    }

    /**
     * Add a VPC config to the parameters.
     */
    public addVpcConfig(config: VpcConfig): TrainingJobParameters {
        this.vpcConfig = {
            SecurityGroupIds: [],
            Subnets: []
        };
        config.securityGroups.forEach(sg => this.vpcConfig.SecurityGroupIds.push(sg.securityGroupId));
        config.subnets.forEach(subnet => this.vpcConfig.Subnets.push(subnet.subnetId));
        return this;
    }

    //
    // Serialization
    //
    public resolve(_context: cdk.IResolveContext): any {
        return this.toJson();
    }

    public toJson(): any {
        if (Object.entries(this.algorithmSpec).length === 0) {
            throw new Error("Mandatory parameter 'AlgorithmSpecification' is empty");
        }

        if (Object.entries(this.inputDataConfig).length === 0) {
            throw new Error("Mandatory parameter 'InputDataConfig' is empty");
        }

        if (Object.entries(this.outputDataConfig).length === 0) {
            throw new Error("Mandatory parameter 'OutputDataConfig' is empty");
        }

        if (Object.entries(this.resourceConfig).length === 0) {
            throw new Error("Mandatory parameter 'ResourceConfig' is empty");
        }

        if (Object.entries(this.stoppingCondition).length === 0) {
            throw new Error("Mandatory parameter 'StoppingCondition' is empty");
        }

        return {
            TrainingJobName: this.trainingJobName,
            RoleArn: this.role.roleArn,
            AlgorithmSpecification: this.algorithmSpec,
            ...(this.hyperparameters) ? { HyperParameters: this.hyperparameters } : {},
            InputDataConfig: this.inputDataConfig,
            OutputDataConfig: this.outputDataConfig,
            ResourceConfig: this.resourceConfig,
            StoppingCondition: this.stoppingCondition,
            ...(this.tags.length > 0) ? { Tags: this.tags } : {},
            ...(this.vpcConfig) ? { VpcConfig: this.vpcConfig} : {},
        };
    }
}

/**
 * A class holding the SageMalker Transform Job parameters.
 */
export class TransformJobParameters extends cdk.Token {

    public transformJobName: string;
    public role: iam.Role;
    private batchStrategy: string;
    private environmentVars: {[key: string]: any};
    private maxConcurrentTransforms: number;
    private maxPayloadInMB: number;
    private modelName: string;
    private tags = new Array<any>();
    private transformInput: {[key: string]: any} = {};
    private transformOutput: {[key: string]: any} = {};
    private transformResources: {[key: string]: any} = {};

    constructor(jobName: string, modelName: string, role: iam.Role) {
        super();
        this.transformJobName = jobName;
        this.modelName = modelName;
        this.role = role;
    }

    /**
     * Add a Batch strategy to the parameters.
     */
    public addBatchStrategy(strategy: BatchStrategy): TransformJobParameters {
        this.batchStrategy = strategy;
        return this;
    }

    /**
     * Add an environment variable pair to the parameters.
     */
    public addEnvironmentVar(key: string, value: string): TransformJobParameters {
        if (! this.environmentVars) {
            this.environmentVars = {};
        }
        this.environmentVars[key] = value;
        return this;
    }

    /**
     * Add multiple environment variable pairs to the parameters.
     */
    public addEnvironmentVars(envars: {[key: string]: any}): TransformJobParameters {
        Object.keys(envars).map(key => {
            this.addEnvironmentVar(key, envars[key]);
        });
        return this;
    }

    /**
     * Add a max concurrent transforms value to the parameters.
     */
    public addMaxConcurrentTransforms(max: number): TransformJobParameters {
        this.maxConcurrentTransforms = max;
        return this;
    }

    /**
     * Add a max payload in MB to the parameters.
     */
    public addMxaxPayloadInMB(max: number): TransformJobParameters {
        this.maxPayloadInMB = max;
        return this;
    }

    /**
     * Add an Transform Input config to the parameters.
     */
    public addTransformInput(input: TransformInput): TransformJobParameters {
        this.transformInput = {
            DataSource: {
                S3DataSource: {
                    S3Uri: input.transformDataSource.s3DataSource.s3Uri,
                    S3DataType: input.transformDataSource.s3DataSource.s3DataType,
                }
            },
            ...(input.compressionType) ? { CompressionType: input.compressionType } : {},
            ...(input.contentType) ? { ContentType: input.contentType } : {},
            ...(input.splitType) ? { SplitType: input.splitType } : {},
        };
        return this;
    }

    /**
     * Add a single tag pair to the parameters.
     */
    public addTag(name: string, value: string): TransformJobParameters {
        this.tags.push({ Key: name, Value: value });
        return this;
    }

    /**
     * Add multiple tag pairs
     */
    public addTags(tags: {[key: string]: any}): TransformJobParameters {
        Object.keys(tags).map(key => {
            this.addTag(key, tags[key]);
        });
        return this;
    }

    /**
     * Add a Transform Output config to the parameters.
     */
    public addTransformOutput(output: TransformOutput): TransformJobParameters {
        this.transformOutput = {
            S3OutputPath: output.s3OutputPath,
            ...(output.encryptionKey) ? { KmsKeyId: output.encryptionKey.keyArn } : {},
            ...(output.accept) ? { Accept: output.accept } : {},
            ...(output.assembleWith) ? { AssembleWith: output.assembleWith } : {},
        };
        return this;
    }

    /**
     * Add a Transform Resource config to the parameters.
     */
    public addTransformResources(resource: TransformResources): TransformJobParameters {
        this.transformResources = {
            InstanceCount: resource.instanceCount,
            InstanceType: 'ml.' + resource.instanceType,
            ...(resource.volumeKmsKeyId) ? { VolumeKmsKeyId: resource.volumeKmsKeyId.keyArn } : {},
        };
        return this;
    }

    public resolve(_context: cdk.IResolveContext): any {
        return this.toJson();
    }

    public toJson(): any {
        if (Object.entries(this.transformInput).length === 0) {
            throw new Error("Mandatory parameter 'TransformInput' is empty");
        }

        if (Object.entries(this.transformOutput).length === 0) {
            throw new Error("Mandatory parameter 'TransformOutput' is empty");
        }

        if (Object.entries(this.transformResources).length === 0) {
            throw new Error("Mandatory parameter 'TransformResources' is empty");
        }

        return {
            ...(this.batchStrategy) ? { BatchStrategy: this.batchStrategy} : {},
            ...(this.environmentVars) ? { Environment: this.environmentVars} : {},
            ...(this.maxConcurrentTransforms) ? { MaxConcurrentTransforms: this.maxConcurrentTransforms} : {},
            ...(this.maxPayloadInMB) ? { MaxPayloadInMB: this.maxPayloadInMB } : {},
            ModelName: this.modelName,
            ...(this.tags.length > 0) ? { Tags: this.tags } : {},
            TransformInput: this.transformInput,
            TransformJobName: this.transformJobName,
            TransformOutput: this.transformOutput,
            TransformResources: this.transformResources,
        };
    }
}