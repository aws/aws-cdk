using Amazon.CDK;
using Amazon.CDK.AWS.DMS;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.DMS.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-endpoint.html </remarks>
    [JsiiClass(typeof(EndpointResource_), "@aws-cdk/aws-dms.cloudformation.EndpointResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-dms.cloudformation.EndpointResourceProps\"}}]")]
    public class EndpointResource_ : Resource
    {
        public EndpointResource_(Construct parent, string name, IEndpointResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected EndpointResource_(ByRefValue reference): base(reference)
        {
        }

        protected EndpointResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(EndpointResource_));
        /// <remarks>cloudformation_attribute: ExternalId</remarks>
        [JsiiProperty("endpointExternalId", "{\"fqn\":\"@aws-cdk/aws-dms.EndpointExternalId\"}")]
        public virtual EndpointExternalId EndpointExternalId
        {
            get => GetInstanceProperty<EndpointExternalId>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}