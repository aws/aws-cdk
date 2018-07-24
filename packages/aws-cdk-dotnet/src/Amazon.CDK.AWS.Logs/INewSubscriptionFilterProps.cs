using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Logs
{
    /// <summary>Properties for a new SubscriptionFilter created from a LogGroup</summary>
    [JsiiInterface(typeof(INewSubscriptionFilterProps), "@aws-cdk/aws-logs.NewSubscriptionFilterProps")]
    public interface INewSubscriptionFilterProps
    {
        /// <summary>
        /// The destination to send the filtered events to.
        /// 
        /// For example, a Kinesis stream or a Lambda function.
        /// </summary>
        [JsiiProperty("destination", "{\"fqn\":\"@aws-cdk/aws-logs.ILogSubscriptionDestination\"}")]
        IILogSubscriptionDestination Destination
        {
            get;
            set;
        }

        /// <summary>Log events matching this pattern will be sent to the destination.</summary>
        [JsiiProperty("filterPattern", "{\"fqn\":\"@aws-cdk/aws-logs.IFilterPattern\"}")]
        IIFilterPattern FilterPattern
        {
            get;
            set;
        }
    }
}