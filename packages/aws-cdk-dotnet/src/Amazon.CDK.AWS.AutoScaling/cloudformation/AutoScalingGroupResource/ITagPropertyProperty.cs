using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.AutoScaling.cloudformation.AutoScalingGroupResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-tags.html </remarks>
    [JsiiInterface(typeof(ITagPropertyProperty), "@aws-cdk/aws-autoscaling.cloudformation.AutoScalingGroupResource.TagPropertyProperty")]
    public interface ITagPropertyProperty
    {
        /// <summary>``AutoScalingGroupResource.TagPropertyProperty.Key``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-tags.html#cfn-as-tags-Key </remarks>
        [JsiiProperty("key", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Key
        {
            get;
            set;
        }

        /// <summary>``AutoScalingGroupResource.TagPropertyProperty.PropagateAtLaunch``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-tags.html#cfn-as-tags-PropagateAtLaunch </remarks>
        [JsiiProperty("propagateAtLaunch", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object PropagateAtLaunch
        {
            get;
            set;
        }

        /// <summary>``AutoScalingGroupResource.TagPropertyProperty.Value``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-tags.html#cfn-as-tags-Value </remarks>
        [JsiiProperty("value", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Value
        {
            get;
            set;
        }
    }
}