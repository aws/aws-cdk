using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.OpsWorks.cloudformation.LayerResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-loadbasedautoscaling.html </remarks>
    [JsiiInterface(typeof(ILoadBasedAutoScalingProperty), "@aws-cdk/aws-opsworks.cloudformation.LayerResource.LoadBasedAutoScalingProperty")]
    public interface ILoadBasedAutoScalingProperty
    {
        /// <summary>``LayerResource.LoadBasedAutoScalingProperty.DownScaling``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-loadbasedautoscaling.html#cfn-opsworks-layer-loadbasedautoscaling-downscaling </remarks>
        [JsiiProperty("downScaling", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-opsworks.cloudformation.LayerResource.AutoScalingThresholdsProperty\"}]},\"optional\":true}")]
        object DownScaling
        {
            get;
            set;
        }

        /// <summary>``LayerResource.LoadBasedAutoScalingProperty.Enable``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-loadbasedautoscaling.html#cfn-opsworks-layer-loadbasedautoscaling-enable </remarks>
        [JsiiProperty("enable", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Enable
        {
            get;
            set;
        }

        /// <summary>``LayerResource.LoadBasedAutoScalingProperty.UpScaling``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-loadbasedautoscaling.html#cfn-opsworks-layer-loadbasedautoscaling-upscaling </remarks>
        [JsiiProperty("upScaling", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-opsworks.cloudformation.LayerResource.AutoScalingThresholdsProperty\"}]},\"optional\":true}")]
        object UpScaling
        {
            get;
            set;
        }
    }
}