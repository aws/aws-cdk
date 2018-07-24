using Amazon.CDK;
using Amazon.CDK.AWS.GuardDuty.cloudformation.FilterResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.GuardDuty.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-filter.html </remarks>
    [JsiiInterface(typeof(IFilterResourceProps), "@aws-cdk/aws-guardduty.cloudformation.FilterResourceProps")]
    public interface IFilterResourceProps
    {
        /// <summary>``AWS::GuardDuty::Filter.Action``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-filter.html#cfn-guardduty-filter-action </remarks>
        [JsiiProperty("action", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Action
        {
            get;
            set;
        }

        /// <summary>``AWS::GuardDuty::Filter.Description``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-filter.html#cfn-guardduty-filter-description </remarks>
        [JsiiProperty("description", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Description
        {
            get;
            set;
        }

        /// <summary>``AWS::GuardDuty::Filter.DetectorId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-filter.html#cfn-guardduty-filter-detectorid </remarks>
        [JsiiProperty("detectorId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object DetectorId
        {
            get;
            set;
        }

        /// <summary>``AWS::GuardDuty::Filter.FindingCriteria``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-filter.html#cfn-guardduty-filter-findingcriteria </remarks>
        [JsiiProperty("findingCriteria", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-guardduty.cloudformation.FilterResource.FindingCriteriaProperty\"}]}}")]
        object FindingCriteria
        {
            get;
            set;
        }

        /// <summary>``AWS::GuardDuty::Filter.Rank``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-filter.html#cfn-guardduty-filter-rank </remarks>
        [JsiiProperty("rank", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Rank
        {
            get;
            set;
        }

        /// <summary>``AWS::GuardDuty::Filter.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-guardduty-filter.html#cfn-guardduty-filter-name </remarks>
        [JsiiProperty("filterName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object FilterName
        {
            get;
            set;
        }
    }
}