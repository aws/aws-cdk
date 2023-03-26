import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnApplication`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html
 */
export interface CfnApplicationProps {
    /**
     * The EMR release version associated with the application.
     *
     * *Minimum* : 1
     *
     * *Maximum* : 64
     *
     * *Pattern* : `^[A-Za-z0-9._/-]+$`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-releaselabel
     */
    readonly releaseLabel: string;
    /**
     * The type of application, such as Spark or Hive.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-type
     */
    readonly type: string;
    /**
     * The CPU architecture type of the application. Allowed values: `X86_64` or `ARM64`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-architecture
     */
    readonly architecture?: string;
    /**
     * The configuration for an application to automatically start on job submission.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-autostartconfiguration
     */
    readonly autoStartConfiguration?: CfnApplication.AutoStartConfigurationProperty | cdk.IResolvable;
    /**
     * The configuration for an application to automatically stop after a certain amount of time being idle.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-autostopconfiguration
     */
    readonly autoStopConfiguration?: CfnApplication.AutoStopConfigurationProperty | cdk.IResolvable;
    /**
     * The initial capacity of the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-initialcapacity
     */
    readonly initialCapacity?: Array<CfnApplication.InitialCapacityConfigKeyValuePairProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * The maximum capacity of the application. This is cumulative across all workers at any given point in time during the lifespan of the application is created. No new resources will be created once any one of the defined limits is hit.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-maximumcapacity
     */
    readonly maximumCapacity?: CfnApplication.MaximumAllowedResourcesProperty | cdk.IResolvable;
    /**
     * The name of the application.
     *
     * *Minimum* : 1
     *
     * *Maximum* : 64
     *
     * *Pattern* : `^[A-Za-z0-9._\\/#-]+$`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-name
     */
    readonly name?: string;
    /**
     * The network configuration for customer VPC connectivity for the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-networkconfiguration
     */
    readonly networkConfiguration?: CfnApplication.NetworkConfigurationProperty | cdk.IResolvable;
    /**
     * The tags assigned to the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-tags
     */
    readonly tags?: cdk.CfnTag[];
}
/**
 * A CloudFormation `AWS::EMRServerless::Application`
 *
 * The `AWS::EMRServerless::Application` resource specifies an EMR Serverless application. An application uses open source analytics frameworks to run jobs that process data. To create an application, you must specify the release version for the open source framework version you want to use and the type of application you want, such as Apache Spark or Apache Hive. After you create an application, you can submit data processing jobs or interactive requests to it.
 *
 * @cloudformationResource AWS::EMRServerless::Application
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html
 */
export declare class CfnApplication extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::EMRServerless::Application";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApplication;
    /**
     * The ID of the application, such as `ab4rp1abcs8xz47n3x0example` .
     * @cloudformationAttribute ApplicationId
     */
    readonly attrApplicationId: string;
    /**
     * The Amazon Resource Name (ARN) of the project.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The EMR release version associated with the application.
     *
     * *Minimum* : 1
     *
     * *Maximum* : 64
     *
     * *Pattern* : `^[A-Za-z0-9._/-]+$`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-releaselabel
     */
    releaseLabel: string;
    /**
     * The type of application, such as Spark or Hive.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-type
     */
    type: string;
    /**
     * The CPU architecture type of the application. Allowed values: `X86_64` or `ARM64`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-architecture
     */
    architecture: string | undefined;
    /**
     * The configuration for an application to automatically start on job submission.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-autostartconfiguration
     */
    autoStartConfiguration: CfnApplication.AutoStartConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * The configuration for an application to automatically stop after a certain amount of time being idle.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-autostopconfiguration
     */
    autoStopConfiguration: CfnApplication.AutoStopConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * The initial capacity of the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-initialcapacity
     */
    initialCapacity: Array<CfnApplication.InitialCapacityConfigKeyValuePairProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * The maximum capacity of the application. This is cumulative across all workers at any given point in time during the lifespan of the application is created. No new resources will be created once any one of the defined limits is hit.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-maximumcapacity
     */
    maximumCapacity: CfnApplication.MaximumAllowedResourcesProperty | cdk.IResolvable | undefined;
    /**
     * The name of the application.
     *
     * *Minimum* : 1
     *
     * *Maximum* : 64
     *
     * *Pattern* : `^[A-Za-z0-9._\\/#-]+$`
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-name
     */
    name: string | undefined;
    /**
     * The network configuration for customer VPC connectivity for the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-networkconfiguration
     */
    networkConfiguration: CfnApplication.NetworkConfigurationProperty | cdk.IResolvable | undefined;
    /**
     * The tags assigned to the application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::EMRServerless::Application`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnApplicationProps);
    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    inspect(inspector: cdk.TreeInspector): void;
    protected get cfnProperties(): {
        [key: string]: any;
    };
    protected renderProperties(props: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
}
export declare namespace CfnApplication {
    /**
     * The conﬁguration for an application to automatically start on job submission.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-autostartconfiguration.html
     */
    interface AutoStartConfigurationProperty {
        /**
         * Enables the application to automatically start on job submission. Defaults to true.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-autostartconfiguration.html#cfn-emrserverless-application-autostartconfiguration-enabled
         */
        readonly enabled?: boolean | cdk.IResolvable;
    }
}
export declare namespace CfnApplication {
    /**
     * The conﬁguration for an application to automatically stop after a certain amount of time being idle.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-autostopconfiguration.html
     */
    interface AutoStopConfigurationProperty {
        /**
         * Enables the application to automatically stop after a certain amount of time being idle. Defaults to true.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-autostopconfiguration.html#cfn-emrserverless-application-autostopconfiguration-enabled
         */
        readonly enabled?: boolean | cdk.IResolvable;
        /**
         * The amount of idle time in minutes after which your application will automatically stop. Defaults to 15 minutes.
         *
         * *Minimum* : 1
         *
         * *Maximum* : 10080
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-autostopconfiguration.html#cfn-emrserverless-application-autostopconfiguration-idletimeoutminutes
         */
        readonly idleTimeoutMinutes?: number;
    }
}
export declare namespace CfnApplication {
    /**
     * The initial capacity configuration per worker.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-initialcapacityconfig.html
     */
    interface InitialCapacityConfigProperty {
        /**
         * The resource configuration of the initial capacity configuration.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-initialcapacityconfig.html#cfn-emrserverless-application-initialcapacityconfig-workerconfiguration
         */
        readonly workerConfiguration: CfnApplication.WorkerConfigurationProperty | cdk.IResolvable;
        /**
         * The number of workers in the initial capacity configuration.
         *
         * *Minimum* : 1
         *
         * *Maximum* : 1000000
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-initialcapacityconfig.html#cfn-emrserverless-application-initialcapacityconfig-workercount
         */
        readonly workerCount: number;
    }
}
export declare namespace CfnApplication {
    /**
     * The initial capacity configuration per worker.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-initialcapacityconfigkeyvaluepair.html
     */
    interface InitialCapacityConfigKeyValuePairProperty {
        /**
         * The worker type for an analytics framework. For Spark applications, the key can either be set to `Driver` or `Executor` . For Hive applications, it can be set to `HiveDriver` or `TezTask` .
         *
         * *Minimum* : 1
         *
         * *Maximum* : 50
         *
         * *Pattern* : `^[a-zA-Z]+[-_]*[a-zA-Z]+$`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-initialcapacityconfigkeyvaluepair.html#cfn-emrserverless-application-initialcapacityconfigkeyvaluepair-key
         */
        readonly key: string;
        /**
         * The value for the initial capacity configuration per worker.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-initialcapacityconfigkeyvaluepair.html#cfn-emrserverless-application-initialcapacityconfigkeyvaluepair-value
         */
        readonly value: CfnApplication.InitialCapacityConfigProperty | cdk.IResolvable;
    }
}
export declare namespace CfnApplication {
    /**
     * The maximum allowed cumulative resources for an application. No new resources will be created once the limit is hit.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-maximumallowedresources.html
     */
    interface MaximumAllowedResourcesProperty {
        /**
         * The maximum allowed CPU for an application.
         *
         * *Minimum* : 1
         *
         * *Maximum* : 15
         *
         * *Pattern* : `^[1-9][0-9]*(\\s)?(vCPU|vcpu|VCPU)?$`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-maximumallowedresources.html#cfn-emrserverless-application-maximumallowedresources-cpu
         */
        readonly cpu: string;
        /**
         * The maximum allowed disk for an application.
         *
         * *Minimum* : 1
         *
         * *Maximum* : 15
         *
         * *Pattern* : `^[1-9][0-9]*(\\s)?(GB|gb|gB|Gb)$"`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-maximumallowedresources.html#cfn-emrserverless-application-maximumallowedresources-disk
         */
        readonly disk?: string;
        /**
         * The maximum allowed resources for an application.
         *
         * *Minimum* : 1
         *
         * *Maximum* : 15
         *
         * *Pattern* : `^[1-9][0-9]*(\\s)?(GB|gb|gB|Gb)?$`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-maximumallowedresources.html#cfn-emrserverless-application-maximumallowedresources-memory
         */
        readonly memory: string;
    }
}
export declare namespace CfnApplication {
    /**
     * The network configuration for customer VPC connectivity.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-networkconfiguration.html
     */
    interface NetworkConfigurationProperty {
        /**
         * The array of security group Ids for customer VPC connectivity.
         *
         * *Minimum* : 1
         *
         * *Maximum* : 32
         *
         * *Pattern* : `^[-0-9a-zA-Z]+`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-networkconfiguration.html#cfn-emrserverless-application-networkconfiguration-securitygroupids
         */
        readonly securityGroupIds?: string[];
        /**
         * The array of subnet Ids for customer VPC connectivity.
         *
         * *Minimum* : 1
         *
         * *Maximum* : 32
         *
         * *Pattern* : `^[-0-9a-zA-Z]+`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-networkconfiguration.html#cfn-emrserverless-application-networkconfiguration-subnetids
         */
        readonly subnetIds?: string[];
    }
}
export declare namespace CfnApplication {
    /**
     * The resource configuration of the initial capacity configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-workerconfiguration.html
     */
    interface WorkerConfigurationProperty {
        /**
         * *Minimum* : 1
         *
         * *Maximum* : 15
         *
         * *Pattern* : `^[1-9][0-9]*(\\s)?(vCPU|vcpu|VCPU)?$`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-workerconfiguration.html#cfn-emrserverless-application-workerconfiguration-cpu
         */
        readonly cpu: string;
        /**
         * *Minimum* : 1
         *
         * *Maximum* : 15
         *
         * *Pattern* : `^[1-9][0-9]*(\\s)?(GB|gb|gB|Gb)$"`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-workerconfiguration.html#cfn-emrserverless-application-workerconfiguration-disk
         */
        readonly disk?: string;
        /**
         * *Minimum* : 1
         *
         * *Maximum* : 15
         *
         * *Pattern* : `^[1-9][0-9]*(\\s)?(GB|gb|gB|Gb)?$`
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-workerconfiguration.html#cfn-emrserverless-application-workerconfiguration-memory
         */
        readonly memory: string;
    }
}
