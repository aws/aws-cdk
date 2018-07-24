using Amazon.CDK;
using Amazon.CDK.AWS.AppSync.cloudformation.GraphQLApiResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.AppSync.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html </remarks>
    [JsiiInterfaceProxy(typeof(IGraphQLApiResourceProps), "@aws-cdk/aws-appsync.cloudformation.GraphQLApiResourceProps")]
    internal class GraphQLApiResourcePropsProxy : DeputyBase, IGraphQLApiResourceProps
    {
        private GraphQLApiResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::AppSync::GraphQLApi.AuthenticationType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html#cfn-appsync-graphqlapi-authenticationtype </remarks>
        [JsiiProperty("authenticationType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object AuthenticationType
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::AppSync::GraphQLApi.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html#cfn-appsync-graphqlapi-name </remarks>
        [JsiiProperty("graphQlApiName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object GraphQlApiName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::AppSync::GraphQLApi.LogConfig``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html#cfn-appsync-graphqlapi-logconfig </remarks>
        [JsiiProperty("logConfig", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-appsync.cloudformation.GraphQLApiResource.LogConfigProperty\"}]},\"optional\":true}")]
        public virtual object LogConfig
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::AppSync::GraphQLApi.OpenIDConnectConfig``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html#cfn-appsync-graphqlapi-openidconnectconfig </remarks>
        [JsiiProperty("openIdConnectConfig", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-appsync.cloudformation.GraphQLApiResource.OpenIDConnectConfigProperty\"}]},\"optional\":true}")]
        public virtual object OpenIdConnectConfig
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::AppSync::GraphQLApi.UserPoolConfig``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-appsync-graphqlapi.html#cfn-appsync-graphqlapi-userpoolconfig </remarks>
        [JsiiProperty("userPoolConfig", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-appsync.cloudformation.GraphQLApiResource.UserPoolConfigProperty\"}]},\"optional\":true}")]
        public virtual object UserPoolConfig
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}