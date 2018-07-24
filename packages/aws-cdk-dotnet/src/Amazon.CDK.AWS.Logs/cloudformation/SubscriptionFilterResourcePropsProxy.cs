using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Logs.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-subscriptionfilter.html </remarks>
    [JsiiInterfaceProxy(typeof(ISubscriptionFilterResourceProps), "@aws-cdk/aws-logs.cloudformation.SubscriptionFilterResourceProps")]
    internal class SubscriptionFilterResourcePropsProxy : DeputyBase, ISubscriptionFilterResourceProps
    {
        private SubscriptionFilterResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::Logs::SubscriptionFilter.DestinationArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-subscriptionfilter.html#cfn-cwl-subscriptionfilter-destinationarn </remarks>
        [JsiiProperty("destinationArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object DestinationArn
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::Logs::SubscriptionFilter.FilterPattern``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-subscriptionfilter.html#cfn-cwl-subscriptionfilter-filterpattern </remarks>
        [JsiiProperty("filterPattern", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object FilterPattern
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::Logs::SubscriptionFilter.LogGroupName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-subscriptionfilter.html#cfn-cwl-subscriptionfilter-loggroupname </remarks>
        [JsiiProperty("logGroupName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object LogGroupName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::Logs::SubscriptionFilter.RoleArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-subscriptionfilter.html#cfn-cwl-subscriptionfilter-rolearn </remarks>
        [JsiiProperty("roleArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object RoleArn
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}