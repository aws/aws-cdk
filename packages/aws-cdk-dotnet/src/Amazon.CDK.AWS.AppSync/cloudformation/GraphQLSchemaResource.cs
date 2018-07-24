using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.AppSync.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlschema.html </remarks>
    [JsiiClass(typeof(GraphQLSchemaResource), "@aws-cdk/aws-appsync.cloudformation.GraphQLSchemaResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-appsync.cloudformation.GraphQLSchemaResourceProps\"}}]")]
    public class GraphQLSchemaResource : Resource
    {
        public GraphQLSchemaResource(Construct parent, string name, IGraphQLSchemaResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected GraphQLSchemaResource(ByRefValue reference): base(reference)
        {
        }

        protected GraphQLSchemaResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(GraphQLSchemaResource));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}