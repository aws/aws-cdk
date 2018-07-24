using Amazon.CDK;
using Amazon.CDK.AWS.SNS;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.SNS.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sns-topic.html </remarks>
    [JsiiClass(typeof(TopicResource_), "@aws-cdk/aws-sns.cloudformation.TopicResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-sns.cloudformation.TopicResourceProps\",\"optional\":true}}]")]
    public class TopicResource_ : Resource
    {
        public TopicResource_(Construct parent, string name, ITopicResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected TopicResource_(ByRefValue reference): base(reference)
        {
        }

        protected TopicResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(TopicResource_));
        /// <remarks>cloudformation_attribute: TopicName</remarks>
        [JsiiProperty("topicName", "{\"fqn\":\"@aws-cdk/aws-sns.TopicName\"}")]
        public virtual TopicName TopicName
        {
            get => GetInstanceProperty<TopicName>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}