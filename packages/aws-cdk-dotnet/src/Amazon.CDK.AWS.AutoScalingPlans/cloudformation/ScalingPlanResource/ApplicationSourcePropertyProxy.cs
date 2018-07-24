using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.AutoScalingPlans.cloudformation.ScalingPlanResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscalingplans-scalingplan-applicationsource.html </remarks>
    [JsiiInterfaceProxy(typeof(IApplicationSourceProperty), "@aws-cdk/aws-autoscalingplans.cloudformation.ScalingPlanResource.ApplicationSourceProperty")]
    internal class ApplicationSourcePropertyProxy : DeputyBase, IApplicationSourceProperty
    {
        private ApplicationSourcePropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``ScalingPlanResource.ApplicationSourceProperty.CloudFormationStackARN``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscalingplans-scalingplan-applicationsource.html#cfn-autoscalingplans-scalingplan-applicationsource-cloudformationstackarn </remarks>
        [JsiiProperty("cloudFormationStackArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object CloudFormationStackArn
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ScalingPlanResource.ApplicationSourceProperty.TagFilters``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-autoscalingplans-scalingplan-applicationsource.html#cfn-autoscalingplans-scalingplan-applicationsource-tagfilters </remarks>
        [JsiiProperty("tagFilters", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-autoscalingplans.cloudformation.ScalingPlanResource.TagFilterProperty\"}]}}}}]},\"optional\":true}")]
        public virtual object TagFilters
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}