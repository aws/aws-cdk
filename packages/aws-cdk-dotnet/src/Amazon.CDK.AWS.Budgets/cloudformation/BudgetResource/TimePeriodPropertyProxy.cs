using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Budgets.cloudformation.BudgetResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-timeperiod.html </remarks>
    [JsiiInterfaceProxy(typeof(ITimePeriodProperty), "@aws-cdk/aws-budgets.cloudformation.BudgetResource.TimePeriodProperty")]
    internal class TimePeriodPropertyProxy : DeputyBase, ITimePeriodProperty
    {
        private TimePeriodPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``BudgetResource.TimePeriodProperty.End``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-timeperiod.html#cfn-budgets-budget-timeperiod-end </remarks>
        [JsiiProperty("end", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object End
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``BudgetResource.TimePeriodProperty.Start``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-timeperiod.html#cfn-budgets-budget-timeperiod-start </remarks>
        [JsiiProperty("start", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object Start
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}