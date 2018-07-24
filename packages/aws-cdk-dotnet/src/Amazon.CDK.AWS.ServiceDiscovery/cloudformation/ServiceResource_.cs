using Amazon.CDK;
using Amazon.CDK.AWS.ServiceDiscovery;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.ServiceDiscovery.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicediscovery-service.html </remarks>
    [JsiiClass(typeof(ServiceResource_), "@aws-cdk/aws-servicediscovery.cloudformation.ServiceResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-servicediscovery.cloudformation.ServiceResourceProps\"}}]")]
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
        /// <remarks>cloudformation_attribute: Arn</remarks>
        [JsiiProperty("serviceArn", "{\"fqn\":\"@aws-cdk/aws-servicediscovery.ServiceArn\"}")]
        public virtual ServiceArn ServiceArn
        {
            get => GetInstanceProperty<ServiceArn>();
        }

        /// <remarks>cloudformation_attribute: Id</remarks>
        [JsiiProperty("serviceId", "{\"fqn\":\"@aws-cdk/aws-servicediscovery.ServiceId\"}")]
        public virtual ServiceId ServiceId
        {
            get => GetInstanceProperty<ServiceId>();
        }

        /// <remarks>cloudformation_attribute: Name</remarks>
        [JsiiProperty("serviceName", "{\"fqn\":\"@aws-cdk/aws-servicediscovery.ServiceName\"}")]
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