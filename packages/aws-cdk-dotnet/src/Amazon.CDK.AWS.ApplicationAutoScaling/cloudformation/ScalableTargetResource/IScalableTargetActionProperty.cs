using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ApplicationAutoScaling.cloudformation.ScalableTargetResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalabletarget-scalabletargetaction.html </remarks>
    [JsiiInterface(typeof(IScalableTargetActionProperty), "@aws-cdk/aws-applicationautoscaling.cloudformation.ScalableTargetResource.ScalableTargetActionProperty")]
    public interface IScalableTargetActionProperty
    {
        /// <summary>``ScalableTargetResource.ScalableTargetActionProperty.MaxCapacity``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalabletarget-scalabletargetaction.html#cfn-applicationautoscaling-scalabletarget-scalabletargetaction-maxcapacity </remarks>
        [JsiiProperty("maxCapacity", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object MaxCapacity
        {
            get;
            set;
        }

        /// <summary>``ScalableTargetResource.ScalableTargetActionProperty.MinCapacity``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-applicationautoscaling-scalabletarget-scalabletargetaction.html#cfn-applicationautoscaling-scalabletarget-scalabletargetaction-mincapacity </remarks>
        [JsiiProperty("minCapacity", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object MinCapacity
        {
            get;
            set;
        }
    }
}