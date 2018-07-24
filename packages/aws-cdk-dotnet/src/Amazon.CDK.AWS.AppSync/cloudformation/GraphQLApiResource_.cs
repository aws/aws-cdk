using Amazon.CDK;
using Amazon.CDK.AWS.AppSync;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.AppSync.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html </remarks>
    [JsiiClass(typeof(GraphQLApiResource_), "@aws-cdk/aws-appsync.cloudformation.GraphQLApiResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-appsync.cloudformation.GraphQLApiResourceProps\"}}]")]
    public class GraphQLApiResource_ : Resource
    {
        public GraphQLApiResource_(Construct parent, string name, IGraphQLApiResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected GraphQLApiResource_(ByRefValue reference): base(reference)
        {
        }

        protected GraphQLApiResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(GraphQLApiResource_));
        /// <remarks>cloudformation_attribute: ApiId</remarks>
        [JsiiProperty("graphQlApiApiId", "{\"fqn\":\"@aws-cdk/aws-appsync.GraphQLApiApiId\"}")]
        public virtual GraphQLApiApiId GraphQlApiApiId
        {
            get => GetInstanceProperty<GraphQLApiApiId>();
        }

        /// <remarks>cloudformation_attribute: Arn</remarks>
        [JsiiProperty("graphQlApiArn", "{\"fqn\":\"@aws-cdk/aws-appsync.GraphQLApiArn\"}")]
        public virtual GraphQLApiArn GraphQlApiArn
        {
            get => GetInstanceProperty<GraphQLApiArn>();
        }

        /// <remarks>cloudformation_attribute: GraphQLUrl</remarks>
        [JsiiProperty("graphQlApiGraphQlUrl", "{\"fqn\":\"@aws-cdk/aws-appsync.GraphQLApiGraphQlUrl\"}")]
        public virtual GraphQLApiGraphQlUrl GraphQlApiGraphQlUrl
        {
            get => GetInstanceProperty<GraphQLApiGraphQlUrl>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}