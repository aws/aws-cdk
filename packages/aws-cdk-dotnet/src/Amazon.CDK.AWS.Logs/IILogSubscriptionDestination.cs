using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Logs
{
    /// <summary>Interface for classes that can be the destination of a log Subscription</summary>
    [JsiiInterface(typeof(IILogSubscriptionDestination), "@aws-cdk/aws-logs.ILogSubscriptionDestination")]
    public interface IILogSubscriptionDestination
    {
        /// <summary>
        /// Return the properties required to send subscription events to this destination.
        /// 
        /// If necessary, the destination can use the properties of the SubscriptionFilter
        /// object itself to configure its permissions to allow the subscription to write
        /// to it.
        /// 
        /// The destination may reconfigure its own permissions in response to this
        /// function call.
        /// </summary>
        [JsiiMethod("logSubscriptionDestination", "{\"fqn\":\"@aws-cdk/aws-logs.LogSubscriptionDestination\"}", "[{\"name\":\"sourceLogGroup\",\"type\":{\"fqn\":\"@aws-cdk/aws-logs.LogGroup\"}}]")]
        ILogSubscriptionDestination LogSubscriptionDestination(LogGroup sourceLogGroup);
    }
}