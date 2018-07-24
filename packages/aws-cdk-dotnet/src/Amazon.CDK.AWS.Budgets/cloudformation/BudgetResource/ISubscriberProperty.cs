using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Budgets.cloudformation.BudgetResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-subscriber.html </remarks>
    [JsiiInterface(typeof(ISubscriberProperty), "@aws-cdk/aws-budgets.cloudformation.BudgetResource.SubscriberProperty")]
    public interface ISubscriberProperty
    {
        /// <summary>``BudgetResource.SubscriberProperty.Address``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-subscriber.html#cfn-budgets-budget-subscriber-address </remarks>
        [JsiiProperty("address", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Address
        {
            get;
            set;
        }

        /// <summary>``BudgetResource.SubscriberProperty.SubscriptionType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-budgets-budget-subscriber.html#cfn-budgets-budget-subscriber-subscriptiontype </remarks>
        [JsiiProperty("subscriptionType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object SubscriptionType
        {
            get;
            set;
        }
    }
}