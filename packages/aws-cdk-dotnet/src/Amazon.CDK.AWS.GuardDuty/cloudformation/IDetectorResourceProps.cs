using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.GuardDuty.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-detector.html </remarks>
    [JsiiInterface(typeof(IDetectorResourceProps), "@aws-cdk/aws-guardduty.cloudformation.DetectorResourceProps")]
    public interface IDetectorResourceProps
    {
        /// <summary>``AWS::GuardDuty::Detector.Enable``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-detector.html#cfn-guardduty-detector-enable </remarks>
        [JsiiProperty("enable", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Enable
        {
            get;
            set;
        }
    }
}