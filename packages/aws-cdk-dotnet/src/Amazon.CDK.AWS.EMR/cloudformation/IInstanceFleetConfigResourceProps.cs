using Amazon.CDK;
using Amazon.CDK.AWS.EMR.cloudformation.InstanceFleetConfigResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EMR.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-instancefleetconfig.html </remarks>
    [JsiiInterface(typeof(IInstanceFleetConfigResourceProps), "@aws-cdk/aws-emr.cloudformation.InstanceFleetConfigResourceProps")]
    public interface IInstanceFleetConfigResourceProps
    {
        /// <summary>``AWS::EMR::InstanceFleetConfig.ClusterId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-instancefleetconfig.html#cfn-elasticmapreduce-instancefleetconfig-clusterid </remarks>
        [JsiiProperty("clusterId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object ClusterId
        {
            get;
            set;
        }

        /// <summary>``AWS::EMR::InstanceFleetConfig.InstanceFleetType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-instancefleetconfig.html#cfn-elasticmapreduce-instancefleetconfig-instancefleettype </remarks>
        [JsiiProperty("instanceFleetType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object InstanceFleetType
        {
            get;
            set;
        }

        /// <summary>``AWS::EMR::InstanceFleetConfig.InstanceTypeConfigs``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-instancefleetconfig.html#cfn-elasticmapreduce-instancefleetconfig-instancetypeconfigs </remarks>
        [JsiiProperty("instanceTypeConfigs", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-emr.cloudformation.InstanceFleetConfigResource.InstanceTypeConfigProperty\"}]}}}}]},\"optional\":true}")]
        object InstanceTypeConfigs
        {
            get;
            set;
        }

        /// <summary>``AWS::EMR::InstanceFleetConfig.LaunchSpecifications``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-instancefleetconfig.html#cfn-elasticmapreduce-instancefleetconfig-launchspecifications </remarks>
        [JsiiProperty("launchSpecifications", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-emr.cloudformation.InstanceFleetConfigResource.InstanceFleetProvisioningSpecificationsProperty\"}]},\"optional\":true}")]
        object LaunchSpecifications
        {
            get;
            set;
        }

        /// <summary>``AWS::EMR::InstanceFleetConfig.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-instancefleetconfig.html#cfn-elasticmapreduce-instancefleetconfig-name </remarks>
        [JsiiProperty("instanceFleetConfigName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object InstanceFleetConfigName
        {
            get;
            set;
        }

        /// <summary>``AWS::EMR::InstanceFleetConfig.TargetOnDemandCapacity``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-instancefleetconfig.html#cfn-elasticmapreduce-instancefleetconfig-targetondemandcapacity </remarks>
        [JsiiProperty("targetOnDemandCapacity", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object TargetOnDemandCapacity
        {
            get;
            set;
        }

        /// <summary>``AWS::EMR::InstanceFleetConfig.TargetSpotCapacity``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-instancefleetconfig.html#cfn-elasticmapreduce-instancefleetconfig-targetspotcapacity </remarks>
        [JsiiProperty("targetSpotCapacity", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object TargetSpotCapacity
        {
            get;
            set;
        }
    }
}