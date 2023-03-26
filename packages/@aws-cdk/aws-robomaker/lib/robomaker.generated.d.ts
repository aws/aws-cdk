import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';
/**
 * Properties for defining a `CfnFleet`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-fleet.html
 */
export interface CfnFleetProps {
    /**
     * The name of the fleet.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-fleet.html#cfn-robomaker-fleet-name
     */
    readonly name?: string;
    /**
     * The list of all tags added to the fleet.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-fleet.html#cfn-robomaker-fleet-tags
     */
    readonly tags?: {
        [key: string]: (string);
    };
}
/**
 * A CloudFormation `AWS::RoboMaker::Fleet`
 *
 * > The following resource is now deprecated. This resource can no longer be provisioned via stack create or update operations, and should not be included in your stack templates.
 * >
 * > We recommend migrating to AWS IoT Greengrass Version 2. For more information, see [Support Changes: May 2, 2022](https://docs.aws.amazon.com/robomaker/latest/dg/chapter-support-policy.html#software-support-policy-may2022) in the *AWS RoboMaker Developer Guide* .
 *
 * The `AWS::RoboMaker::Fleet` resource creates an AWS RoboMaker fleet. Fleets contain robots and can receive deployments.
 *
 * @cloudformationResource AWS::RoboMaker::Fleet
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-fleet.html
 */
export declare class CfnFleet extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::RoboMaker::Fleet";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFleet;
    /**
     * The Amazon Resource Name (ARN) of the fleet, such as `arn:aws:robomaker:us-west-2:123456789012:deployment-fleet/MyFleet/1539894765711` .
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The name of the fleet.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-fleet.html#cfn-robomaker-fleet-name
     */
    name: string | undefined;
    /**
     * The list of all tags added to the fleet.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-fleet.html#cfn-robomaker-fleet-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::RoboMaker::Fleet`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props?: CfnFleetProps);
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
/**
 * Properties for defining a `CfnRobot`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robot.html
 */
export interface CfnRobotProps {
    /**
     * The architecture of the robot.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robot.html#cfn-robomaker-robot-architecture
     */
    readonly architecture: string;
    /**
     * The Greengrass group associated with the robot.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robot.html#cfn-robomaker-robot-greengrassgroupid
     */
    readonly greengrassGroupId: string;
    /**
     * The Amazon Resource Name (ARN) of the fleet to which the robot will be registered.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robot.html#cfn-robomaker-robot-fleet
     */
    readonly fleet?: string;
    /**
     * The name of the robot.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robot.html#cfn-robomaker-robot-name
     */
    readonly name?: string;
    /**
     * A map that contains tag keys and tag values that are attached to the robot.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robot.html#cfn-robomaker-robot-tags
     */
    readonly tags?: {
        [key: string]: (string);
    };
}
/**
 * A CloudFormation `AWS::RoboMaker::Robot`
 *
 * > The following resource is now deprecated. This resource can no longer be provisioned via stack create or update operations, and should not be included in your stack templates.
 * >
 * > We recommend migrating to AWS IoT Greengrass Version 2. For more information, see [Support Changes: May 2, 2022](https://docs.aws.amazon.com/robomaker/latest/dg/chapter-support-policy.html#software-support-policy-may2022) in the *AWS RoboMaker Developer Guide* .
 *
 * The `AWS::RoboMaker::RobotApplication` resource creates an AWS RoboMaker robot.
 *
 * @cloudformationResource AWS::RoboMaker::Robot
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robot.html
 */
export declare class CfnRobot extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::RoboMaker::Robot";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRobot;
    /**
     * The Amazon Resource Name (ARN) of the robot.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The architecture of the robot.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robot.html#cfn-robomaker-robot-architecture
     */
    architecture: string;
    /**
     * The Greengrass group associated with the robot.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robot.html#cfn-robomaker-robot-greengrassgroupid
     */
    greengrassGroupId: string;
    /**
     * The Amazon Resource Name (ARN) of the fleet to which the robot will be registered.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robot.html#cfn-robomaker-robot-fleet
     */
    fleet: string | undefined;
    /**
     * The name of the robot.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robot.html#cfn-robomaker-robot-name
     */
    name: string | undefined;
    /**
     * A map that contains tag keys and tag values that are attached to the robot.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robot.html#cfn-robomaker-robot-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::RoboMaker::Robot`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnRobotProps);
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
/**
 * Properties for defining a `CfnRobotApplication`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplication.html
 */
export interface CfnRobotApplicationProps {
    /**
     * The robot software suite used by the robot application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplication.html#cfn-robomaker-robotapplication-robotsoftwaresuite
     */
    readonly robotSoftwareSuite: CfnRobotApplication.RobotSoftwareSuiteProperty | cdk.IResolvable;
    /**
     * The current revision id.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplication.html#cfn-robomaker-robotapplication-currentrevisionid
     */
    readonly currentRevisionId?: string;
    /**
     * The environment of the robot application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplication.html#cfn-robomaker-robotapplication-environment
     */
    readonly environment?: string;
    /**
     * The name of the robot application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplication.html#cfn-robomaker-robotapplication-name
     */
    readonly name?: string;
    /**
     * The sources of the robot application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplication.html#cfn-robomaker-robotapplication-sources
     */
    readonly sources?: Array<CfnRobotApplication.SourceConfigProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * A map that contains tag keys and tag values that are attached to the robot application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplication.html#cfn-robomaker-robotapplication-tags
     */
    readonly tags?: {
        [key: string]: (string);
    };
}
/**
 * A CloudFormation `AWS::RoboMaker::RobotApplication`
 *
 * The `AWS::RoboMaker::RobotApplication` resource creates an AWS RoboMaker robot application.
 *
 * @cloudformationResource AWS::RoboMaker::RobotApplication
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplication.html
 */
export declare class CfnRobotApplication extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::RoboMaker::RobotApplication";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRobotApplication;
    /**
     * The Amazon Resource Name (ARN) of the robot application.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The current revision id.
     * @cloudformationAttribute CurrentRevisionId
     */
    readonly attrCurrentRevisionId: string;
    /**
     * The robot software suite used by the robot application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplication.html#cfn-robomaker-robotapplication-robotsoftwaresuite
     */
    robotSoftwareSuite: CfnRobotApplication.RobotSoftwareSuiteProperty | cdk.IResolvable;
    /**
     * The current revision id.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplication.html#cfn-robomaker-robotapplication-currentrevisionid
     */
    currentRevisionId: string | undefined;
    /**
     * The environment of the robot application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplication.html#cfn-robomaker-robotapplication-environment
     */
    environment: string | undefined;
    /**
     * The name of the robot application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplication.html#cfn-robomaker-robotapplication-name
     */
    name: string | undefined;
    /**
     * The sources of the robot application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplication.html#cfn-robomaker-robotapplication-sources
     */
    sources: Array<CfnRobotApplication.SourceConfigProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * A map that contains tag keys and tag values that are attached to the robot application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplication.html#cfn-robomaker-robotapplication-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::RoboMaker::RobotApplication`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnRobotApplicationProps);
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
export declare namespace CfnRobotApplication {
    /**
     * Information about a robot software suite.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-robotapplication-robotsoftwaresuite.html
     */
    interface RobotSoftwareSuiteProperty {
        /**
         * The name of the robot software suite. `General` is the only supported value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-robotapplication-robotsoftwaresuite.html#cfn-robomaker-robotapplication-robotsoftwaresuite-name
         */
        readonly name: string;
        /**
         * The version of the robot software suite. Not applicable for General software suite.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-robotapplication-robotsoftwaresuite.html#cfn-robomaker-robotapplication-robotsoftwaresuite-version
         */
        readonly version?: string;
    }
}
export declare namespace CfnRobotApplication {
    /**
     * Information about a source configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-robotapplication-sourceconfig.html
     */
    interface SourceConfigProperty {
        /**
         * The target processor architecture for the application.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-robotapplication-sourceconfig.html#cfn-robomaker-robotapplication-sourceconfig-architecture
         */
        readonly architecture: string;
        /**
         * The Amazon S3 bucket name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-robotapplication-sourceconfig.html#cfn-robomaker-robotapplication-sourceconfig-s3bucket
         */
        readonly s3Bucket: string;
        /**
         * The s3 object key.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-robotapplication-sourceconfig.html#cfn-robomaker-robotapplication-sourceconfig-s3key
         */
        readonly s3Key: string;
    }
}
/**
 * Properties for defining a `CfnRobotApplicationVersion`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplicationversion.html
 */
export interface CfnRobotApplicationVersionProps {
    /**
     * The application information for the robot application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplicationversion.html#cfn-robomaker-robotapplicationversion-application
     */
    readonly application: string;
    /**
     * The current revision id for the robot application. If you provide a value and it matches the latest revision ID, a new version will be created.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplicationversion.html#cfn-robomaker-robotapplicationversion-currentrevisionid
     */
    readonly currentRevisionId?: string;
}
/**
 * A CloudFormation `AWS::RoboMaker::RobotApplicationVersion`
 *
 * The `AWS::RoboMaker::RobotApplicationVersion` resource creates an AWS RoboMaker robot version.
 *
 * @cloudformationResource AWS::RoboMaker::RobotApplicationVersion
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplicationversion.html
 */
export declare class CfnRobotApplicationVersion extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::RoboMaker::RobotApplicationVersion";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRobotApplicationVersion;
    /**
     * The robot application version.
     * @cloudformationAttribute ApplicationVersion
     */
    readonly attrApplicationVersion: string;
    /**
     * The Amazon Resource Name (ARN) of the robot application version.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The application information for the robot application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplicationversion.html#cfn-robomaker-robotapplicationversion-application
     */
    application: string;
    /**
     * The current revision id for the robot application. If you provide a value and it matches the latest revision ID, a new version will be created.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-robotapplicationversion.html#cfn-robomaker-robotapplicationversion-currentrevisionid
     */
    currentRevisionId: string | undefined;
    /**
     * Create a new `AWS::RoboMaker::RobotApplicationVersion`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnRobotApplicationVersionProps);
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
/**
 * Properties for defining a `CfnSimulationApplication`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplication.html
 */
export interface CfnSimulationApplicationProps {
    /**
     * The robot software suite used by the simulation application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplication.html#cfn-robomaker-simulationapplication-robotsoftwaresuite
     */
    readonly robotSoftwareSuite: CfnSimulationApplication.RobotSoftwareSuiteProperty | cdk.IResolvable;
    /**
     * The simulation software suite used by the simulation application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplication.html#cfn-robomaker-simulationapplication-simulationsoftwaresuite
     */
    readonly simulationSoftwareSuite: CfnSimulationApplication.SimulationSoftwareSuiteProperty | cdk.IResolvable;
    /**
     * The current revision id.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplication.html#cfn-robomaker-simulationapplication-currentrevisionid
     */
    readonly currentRevisionId?: string;
    /**
     * The environment of the simulation application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplication.html#cfn-robomaker-simulationapplication-environment
     */
    readonly environment?: string;
    /**
     * The name of the simulation application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplication.html#cfn-robomaker-simulationapplication-name
     */
    readonly name?: string;
    /**
     * The rendering engine for the simulation application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplication.html#cfn-robomaker-simulationapplication-renderingengine
     */
    readonly renderingEngine?: CfnSimulationApplication.RenderingEngineProperty | cdk.IResolvable;
    /**
     * The sources of the simulation application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplication.html#cfn-robomaker-simulationapplication-sources
     */
    readonly sources?: Array<CfnSimulationApplication.SourceConfigProperty | cdk.IResolvable> | cdk.IResolvable;
    /**
     * A map that contains tag keys and tag values that are attached to the simulation application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplication.html#cfn-robomaker-simulationapplication-tags
     */
    readonly tags?: {
        [key: string]: (string);
    };
}
/**
 * A CloudFormation `AWS::RoboMaker::SimulationApplication`
 *
 * The `AWS::RoboMaker::SimulationApplication` resource creates an AWS RoboMaker simulation application.
 *
 * @cloudformationResource AWS::RoboMaker::SimulationApplication
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplication.html
 */
export declare class CfnSimulationApplication extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::RoboMaker::SimulationApplication";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSimulationApplication;
    /**
     * The Amazon Resource Name (ARN) of the simulation application.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The current revision id.
     * @cloudformationAttribute CurrentRevisionId
     */
    readonly attrCurrentRevisionId: string;
    /**
     * The robot software suite used by the simulation application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplication.html#cfn-robomaker-simulationapplication-robotsoftwaresuite
     */
    robotSoftwareSuite: CfnSimulationApplication.RobotSoftwareSuiteProperty | cdk.IResolvable;
    /**
     * The simulation software suite used by the simulation application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplication.html#cfn-robomaker-simulationapplication-simulationsoftwaresuite
     */
    simulationSoftwareSuite: CfnSimulationApplication.SimulationSoftwareSuiteProperty | cdk.IResolvable;
    /**
     * The current revision id.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplication.html#cfn-robomaker-simulationapplication-currentrevisionid
     */
    currentRevisionId: string | undefined;
    /**
     * The environment of the simulation application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplication.html#cfn-robomaker-simulationapplication-environment
     */
    environment: string | undefined;
    /**
     * The name of the simulation application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplication.html#cfn-robomaker-simulationapplication-name
     */
    name: string | undefined;
    /**
     * The rendering engine for the simulation application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplication.html#cfn-robomaker-simulationapplication-renderingengine
     */
    renderingEngine: CfnSimulationApplication.RenderingEngineProperty | cdk.IResolvable | undefined;
    /**
     * The sources of the simulation application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplication.html#cfn-robomaker-simulationapplication-sources
     */
    sources: Array<CfnSimulationApplication.SourceConfigProperty | cdk.IResolvable> | cdk.IResolvable | undefined;
    /**
     * A map that contains tag keys and tag values that are attached to the simulation application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplication.html#cfn-robomaker-simulationapplication-tags
     */
    readonly tags: cdk.TagManager;
    /**
     * Create a new `AWS::RoboMaker::SimulationApplication`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnSimulationApplicationProps);
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
export declare namespace CfnSimulationApplication {
    /**
     * Information about a rendering engine.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-simulationapplication-renderingengine.html
     */
    interface RenderingEngineProperty {
        /**
         * The name of the rendering engine.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-simulationapplication-renderingengine.html#cfn-robomaker-simulationapplication-renderingengine-name
         */
        readonly name: string;
        /**
         * The version of the rendering engine.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-simulationapplication-renderingengine.html#cfn-robomaker-simulationapplication-renderingengine-version
         */
        readonly version: string;
    }
}
export declare namespace CfnSimulationApplication {
    /**
     * Information about a robot software suite.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-simulationapplication-robotsoftwaresuite.html
     */
    interface RobotSoftwareSuiteProperty {
        /**
         * The name of the robot software suite. `General` is the only supported value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-simulationapplication-robotsoftwaresuite.html#cfn-robomaker-simulationapplication-robotsoftwaresuite-name
         */
        readonly name: string;
        /**
         * The version of the robot software suite. Not applicable for General software suite.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-simulationapplication-robotsoftwaresuite.html#cfn-robomaker-simulationapplication-robotsoftwaresuite-version
         */
        readonly version?: string;
    }
}
export declare namespace CfnSimulationApplication {
    /**
     * Information about a simulation software suite.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-simulationapplication-simulationsoftwaresuite.html
     */
    interface SimulationSoftwareSuiteProperty {
        /**
         * The name of the simulation software suite. `SimulationRuntime` is the only supported value.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-simulationapplication-simulationsoftwaresuite.html#cfn-robomaker-simulationapplication-simulationsoftwaresuite-name
         */
        readonly name: string;
        /**
         * The version of the simulation software suite. Not applicable for `SimulationRuntime` .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-simulationapplication-simulationsoftwaresuite.html#cfn-robomaker-simulationapplication-simulationsoftwaresuite-version
         */
        readonly version?: string;
    }
}
export declare namespace CfnSimulationApplication {
    /**
     * Information about a source configuration.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-simulationapplication-sourceconfig.html
     */
    interface SourceConfigProperty {
        /**
         * The target processor architecture for the application.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-simulationapplication-sourceconfig.html#cfn-robomaker-simulationapplication-sourceconfig-architecture
         */
        readonly architecture: string;
        /**
         * The Amazon S3 bucket name.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-simulationapplication-sourceconfig.html#cfn-robomaker-simulationapplication-sourceconfig-s3bucket
         */
        readonly s3Bucket: string;
        /**
         * The s3 object key.
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-robomaker-simulationapplication-sourceconfig.html#cfn-robomaker-simulationapplication-sourceconfig-s3key
         */
        readonly s3Key: string;
    }
}
/**
 * Properties for defining a `CfnSimulationApplicationVersion`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplicationversion.html
 */
export interface CfnSimulationApplicationVersionProps {
    /**
     * The application information for the simulation application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplicationversion.html#cfn-robomaker-simulationapplicationversion-application
     */
    readonly application: string;
    /**
     * The current revision id for the simulation application. If you provide a value and it matches the latest revision ID, a new version will be created.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplicationversion.html#cfn-robomaker-simulationapplicationversion-currentrevisionid
     */
    readonly currentRevisionId?: string;
}
/**
 * A CloudFormation `AWS::RoboMaker::SimulationApplicationVersion`
 *
 * The `AWS::RoboMaker::SimulationApplicationVersion` resource creates a version of an AWS RoboMaker simulation application.
 *
 * @cloudformationResource AWS::RoboMaker::SimulationApplicationVersion
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplicationversion.html
 */
export declare class CfnSimulationApplicationVersion extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    static readonly CFN_RESOURCE_TYPE_NAME = "AWS::RoboMaker::SimulationApplicationVersion";
    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSimulationApplicationVersion;
    /**
     * The simulation application version.
     * @cloudformationAttribute ApplicationVersion
     */
    readonly attrApplicationVersion: string;
    /**
     * The Amazon Resource Name (ARN) of the simulation application version.
     * @cloudformationAttribute Arn
     */
    readonly attrArn: string;
    /**
     * The application information for the simulation application.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplicationversion.html#cfn-robomaker-simulationapplicationversion-application
     */
    application: string;
    /**
     * The current revision id for the simulation application. If you provide a value and it matches the latest revision ID, a new version will be created.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-robomaker-simulationapplicationversion.html#cfn-robomaker-simulationapplicationversion-currentrevisionid
     */
    currentRevisionId: string | undefined;
    /**
     * Create a new `AWS::RoboMaker::SimulationApplicationVersion`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnSimulationApplicationVersionProps);
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
