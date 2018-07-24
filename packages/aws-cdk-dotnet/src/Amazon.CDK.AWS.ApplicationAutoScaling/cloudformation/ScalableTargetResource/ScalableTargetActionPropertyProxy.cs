using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ApplicationAutoScaling.cloudformation.ScalableTargetResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalabletarget-scalabletargetaction.html </remarks>
    [JsiiInterfaceProxy(typeof(IScalableTargetActionProperty), "@aws-cdk/aws-applicationautoscaling.cloudformation.ScalableTargetResource.ScalableTargetActionProperty")]
    internal class ScalableTargetActionPropertyProxy : DeputyBase, IScalableTargetActionProperty
    {
        private ScalableTargetActionPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``ScalableTargetResource.ScalableTargetActionProperty.MaxCapacity``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalabletarget-scalabletargetaction.html#cfn-applicationautoscaling-scalabletarget-scalabletargetaction-maxcapacity </remarks>
        [JsiiProperty("maxCapacity", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object MaxCapacity
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``ScalableTargetResource.ScalableTargetActionProperty.MinCapacity``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalabletarget-scalabletargetaction.html#cfn-applicationautoscaling-scalabletarget-scalabletargetaction-mincapacity </remarks>
        [JsiiProperty("minCapacity", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object MinCapacity
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}