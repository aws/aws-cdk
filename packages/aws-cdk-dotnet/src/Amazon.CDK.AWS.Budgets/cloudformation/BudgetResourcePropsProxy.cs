using Amazon.CDK;
using Amazon.CDK.AWS.Budgets.cloudformation.BudgetResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Budgets.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-budgets-budget.html </remarks>
    [JsiiInterfaceProxy(typeof(IBudgetResourceProps), "@aws-cdk/aws-budgets.cloudformation.BudgetResourceProps")]
    internal class BudgetResourcePropsProxy : DeputyBase, IBudgetResourceProps
    {
        private BudgetResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::Budgets::Budget.Budget``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-budgets-budget.html#cfn-budgets-budget-budget </remarks>
        [JsiiProperty("budget", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/aws-budgets.cloudformation.BudgetResource.BudgetDataProperty\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Budget
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::Budgets::Budget.NotificationsWithSubscribers``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-budgets-budget.html#cfn-budgets-budget-notificationswithsubscribers </remarks>
        [JsiiProperty("notificationsWithSubscribers", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-budgets.cloudformation.BudgetResource.NotificationWithSubscribersProperty\"}]}}}}]},\"optional\":true}")]
        public virtual object NotificationsWithSubscribers
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}