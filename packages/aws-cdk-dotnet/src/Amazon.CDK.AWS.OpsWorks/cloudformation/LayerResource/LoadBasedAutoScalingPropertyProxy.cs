using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.OpsWorks.cloudformation.LayerResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-loadbasedautoscaling.html </remarks>
    [JsiiInterfaceProxy(typeof(ILoadBasedAutoScalingProperty), "@aws-cdk/aws-opsworks.cloudformation.LayerResource.LoadBasedAutoScalingProperty")]
    internal class LoadBasedAutoScalingPropertyProxy : DeputyBase, ILoadBasedAutoScalingProperty
    {
        private LoadBasedAutoScalingPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``LayerResource.LoadBasedAutoScalingProperty.DownScaling``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-loadbasedautoscaling.html#cfn-opsworks-layer-loadbasedautoscaling-downscaling </remarks>
        [JsiiProperty("downScaling", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-opsworks.cloudformation.LayerResource.AutoScalingThresholdsProperty\"}]},\"optional\":true}")]
        public virtual object DownScaling
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``LayerResource.LoadBasedAutoScalingProperty.Enable``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-loadbasedautoscaling.html#cfn-opsworks-layer-loadbasedautoscaling-enable </remarks>
        [JsiiProperty("enable", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object Enable
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``LayerResource.LoadBasedAutoScalingProperty.UpScaling``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-loadbasedautoscaling.html#cfn-opsworks-layer-loadbasedautoscaling-upscaling </remarks>
        [JsiiProperty("upScaling", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-opsworks.cloudformation.LayerResource.AutoScalingThresholdsProperty\"}]},\"optional\":true}")]
        public virtual object UpScaling
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}