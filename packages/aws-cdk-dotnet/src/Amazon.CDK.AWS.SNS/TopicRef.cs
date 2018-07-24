using Amazon.CDK;
using Amazon.CDK.AWS.CloudWatch;
using Amazon.CDK.AWS.Events;
using Amazon.CDK.AWS.IAM;
using Amazon.CDK.AWS.Lambda;
using Amazon.CDK.AWS.SQS;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SNS
{
    /// <summary>Either a new or imported Topic</summary>
    [JsiiClass(typeof(TopicRef), "@aws-cdk/aws-sns.TopicRef", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}}]")]
    public abstract class TopicRef : Construct, IIEventRuleTargetProps, IIAlarmAction
    {
        protected TopicRef(Construct parent, string name): base(new DeputyProps(new object[]{parent, name}))
        {
        }

        protected TopicRef(ByRefValue reference): base(reference)
        {
        }

        protected TopicRef(DeputyProps props): base(props)
        {
        }

        [JsiiProperty("topicArn", "{\"fqn\":\"@aws-cdk/aws-sns.TopicArn\"}")]
        public virtual TopicArn TopicArn
        {
            get => GetInstanceProperty<TopicArn>();
        }

        [JsiiProperty("topicName", "{\"fqn\":\"@aws-cdk/aws-sns.TopicName\"}")]
        public virtual TopicName TopicName
        {
            get => GetInstanceProperty<TopicName>();
        }

        /// <summary>
        /// Controls automatic creation of policy objects.
        /// 
        /// Set by subclasses.
        /// </summary>
        [JsiiProperty("autoCreatePolicy", "{\"primitive\":\"boolean\"}")]
        protected virtual bool AutoCreatePolicy
        {
            get => GetInstanceProperty<bool>();
        }

        /// <summary>
        /// Returns a RuleTarget that can be used to trigger this SNS topic as a
        /// result from a CloudWatch event.
        /// </summary>
        [JsiiProperty("eventRuleTarget", "{\"fqn\":\"@aws-cdk/aws-events.EventRuleTarget\"}")]
        public virtual IEventRuleTarget EventRuleTarget
        {
            get => GetInstanceProperty<IEventRuleTarget>();
        }

        /// <summary>Return the ARN that should be used for a CloudWatch Alarm action</summary>
        [JsiiProperty("alarmActionArn", "{\"fqn\":\"@aws-cdk/cdk.Arn\"}")]
        public virtual Arn AlarmActionArn
        {
            get => GetInstanceProperty<Arn>();
        }

        /// <summary>Import a Topic defined elsewhere</summary>
        [JsiiMethod("import", "{\"fqn\":\"@aws-cdk/aws-sns.TopicRef\"}", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-sns.TopicRefProps\"}}]")]
        public static TopicRef Import(Construct parent, string name, ITopicRefProps props)
        {
            return InvokeStaticMethod<TopicRef>(typeof(TopicRef), new object[]{parent, name, props});
        }

        /// <summary>Export this Topic</summary>
        [JsiiMethod("export", "{\"fqn\":\"@aws-cdk/aws-sns.TopicRefProps\"}", "[]")]
        public virtual ITopicRefProps Export()
        {
            return InvokeInstanceMethod<ITopicRefProps>(new object[]{});
        }

        /// <summary>Subscribe some endpoint to this topic</summary>
        [JsiiMethod("subscribe", null, "[{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"endpoint\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"protocol\",\"type\":{\"fqn\":\"@aws-cdk/aws-sns.SubscriptionProtocol\"}}]")]
        public virtual void Subscribe(string name, string endpoint, SubscriptionProtocol protocol)
        {
            InvokeInstanceVoidMethod(new object[]{name, endpoint, protocol});
        }

        /// <summary>
        /// Defines a subscription from this SNS topic to an SQS queue.
        /// 
        /// The queue resource policy will be updated to allow this SNS topic to send
        /// messages to the queue.
        /// 
        /// TODO: change to QueueRef.
        /// </summary>
        /// <param name = "queue">The target queue</param>
        [JsiiMethod("subscribeQueue", "{\"fqn\":\"@aws-cdk/aws-sns.Subscription\"}", "[{\"name\":\"queue\",\"type\":{\"fqn\":\"@aws-cdk/aws-sqs.QueueRef\"}}]")]
        public virtual Subscription SubscribeQueue(QueueRef queue)
        {
            return InvokeInstanceMethod<Subscription>(new object[]{queue});
        }

        /// <summary>
        /// Defines a subscription from this SNS Topic to a Lambda function.
        /// 
        /// The Lambda's resource policy will be updated to allow this topic to
        /// invoke the function.
        /// </summary>
        /// <param name = "lambdaFunction">The Lambda function to invoke</param>
        [JsiiMethod("subscribeLambda", "{\"fqn\":\"@aws-cdk/aws-sns.Subscription\"}", "[{\"name\":\"lambdaFunction\",\"type\":{\"fqn\":\"@aws-cdk/aws-lambda.LambdaRef\"}}]")]
        public virtual Subscription SubscribeLambda(LambdaRef lambdaFunction)
        {
            return InvokeInstanceMethod<Subscription>(new object[]{lambdaFunction});
        }

        /// <summary>Defines a subscription from this SNS topic to an email address.</summary>
        /// <param name = "name">A name for the subscription</param>
        /// <param name = "emailAddress">The email address to use.</param>
        [JsiiMethod("subscribeEmail", "{\"fqn\":\"@aws-cdk/aws-sns.Subscription\"}", "[{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"emailAddress\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"options\",\"type\":{\"fqn\":\"@aws-cdk/aws-sns.EmailSubscriptionOptions\",\"optional\":true}}]")]
        public virtual Subscription SubscribeEmail(string name, string emailAddress, IEmailSubscriptionOptions options)
        {
            return InvokeInstanceMethod<Subscription>(new object[]{name, emailAddress, options});
        }

        /// <summary>Defines a subscription from this SNS topic to an http:// or https:// URL.</summary>
        /// <param name = "name">A name for the subscription</param>
        /// <param name = "url">The URL to invoke</param>
        [JsiiMethod("subscribeUrl", "{\"fqn\":\"@aws-cdk/aws-sns.Subscription\"}", "[{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"url\",\"type\":{\"primitive\":\"string\"}}]")]
        public virtual Subscription SubscribeUrl(string name, string url)
        {
            return InvokeInstanceMethod<Subscription>(new object[]{name, url});
        }

        /// <summary>
        /// Adds a statement to the IAM resource policy associated with this topic.
        /// 
        /// If this topic was created in this stack (`new Topic`), a topic policy
        /// will be automatically created upon the first call to `addToPolicy`. If
        /// the topic is improted (`Topic.import`), then this is a no-op.
        /// </summary>
        [JsiiMethod("addToResourcePolicy", null, "[{\"name\":\"statement\",\"type\":{\"fqn\":\"@aws-cdk/cdk.PolicyStatement\"}}]")]
        public virtual void AddToResourcePolicy(PolicyStatement statement)
        {
            InvokeInstanceVoidMethod(new object[]{statement});
        }

        /// <summary>Grant topic publishing permissions to the given identity</summary>
        [JsiiMethod("grantPublish", null, "[{\"name\":\"identity\",\"type\":{\"fqn\":\"@aws-cdk/aws-iam.IIdentityResource\",\"optional\":true}}]")]
        public virtual void GrantPublish(IIIdentityResource identity)
        {
            InvokeInstanceVoidMethod(new object[]{identity});
        }

        /// <summary>Construct a Metric object for the current topic for the given metric</summary>
        [JsiiMethod("metric", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.Metric\"}", "[{\"name\":\"metricName\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.MetricCustomization\",\"optional\":true}}]")]
        public virtual Metric Metric(string metricName, IMetricCustomization props)
        {
            return InvokeInstanceMethod<Metric>(new object[]{metricName, props});
        }

        /// <summary>Metric for the size of messages published through this topic</summary>
        /// <remarks>default: average over 5 minutes</remarks>
        [JsiiMethod("metricPublishSize", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.Metric\"}", "[{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.MetricCustomization\",\"optional\":true}}]")]
        public virtual Metric MetricPublishSize(IMetricCustomization props)
        {
            return InvokeInstanceMethod<Metric>(new object[]{props});
        }

        /// <summary>Metric for the number of messages published through this topic</summary>
        /// <remarks>default: sum over 5 minutes</remarks>
        [JsiiMethod("metricNumberOfMessagesPublished", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.Metric\"}", "[{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.MetricCustomization\",\"optional\":true}}]")]
        public virtual Metric MetricNumberOfMessagesPublished(IMetricCustomization props)
        {
            return InvokeInstanceMethod<Metric>(new object[]{props});
        }

        /// <summary>Metric for the number of messages that failed to publish through this topic</summary>
        /// <remarks>default: sum over 5 minutes</remarks>
        [JsiiMethod("metricNumberOfMessagesFailed", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.Metric\"}", "[{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.MetricCustomization\",\"optional\":true}}]")]
        public virtual Metric MetricNumberOfMessagesFailed(IMetricCustomization props)
        {
            return InvokeInstanceMethod<Metric>(new object[]{props});
        }

        /// <summary>Metric for the number of messages that were successfully delivered through this topic</summary>
        /// <remarks>default: sum over 5 minutes</remarks>
        [JsiiMethod("metricNumberOfMessagesDelivered", "{\"fqn\":\"@aws-cdk/aws-cloudwatch.Metric\"}", "[{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-cloudwatch.MetricCustomization\",\"optional\":true}}]")]
        public virtual Metric MetricNumberOfMessagesDelivered(IMetricCustomization props)
        {
            return InvokeInstanceMethod<Metric>(new object[]{props});
        }
    }
}