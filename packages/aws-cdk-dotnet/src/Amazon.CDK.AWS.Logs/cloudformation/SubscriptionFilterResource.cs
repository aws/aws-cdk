using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.Logs.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-subscriptionfilter.html </remarks>
    [JsiiClass(typeof(SubscriptionFilterResource), "@aws-cdk/aws-logs.cloudformation.SubscriptionFilterResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-logs.cloudformation.SubscriptionFilterResourceProps\"}}]")]
    public class SubscriptionFilterResource : Resource
    {
        public SubscriptionFilterResource(Construct parent, string name, ISubscriptionFilterResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected SubscriptionFilterResource(ByRefValue reference): base(reference)
        {
        }

        protected SubscriptionFilterResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(SubscriptionFilterResource));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}