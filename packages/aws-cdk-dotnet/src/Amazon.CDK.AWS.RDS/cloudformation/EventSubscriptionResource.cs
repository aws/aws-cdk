using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.RDS.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rds-eventsubscription.html </remarks>
    [JsiiClass(typeof(EventSubscriptionResource), "@aws-cdk/aws-rds.cloudformation.EventSubscriptionResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-rds.cloudformation.EventSubscriptionResourceProps\"}}]")]
    public class EventSubscriptionResource : Resource
    {
        public EventSubscriptionResource(Construct parent, string name, IEventSubscriptionResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected EventSubscriptionResource(ByRefValue reference): base(reference)
        {
        }

        protected EventSubscriptionResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(EventSubscriptionResource));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}