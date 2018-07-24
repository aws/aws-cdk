using Amazon.CDK;
using Amazon.CDK.AWS.GameLift.cloudformation.FleetResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.GameLift.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-fleet.html </remarks>
    public class FleetResourceProps : DeputyBase, IFleetResourceProps
    {
        /// <summary>``AWS::GameLift::Fleet.BuildId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-fleet.html#cfn-gamelift-fleet-buildid </remarks>
        [JsiiProperty("buildId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object BuildId
        {
            get;
            set;
        }

        /// <summary>``AWS::GameLift::Fleet.DesiredEC2Instances``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-fleet.html#cfn-gamelift-fleet-desiredec2instances </remarks>
        [JsiiProperty("desiredEc2Instances", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object DesiredEc2Instances
        {
            get;
            set;
        }

        /// <summary>``AWS::GameLift::Fleet.EC2InstanceType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-fleet.html#cfn-gamelift-fleet-ec2instancetype </remarks>
        [JsiiProperty("ec2InstanceType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object Ec2InstanceType
        {
            get;
            set;
        }

        /// <summary>``AWS::GameLift::Fleet.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-fleet.html#cfn-gamelift-fleet-name </remarks>
        [JsiiProperty("fleetName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object FleetName
        {
            get;
            set;
        }

        /// <summary>``AWS::GameLift::Fleet.ServerLaunchPath``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-fleet.html#cfn-gamelift-fleet-serverlaunchpath </remarks>
        [JsiiProperty("serverLaunchPath", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object ServerLaunchPath
        {
            get;
            set;
        }

        /// <summary>``AWS::GameLift::Fleet.Description``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-fleet.html#cfn-gamelift-fleet-description </remarks>
        [JsiiProperty("description", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Description
        {
            get;
            set;
        }

        /// <summary>``AWS::GameLift::Fleet.EC2InboundPermissions``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-fleet.html#cfn-gamelift-fleet-ec2inboundpermissions </remarks>
        [JsiiProperty("ec2InboundPermissions", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-gamelift.cloudformation.FleetResource.IpPermissionProperty\"}]}}}}]},\"optional\":true}", true)]
        public object Ec2InboundPermissions
        {
            get;
            set;
        }

        /// <summary>``AWS::GameLift::Fleet.LogPaths``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-fleet.html#cfn-gamelift-fleet-logpaths </remarks>
        [JsiiProperty("logPaths", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}", true)]
        public object LogPaths
        {
            get;
            set;
        }

        /// <summary>``AWS::GameLift::Fleet.MaxSize``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-fleet.html#cfn-gamelift-fleet-maxsize </remarks>
        [JsiiProperty("maxSize", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object MaxSize
        {
            get;
            set;
        }

        /// <summary>``AWS::GameLift::Fleet.MinSize``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-fleet.html#cfn-gamelift-fleet-minsize </remarks>
        [JsiiProperty("minSize", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object MinSize
        {
            get;
            set;
        }

        /// <summary>``AWS::GameLift::Fleet.ServerLaunchParameters``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-gamelift-fleet.html#cfn-gamelift-fleet-serverlaunchparameters </remarks>
        [JsiiProperty("serverLaunchParameters", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object ServerLaunchParameters
        {
            get;
            set;
        }
    }
}