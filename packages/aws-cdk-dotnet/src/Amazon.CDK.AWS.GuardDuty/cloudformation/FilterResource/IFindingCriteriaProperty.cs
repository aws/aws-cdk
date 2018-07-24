using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using Newtonsoft.Json.Linq;

namespace Amazon.CDK.AWS.GuardDuty.cloudformation.FilterResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-filter-findingcriteria.html </remarks>
    [JsiiInterface(typeof(IFindingCriteriaProperty), "@aws-cdk/aws-guardduty.cloudformation.FilterResource.FindingCriteriaProperty")]
    public interface IFindingCriteriaProperty
    {
        /// <summary>``FilterResource.FindingCriteriaProperty.Criterion``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-filter-findingcriteria.html#cfn-guardduty-filter-findingcriteria-criterion </remarks>
        [JsiiProperty("criterion", "{\"union\":{\"types\":[{\"primitive\":\"json\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Criterion
        {
            get;
            set;
        }

        /// <summary>``FilterResource.FindingCriteriaProperty.ItemType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-filter-findingcriteria.html#cfn-guardduty-filter-findingcriteria-itemtype </remarks>
        [JsiiProperty("itemType", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-guardduty.cloudformation.FilterResource.ConditionProperty\"}]},\"optional\":true}")]
        object ItemType
        {
            get;
            set;
        }
    }
}