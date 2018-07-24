using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.GuardDuty.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-threatintelset.html </remarks>
    [JsiiInterface(typeof(IThreatIntelSetResourceProps), "@aws-cdk/aws-guardduty.cloudformation.ThreatIntelSetResourceProps")]
    public interface IThreatIntelSetResourceProps
    {
        /// <summary>``AWS::GuardDuty::ThreatIntelSet.Activate``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-threatintelset.html#cfn-guardduty-threatintelset-activate </remarks>
        [JsiiProperty("activate", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Activate
        {
            get;
            set;
        }

        /// <summary>``AWS::GuardDuty::ThreatIntelSet.DetectorId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-threatintelset.html#cfn-guardduty-threatintelset-detectorid </remarks>
        [JsiiProperty("detectorId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object DetectorId
        {
            get;
            set;
        }

        /// <summary>``AWS::GuardDuty::ThreatIntelSet.Format``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-threatintelset.html#cfn-guardduty-threatintelset-format </remarks>
        [JsiiProperty("format", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Format
        {
            get;
            set;
        }

        /// <summary>``AWS::GuardDuty::ThreatIntelSet.Location``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-threatintelset.html#cfn-guardduty-threatintelset-location </remarks>
        [JsiiProperty("location", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Location
        {
            get;
            set;
        }

        /// <summary>``AWS::GuardDuty::ThreatIntelSet.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-threatintelset.html#cfn-guardduty-threatintelset-name </remarks>
        [JsiiProperty("threatIntelSetName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ThreatIntelSetName
        {
            get;
            set;
        }
    }
}