using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Logs.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-subscriptionfilter.html </remarks>
    [JsiiInterface(typeof(ISubscriptionFilterResourceProps), "@aws-cdk/aws-logs.cloudformation.SubscriptionFilterResourceProps")]
    public interface ISubscriptionFilterResourceProps
    {
        /// <summary>``AWS::Logs::SubscriptionFilter.DestinationArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-subscriptionfilter.html#cfn-cwl-subscriptionfilter-destinationarn </remarks>
        [JsiiProperty("destinationArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object DestinationArn
        {
            get;
            set;
        }

        /// <summary>``AWS::Logs::SubscriptionFilter.FilterPattern``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-subscriptionfilter.html#cfn-cwl-subscriptionfilter-filterpattern </remarks>
        [JsiiProperty("filterPattern", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object FilterPattern
        {
            get;
            set;
        }

        /// <summary>``AWS::Logs::SubscriptionFilter.LogGroupName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-subscriptionfilter.html#cfn-cwl-subscriptionfilter-loggroupname </remarks>
        [JsiiProperty("logGroupName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object LogGroupName
        {
            get;
            set;
        }

        /// <summary>``AWS::Logs::SubscriptionFilter.RoleArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-subscriptionfilter.html#cfn-cwl-subscriptionfilter-rolearn </remarks>
        [JsiiProperty("roleArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object RoleArn
        {
            get;
            set;
        }
    }
}