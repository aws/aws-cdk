using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Budgets.cloudformation.BudgetResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-notificationwithsubscribers.html </remarks>
    [JsiiInterfaceProxy(typeof(INotificationWithSubscribersProperty), "@aws-cdk/aws-budgets.cloudformation.BudgetResource.NotificationWithSubscribersProperty")]
    internal class NotificationWithSubscribersPropertyProxy : DeputyBase, INotificationWithSubscribersProperty
    {
        private NotificationWithSubscribersPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``BudgetResource.NotificationWithSubscribersProperty.Notification``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-notificationwithsubscribers.html#cfn-budgets-budget-notificationwithsubscribers-notification </remarks>
        [JsiiProperty("notification", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-budgets.cloudformation.BudgetResource.NotificationProperty\"}]}}")]
        public virtual object Notification
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``BudgetResource.NotificationWithSubscribersProperty.Subscribers``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-notificationwithsubscribers.html#cfn-budgets-budget-notificationwithsubscribers-subscribers </remarks>
        [JsiiProperty("subscribers", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-budgets.cloudformation.BudgetResource.SubscriberProperty\"}]}}}}]}}")]
        public virtual object Subscribers
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}