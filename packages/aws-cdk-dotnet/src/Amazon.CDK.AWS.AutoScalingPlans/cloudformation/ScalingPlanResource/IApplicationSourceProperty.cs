using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.AutoScalingPlans.cloudformation.ScalingPlanResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscalingplans-scalingplan-applicationsource.html </remarks>
    [JsiiInterface(typeof(IApplicationSourceProperty), "@aws-cdk/aws-autoscalingplans.cloudformation.ScalingPlanResource.ApplicationSourceProperty")]
    public interface IApplicationSourceProperty
    {
        /// <summary>``ScalingPlanResource.ApplicationSourceProperty.CloudFormationStackARN``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscalingplans-scalingplan-applicationsource.html#cfn-autoscalingplans-scalingplan-applicationsource-cloudformationstackarn </remarks>
        [JsiiProperty("cloudFormationStackArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object CloudFormationStackArn
        {
            get;
            set;
        }

        /// <summary>``ScalingPlanResource.ApplicationSourceProperty.TagFilters``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscalingplans-scalingplan-applicationsource.html#cfn-autoscalingplans-scalingplan-applicationsource-tagfilters </remarks>
        [JsiiProperty("tagFilters", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-autoscalingplans.cloudformation.ScalingPlanResource.TagFilterProperty\"}]}}}}]},\"optional\":true}")]
        object TagFilters
        {
            get;
            set;
        }
    }
}