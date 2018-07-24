using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SNS
{
    /// <summary>A new SNS topic</summary>
    [JsiiClass(typeof(Topic), "@aws-cdk/aws-sns.Topic", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-sns.TopicProps\",\"optional\":true}}]")]
    public class Topic : TopicRef
    {
        public Topic(Construct parent, string name, ITopicProps props): base(new DeputyProps(new object[]{parent, name, props}))
        {
        }

        protected Topic(ByRefValue reference): base(reference)
        {
        }

        protected Topic(DeputyProps props): base(props)
        {
        }

        [JsiiProperty("topicArn", "{\"fqn\":\"@aws-cdk/aws-sns.TopicArn\"}")]
        public override TopicArn TopicArn
        {
            get => GetInstanceProperty<TopicArn>();
        }

        [JsiiProperty("topicName", "{\"fqn\":\"@aws-cdk/aws-sns.TopicName\"}")]
        public override TopicName TopicName
        {
            get => GetInstanceProperty<TopicName>();
        }

        /// <summary>
        /// Controls automatic creation of policy objects.
        /// 
        /// Set by subclasses.
        /// </summary>
        [JsiiProperty("autoCreatePolicy", "{\"primitive\":\"boolean\"}")]
        protected override bool AutoCreatePolicy
        {
            get => GetInstanceProperty<bool>();
        }
    }
}