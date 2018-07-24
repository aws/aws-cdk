using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.GuardDuty.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-master.html </remarks>
    [JsiiInterface(typeof(IMasterResourceProps), "@aws-cdk/aws-guardduty.cloudformation.MasterResourceProps")]
    public interface IMasterResourceProps
    {
        /// <summary>``AWS::GuardDuty::Master.DetectorId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-master.html#cfn-guardduty-master-detectorid </remarks>
        [JsiiProperty("detectorId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object DetectorId
        {
            get;
            set;
        }

        /// <summary>``AWS::GuardDuty::Master.MasterId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-master.html#cfn-guardduty-master-masterid </remarks>
        [JsiiProperty("masterId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object MasterId
        {
            get;
            set;
        }

        /// <summary>``AWS::GuardDuty::Master.InvitationId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-master.html#cfn-guardduty-master-invitationid </remarks>
        [JsiiProperty("invitationId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object InvitationId
        {
            get;
            set;
        }
    }
}