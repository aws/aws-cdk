using Amazon.CDK;
using Amazon.CDK.AWS.Inspector;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.Inspector.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-resourcegroup.html </remarks>
    [JsiiClass(typeof(ResourceGroupResource), "@aws-cdk/aws-inspector.cloudformation.ResourceGroupResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-inspector.cloudformation.ResourceGroupResourceProps\"}}]")]
    public class ResourceGroupResource : Resource
    {
        public ResourceGroupResource(Construct parent, string name, IResourceGroupResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected ResourceGroupResource(ByRefValue reference): base(reference)
        {
        }

        protected ResourceGroupResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(ResourceGroupResource));
        /// <remarks>cloudformation_attribute: Arn</remarks>
        [JsiiProperty("resourceGroupArn", "{\"fqn\":\"@aws-cdk/aws-inspector.ResourceGroupArn\"}")]
        public virtual ResourceGroupArn ResourceGroupArn
        {
            get => GetInstanceProperty<ResourceGroupArn>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}