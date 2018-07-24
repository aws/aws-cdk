using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.SNS.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sns-policy.html </remarks>
    [JsiiClass(typeof(TopicPolicyResource), "@aws-cdk/aws-sns.cloudformation.TopicPolicyResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-sns.cloudformation.TopicPolicyResourceProps\"}}]")]
    public class TopicPolicyResource : Resource
    {
        public TopicPolicyResource(Construct parent, string name, ITopicPolicyResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected TopicPolicyResource(ByRefValue reference): base(reference)
        {
        }

        protected TopicPolicyResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(TopicPolicyResource));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}