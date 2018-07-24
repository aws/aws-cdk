using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Logs
{
    /// <summary>A new CloudWatch Log Group</summary>
    [JsiiClass(typeof(LogGroup), "@aws-cdk/aws-logs.LogGroup", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"id\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-logs.LogGroupProps\",\"optional\":true}}]")]
    public class LogGroup : Construct
    {
        public LogGroup(Construct parent, string id, ILogGroupProps props): base(new DeputyProps(new object[]{parent, id, props}))
        {
        }

        protected LogGroup(ByRefValue reference): base(reference)
        {
        }

        protected LogGroup(DeputyProps props): base(props)
        {
        }

        /// <summary>The ARN of this log group</summary>
        [JsiiProperty("logGroupArn", "{\"fqn\":\"@aws-cdk/aws-logs.LogGroupArn\"}")]
        public virtual LogGroupArn LogGroupArn
        {
            get => GetInstanceProperty<LogGroupArn>();
        }

        /// <summary>The name of this log group</summary>
        [JsiiProperty("logGroupName", "{\"fqn\":\"@aws-cdk/aws-logs.LogGroupName\"}")]
        public virtual LogGroupName LogGroupName
        {
            get => GetInstanceProperty<LogGroupName>();
        }

        /// <summary>Create a new Log Stream for this Log Group</summary>
        /// <param name = "parent">Parent construct</param>
        /// <param name = "id">Unique identifier for the construct in its parent</param>
        /// <param name = "props">Properties for creating the LogStream</param>
        [JsiiMethod("newStream", "{\"fqn\":\"@aws-cdk/aws-logs.LogStream\"}", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"id\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-logs.NewLogStreamProps\",\"optional\":true}}]")]
        public virtual LogStream NewStream(Construct parent, string id, INewLogStreamProps props)
        {
            return InvokeInstanceMethod<LogStream>(new object[]{parent, id, props});
        }

        /// <summary>Create a new Subscription Filter on this Log Group</summary>
        /// <param name = "parent">Parent construct</param>
        /// <param name = "id">Unique identifier for the construct in its parent</param>
        /// <param name = "props">Properties for creating the SubscriptionFilter</param>
        [JsiiMethod("newSubscriptionFilter", "{\"fqn\":\"@aws-cdk/aws-logs.SubscriptionFilter\"}", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"id\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-logs.NewSubscriptionFilterProps\"}}]")]
        public virtual SubscriptionFilter NewSubscriptionFilter(Construct parent, string id, INewSubscriptionFilterProps props)
        {
            return InvokeInstanceMethod<SubscriptionFilter>(new object[]{parent, id, props});
        }

        /// <summary>Create a new Metric Filter on this Log Group</summary>
        /// <param name = "parent">Parent construct</param>
        /// <param name = "id">Unique identifier for the construct in its parent</param>
        /// <param name = "props">Properties for creating the MetricFilter</param>
        [JsiiMethod("newMetricFilter", "{\"fqn\":\"@aws-cdk/aws-logs.MetricFilter\"}", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"id\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-logs.NewMetricFilterProps\"}}]")]
        public virtual MetricFilter NewMetricFilter(Construct parent, string id, INewMetricFilterProps props)
        {
            return InvokeInstanceMethod<MetricFilter>(new object[]{parent, id, props});
        }
    }
}