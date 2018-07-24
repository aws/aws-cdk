using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.Lambda.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-eventsourcemapping.html </remarks>
    [JsiiClass(typeof(EventSourceMappingResource), "@aws-cdk/aws-lambda.cloudformation.EventSourceMappingResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-lambda.cloudformation.EventSourceMappingResourceProps\"}}]")]
    public class EventSourceMappingResource : Resource
    {
        public EventSourceMappingResource(Construct parent, string name, IEventSourceMappingResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected EventSourceMappingResource(ByRefValue reference): base(reference)
        {
        }

        protected EventSourceMappingResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(EventSourceMappingResource));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}