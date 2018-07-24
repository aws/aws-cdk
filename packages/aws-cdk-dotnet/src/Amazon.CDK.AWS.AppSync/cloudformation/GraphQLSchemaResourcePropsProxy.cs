using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.AppSync.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlschema.html </remarks>
    [JsiiInterfaceProxy(typeof(IGraphQLSchemaResourceProps), "@aws-cdk/aws-appsync.cloudformation.GraphQLSchemaResourceProps")]
    internal class GraphQLSchemaResourcePropsProxy : DeputyBase, IGraphQLSchemaResourceProps
    {
        private GraphQLSchemaResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::AppSync::GraphQLSchema.ApiId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlschema.html#cfn-appsync-graphqlschema-apiid </remarks>
        [JsiiProperty("apiId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object ApiId
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::AppSync::GraphQLSchema.Definition``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlschema.html#cfn-appsync-graphqlschema-definition </remarks>
        [JsiiProperty("definition", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object Definition
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::AppSync::GraphQLSchema.DefinitionS3Location``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlschema.html#cfn-appsync-graphqlschema-definitions3location </remarks>
        [JsiiProperty("definitionS3Location", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object DefinitionS3Location
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}