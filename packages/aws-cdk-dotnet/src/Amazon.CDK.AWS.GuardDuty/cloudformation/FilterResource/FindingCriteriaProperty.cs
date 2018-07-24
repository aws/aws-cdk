using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using Newtonsoft.Json.Linq;

namespace Amazon.CDK.AWS.GuardDuty.cloudformation.FilterResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-filter-findingcriteria.html </remarks>
    public class FindingCriteriaProperty : DeputyBase, IFindingCriteriaProperty
    {
        /// <summary>``FilterResource.FindingCriteriaProperty.Criterion``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-filter-findingcriteria.html#cfn-guardduty-filter-findingcriteria-criterion </remarks>
        [JsiiProperty("criterion", "{\"union\":{\"types\":[{\"primitive\":\"json\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Criterion
        {
            get;
            set;
        }

        /// <summary>``FilterResource.FindingCriteriaProperty.ItemType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-guardduty-filter-findingcriteria.html#cfn-guardduty-filter-findingcriteria-itemtype </remarks>
        [JsiiProperty("itemType", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-guardduty.cloudformation.FilterResource.ConditionProperty\"}]},\"optional\":true}", true)]
        public object ItemType
        {
            get;
            set;
        }
    }
}