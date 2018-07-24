using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Logs
{
    /// <summary>Properties for a new SubscriptionFilter created from a LogGroup</summary>
    [JsiiInterfaceProxy(typeof(INewSubscriptionFilterProps), "@aws-cdk/aws-logs.NewSubscriptionFilterProps")]
    internal class NewSubscriptionFilterPropsProxy : DeputyBase, INewSubscriptionFilterProps
    {
        private NewSubscriptionFilterPropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>
        /// The destination to send the filtered events to.
        /// 
        /// For example, a Kinesis stream or a Lambda function.
        /// </summary>
        [JsiiProperty("destination", "{\"fqn\":\"@aws-cdk/aws-logs.ILogSubscriptionDestination\"}")]
        public virtual IILogSubscriptionDestination Destination
        {
            get => GetInstanceProperty<IILogSubscriptionDestination>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Log events matching this pattern will be sent to the destination.</summary>
        [JsiiProperty("filterPattern", "{\"fqn\":\"@aws-cdk/aws-logs.IFilterPattern\"}")]
        public virtual IIFilterPattern FilterPattern
        {
            get => GetInstanceProperty<IIFilterPattern>();
            set => SetInstanceProperty(value);
        }
    }
}