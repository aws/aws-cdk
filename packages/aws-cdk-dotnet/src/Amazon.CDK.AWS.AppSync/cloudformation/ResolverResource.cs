using Amazon.CDK;
using Amazon.CDK.AWS.AppSync;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.AppSync.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-resolver.html </remarks>
    [JsiiClass(typeof(ResolverResource), "@aws-cdk/aws-appsync.cloudformation.ResolverResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-appsync.cloudformation.ResolverResourceProps\"}}]")]
    public class ResolverResource : Resource
    {
        public ResolverResource(Construct parent, string name, IResolverResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected ResolverResource(ByRefValue reference): base(reference)
        {
        }

        protected ResolverResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(ResolverResource));
        /// <remarks>cloudformation_attribute: FieldName</remarks>
        [JsiiProperty("resolverFieldName", "{\"fqn\":\"@aws-cdk/aws-appsync.ResolverFieldName\"}")]
        public virtual ResolverFieldName ResolverFieldName
        {
            get => GetInstanceProperty<ResolverFieldName>();
        }

        /// <remarks>cloudformation_attribute: ResolverArn</remarks>
        [JsiiProperty("resolverArn", "{\"fqn\":\"@aws-cdk/aws-appsync.ResolverArn\"}")]
        public virtual ResolverArn ResolverArn
        {
            get => GetInstanceProperty<ResolverArn>();
        }

        /// <remarks>cloudformation_attribute: TypeName</remarks>
        [JsiiProperty("resolverTypeName", "{\"fqn\":\"@aws-cdk/aws-appsync.ResolverTypeName\"}")]
        public virtual ResolverTypeName ResolverTypeName
        {
            get => GetInstanceProperty<ResolverTypeName>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}