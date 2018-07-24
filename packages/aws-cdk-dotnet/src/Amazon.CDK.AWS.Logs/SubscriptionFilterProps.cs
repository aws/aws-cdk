using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Logs
{
    /// <summary>Properties for a SubscriptionFilter</summary>
    public class SubscriptionFilterProps : DeputyBase, ISubscriptionFilterProps
    {
        /// <summary>The log group to create the subscription on.</summary>
        [JsiiProperty("logGroup", "{\"fqn\":\"@aws-cdk/aws-logs.LogGroup\"}", true)]
        public LogGroup LogGroup
        {
            get;
            set;
        }

        /// <summary>
        /// The destination to send the filtered events to.
        /// 
        /// For example, a Kinesis stream or a Lambda function.
        /// </summary>
        [JsiiProperty("destination", "{\"fqn\":\"@aws-cdk/aws-logs.ILogSubscriptionDestination\"}", true)]
        public IILogSubscriptionDestination Destination
        {
            get;
            set;
        }

        /// <summary>Log events matching this pattern will be sent to the destination.</summary>
        [JsiiProperty("filterPattern", "{\"fqn\":\"@aws-cdk/aws-logs.IFilterPattern\"}", true)]
        public IIFilterPattern FilterPattern
        {
            get;
            set;
        }
    }
}