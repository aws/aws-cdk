using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2.cloudformation.SpotFleetResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-spotfleet-spotfleetrequestconfigdata.html </remarks>
    [JsiiInterface(typeof(ISpotFleetRequestConfigDataProperty), "@aws-cdk/aws-ec2.cloudformation.SpotFleetResource.SpotFleetRequestConfigDataProperty")]
    public interface ISpotFleetRequestConfigDataProperty
    {
        /// <summary>``SpotFleetResource.SpotFleetRequestConfigDataProperty.AllocationStrategy``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-spotfleet-spotfleetrequestconfigdata.html#cfn-ec2-spotfleet-spotfleetrequestconfigdata-allocationstrategy </remarks>
        [JsiiProperty("allocationStrategy", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object AllocationStrategy
        {
            get;
            set;
        }

        /// <summary>``SpotFleetResource.SpotFleetRequestConfigDataProperty.ExcessCapacityTerminationPolicy``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-spotfleet-spotfleetrequestconfigdata.html#cfn-ec2-spotfleet-spotfleetrequestconfigdata-excesscapacityterminationpolicy </remarks>
        [JsiiProperty("excessCapacityTerminationPolicy", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ExcessCapacityTerminationPolicy
        {
            get;
            set;
        }

        /// <summary>``SpotFleetResource.SpotFleetRequestConfigDataProperty.IamFleetRole``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-spotfleet-spotfleetrequestconfigdata.html#cfn-ec2-spotfleet-spotfleetrequestconfigdata-iamfleetrole </remarks>
        [JsiiProperty("iamFleetRole", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object IamFleetRole
        {
            get;
            set;
        }

        /// <summary>``SpotFleetResource.SpotFleetRequestConfigDataProperty.LaunchSpecifications``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-spotfleet-spotfleetrequestconfigdata.html#cfn-ec2-spotfleet-spotfleetrequestconfigdata-launchspecifications </remarks>
        [JsiiProperty("launchSpecifications", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ec2.cloudformation.SpotFleetResource.SpotFleetLaunchSpecificationProperty\"}]}}}}]},\"optional\":true}")]
        object LaunchSpecifications
        {
            get;
            set;
        }

        /// <summary>``SpotFleetResource.SpotFleetRequestConfigDataProperty.ReplaceUnhealthyInstances``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-spotfleet-spotfleetrequestconfigdata.html#cfn-ec2-spotfleet-spotfleetrequestconfigdata-replaceunhealthyinstances </remarks>
        [JsiiProperty("replaceUnhealthyInstances", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ReplaceUnhealthyInstances
        {
            get;
            set;
        }

        /// <summary>``SpotFleetResource.SpotFleetRequestConfigDataProperty.SpotPrice``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-spotfleet-spotfleetrequestconfigdata.html#cfn-ec2-spotfleet-spotfleetrequestconfigdata-spotprice </remarks>
        [JsiiProperty("spotPrice", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object SpotPrice
        {
            get;
            set;
        }

        /// <summary>``SpotFleetResource.SpotFleetRequestConfigDataProperty.TargetCapacity``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-spotfleet-spotfleetrequestconfigdata.html#cfn-ec2-spotfleet-spotfleetrequestconfigdata-targetcapacity </remarks>
        [JsiiProperty("targetCapacity", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object TargetCapacity
        {
            get;
            set;
        }

        /// <summary>``SpotFleetResource.SpotFleetRequestConfigDataProperty.TerminateInstancesWithExpiration``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-spotfleet-spotfleetrequestconfigdata.html#cfn-ec2-spotfleet-spotfleetrequestconfigdata-terminateinstanceswithexpiration </remarks>
        [JsiiProperty("terminateInstancesWithExpiration", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object TerminateInstancesWithExpiration
        {
            get;
            set;
        }

        /// <summary>``SpotFleetResource.SpotFleetRequestConfigDataProperty.Type``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-spotfleet-spotfleetrequestconfigdata.html#cfn-ec2-spotfleet-spotfleetrequestconfigdata-type </remarks>
        [JsiiProperty("type", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Type
        {
            get;
            set;
        }

        /// <summary>``SpotFleetResource.SpotFleetRequestConfigDataProperty.ValidFrom``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-spotfleet-spotfleetrequestconfigdata.html#cfn-ec2-spotfleet-spotfleetrequestconfigdata-validfrom </remarks>
        [JsiiProperty("validFrom", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ValidFrom
        {
            get;
            set;
        }

        /// <summary>``SpotFleetResource.SpotFleetRequestConfigDataProperty.ValidUntil``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-spotfleet-spotfleetrequestconfigdata.html#cfn-ec2-spotfleet-spotfleetrequestconfigdata-validuntil </remarks>
        [JsiiProperty("validUntil", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ValidUntil
        {
            get;
            set;
        }
    }
}