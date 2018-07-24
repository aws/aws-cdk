using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using Newtonsoft.Json.Linq;

namespace Amazon.CDK.AWS.Budgets.cloudformation.BudgetResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-budgetdata.html </remarks>
    public class BudgetDataProperty : DeputyBase, IBudgetDataProperty
    {
        /// <summary>``BudgetResource.BudgetDataProperty.BudgetLimit``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-budgetdata.html#cfn-budgets-budget-budgetdata-budgetlimit </remarks>
        [JsiiProperty("budgetLimit", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-budgets.cloudformation.BudgetResource.SpendProperty\"}]},\"optional\":true}", true)]
        public object BudgetLimit
        {
            get;
            set;
        }

        /// <summary>``BudgetResource.BudgetDataProperty.BudgetName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-budgetdata.html#cfn-budgets-budget-budgetdata-budgetname </remarks>
        [JsiiProperty("budgetName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object BudgetName
        {
            get;
            set;
        }

        /// <summary>``BudgetResource.BudgetDataProperty.BudgetType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-budgetdata.html#cfn-budgets-budget-budgetdata-budgettype </remarks>
        [JsiiProperty("budgetType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object BudgetType
        {
            get;
            set;
        }

        /// <summary>``BudgetResource.BudgetDataProperty.CostFilters``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-budgetdata.html#cfn-budgets-budget-budgetdata-costfilters </remarks>
        [JsiiProperty("costFilters", "{\"union\":{\"types\":[{\"primitive\":\"json\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object CostFilters
        {
            get;
            set;
        }

        /// <summary>``BudgetResource.BudgetDataProperty.CostTypes``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-budgetdata.html#cfn-budgets-budget-budgetdata-costtypes </remarks>
        [JsiiProperty("costTypes", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-budgets.cloudformation.BudgetResource.CostTypesProperty\"}]},\"optional\":true}", true)]
        public object CostTypes
        {
            get;
            set;
        }

        /// <summary>``BudgetResource.BudgetDataProperty.TimePeriod``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-budgetdata.html#cfn-budgets-budget-budgetdata-timeperiod </remarks>
        [JsiiProperty("timePeriod", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-budgets.cloudformation.BudgetResource.TimePeriodProperty\"}]},\"optional\":true}", true)]
        public object TimePeriod
        {
            get;
            set;
        }

        /// <summary>``BudgetResource.BudgetDataProperty.TimeUnit``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-budgetdata.html#cfn-budgets-budget-budgetdata-timeunit </remarks>
        [JsiiProperty("timeUnit", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object TimeUnit
        {
            get;
            set;
        }
    }
}