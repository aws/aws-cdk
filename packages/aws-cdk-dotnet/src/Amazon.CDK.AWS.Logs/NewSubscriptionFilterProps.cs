using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Logs
{
    /// <summary>Properties for a new SubscriptionFilter created from a LogGroup</summary>
    public class NewSubscriptionFilterProps : DeputyBase, INewSubscriptionFilterProps
    {
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