using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.APIGateway.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-basepathmapping.html </remarks>
    [JsiiClass(typeof(BasePathMappingResource), "@aws-cdk/aws-apigateway.cloudformation.BasePathMappingResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-apigateway.cloudformation.BasePathMappingResourceProps\"}}]")]
    public class BasePathMappingResource : Amazon.CDK.Resource
    {
        public BasePathMappingResource(Construct parent, string name, IBasePathMappingResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected BasePathMappingResource(ByRefValue reference): base(reference)
        {
        }

        protected BasePathMappingResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(BasePathMappingResource));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}