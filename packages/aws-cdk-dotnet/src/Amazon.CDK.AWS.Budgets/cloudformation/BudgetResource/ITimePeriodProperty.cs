using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Budgets.cloudformation.BudgetResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-timeperiod.html </remarks>
    [JsiiInterface(typeof(ITimePeriodProperty), "@aws-cdk/aws-budgets.cloudformation.BudgetResource.TimePeriodProperty")]
    public interface ITimePeriodProperty
    {
        /// <summary>``BudgetResource.TimePeriodProperty.End``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-timeperiod.html#cfn-budgets-budget-timeperiod-end </remarks>
        [JsiiProperty("end", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object End
        {
            get;
            set;
        }

        /// <summary>``BudgetResource.TimePeriodProperty.Start``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-timeperiod.html#cfn-budgets-budget-timeperiod-start </remarks>
        [JsiiProperty("start", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Start
        {
            get;
            set;
        }
    }
}