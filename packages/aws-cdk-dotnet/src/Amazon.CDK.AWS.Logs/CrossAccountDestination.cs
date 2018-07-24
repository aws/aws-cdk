using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Logs
{
    /// <summary>
    /// A new CloudWatch Logs Destination for use in cross-account scenarios
    /// 
    /// Log destinations can be used to subscribe a Kinesis stream in a different
    /// account to a CloudWatch Subscription. A Kinesis stream in the same account
    /// can be subscribed directly.
    /// 
    /// The @aws-cdk/aws-kinesis library takes care of this automatically; you shouldn't
    /// need to bother with this class.
    /// </summary>
    [JsiiClass(typeof(CrossAccountDestination), "@aws-cdk/aws-logs.CrossAccountDestination", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"id\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-logs.CrossAccountDestinationProps\"}}]")]
    public class CrossAccountDestination : Construct, IILogSubscriptionDestination
    {
        public CrossAccountDestination(Construct parent, string id, ICrossAccountDestinationProps props): base(new DeputyProps(new object[]{parent, id, props}))
        {
        }

        protected CrossAccountDestination(ByRefValue reference): base(reference)
        {
        }

        protected CrossAccountDestination(DeputyProps props): base(props)
        {
        }

        /// <summary>Policy object of this CrossAccountDestination object</summary>
        [JsiiProperty("policyDocument", "{\"fqn\":\"@aws-cdk/cdk.PolicyDocument\"}")]
        public virtual PolicyDocument PolicyDocument
        {
            get => GetInstanceProperty<PolicyDocument>();
        }

        /// <summary>The name of this CrossAccountDestination object</summary>
        [JsiiProperty("destinationName", "{\"fqn\":\"@aws-cdk/aws-logs.DestinationName\"}")]
        public virtual DestinationName DestinationName
        {
            get => GetInstanceProperty<DestinationName>();
        }

        /// <summary>The ARN of this CrossAccountDestination object</summary>
        [JsiiProperty("destinationArn", "{\"fqn\":\"@aws-cdk/aws-logs.DestinationArn\"}")]
        public virtual DestinationArn DestinationArn
        {
            get => GetInstanceProperty<DestinationArn>();
        }

        [JsiiMethod("addToPolicy", null, "[{\"name\":\"statement\",\"type\":{\"fqn\":\"@aws-cdk/cdk.PolicyStatement\"}}]")]
        public virtual void AddToPolicy(PolicyStatement statement)
        {
            InvokeInstanceVoidMethod(new object[]{statement});
        }

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
        [JsiiMethod("logSubscriptionDestination", "{\"fqn\":\"@aws-cdk/aws-logs.LogSubscriptionDestination\"}", "[{\"name\":\"_sourceLogGroup\",\"type\":{\"fqn\":\"@aws-cdk/aws-logs.LogGroup\"}}]")]
        public virtual ILogSubscriptionDestination LogSubscriptionDestination(LogGroup _sourceLogGroup)
        {
            return InvokeInstanceMethod<ILogSubscriptionDestination>(new object[]{_sourceLogGroup});
        }
    }
}