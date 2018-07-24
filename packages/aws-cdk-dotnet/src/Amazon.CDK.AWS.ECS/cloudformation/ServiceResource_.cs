using Amazon.CDK;
using Amazon.CDK.AWS.ECS;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.ECS.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-service.html </remarks>
    [JsiiClass(typeof(ServiceResource_), "@aws-cdk/aws-ecs.cloudformation.ServiceResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-ecs.cloudformation.ServiceResourceProps\"}}]")]
    public class ServiceResource_ : Resource
    {
        public ServiceResource_(Construct parent, string name, IServiceResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected ServiceResource_(ByRefValue reference): base(reference)
        {
        }

        protected ServiceResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(ServiceResource_));
        /// <remarks>cloudformation_attribute: Name</remarks>
        [JsiiProperty("serviceName", "{\"fqn\":\"@aws-cdk/aws-ecs.ServiceName\"}")]
        public virtual ServiceName ServiceName
        {
            get => GetInstanceProperty<ServiceName>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}