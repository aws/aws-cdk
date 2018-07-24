using Amazon.CDK;
using Amazon.CDK.AWS.IoT;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.IoT.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iot-topicrule.html </remarks>
    [JsiiClass(typeof(TopicRuleResource_), "@aws-cdk/aws-iot.cloudformation.TopicRuleResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-iot.cloudformation.TopicRuleResourceProps\"}}]")]
    public class TopicRuleResource_ : Resource
    {
        public TopicRuleResource_(Construct parent, string name, ITopicRuleResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected TopicRuleResource_(ByRefValue reference): base(reference)
        {
        }

        protected TopicRuleResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(TopicRuleResource_));
        /// <remarks>cloudformation_attribute: Arn</remarks>
        [JsiiProperty("topicRuleArn", "{\"fqn\":\"@aws-cdk/aws-iot.TopicRuleArn\"}")]
        public virtual TopicRuleArn TopicRuleArn
        {
            get => GetInstanceProperty<TopicRuleArn>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}