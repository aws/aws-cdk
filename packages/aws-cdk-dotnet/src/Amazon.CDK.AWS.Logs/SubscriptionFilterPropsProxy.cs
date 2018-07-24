using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Logs
{
    /// <summary>Properties for a SubscriptionFilter</summary>
    [JsiiInterfaceProxy(typeof(ISubscriptionFilterProps), "@aws-cdk/aws-logs.SubscriptionFilterProps")]
    internal class SubscriptionFilterPropsProxy : DeputyBase, ISubscriptionFilterProps
    {
        private SubscriptionFilterPropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>The log group to create the subscription on.</summary>
        [JsiiProperty("logGroup", "{\"fqn\":\"@aws-cdk/aws-logs.LogGroup\"}")]
        public virtual LogGroup LogGroup
        {
            get => GetInstanceProperty<LogGroup>();
            set => SetInstanceProperty(value);
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