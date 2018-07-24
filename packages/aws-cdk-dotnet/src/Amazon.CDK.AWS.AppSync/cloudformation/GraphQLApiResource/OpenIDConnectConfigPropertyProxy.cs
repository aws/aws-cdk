using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.AppSync.cloudformation.GraphQLApiResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-openidconnectconfig.html </remarks>
    [JsiiInterfaceProxy(typeof(IOpenIDConnectConfigProperty), "@aws-cdk/aws-appsync.cloudformation.GraphQLApiResource.OpenIDConnectConfigProperty")]
    internal class OpenIDConnectConfigPropertyProxy : DeputyBase, IOpenIDConnectConfigProperty
    {
        private OpenIDConnectConfigPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``GraphQLApiResource.OpenIDConnectConfigProperty.AuthTTL``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-openidconnectconfig.html#cfn-appsync-graphqlapi-openidconnectconfig-authttl </remarks>
        [JsiiProperty("authTtl", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object AuthTtl
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``GraphQLApiResource.OpenIDConnectConfigProperty.ClientId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-openidconnectconfig.html#cfn-appsync-graphqlapi-openidconnectconfig-clientid </remarks>
        [JsiiProperty("clientId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object ClientId
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``GraphQLApiResource.OpenIDConnectConfigProperty.IatTTL``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-openidconnectconfig.html#cfn-appsync-graphqlapi-openidconnectconfig-iatttl </remarks>
        [JsiiProperty("iatTtl", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object IatTtl
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``GraphQLApiResource.OpenIDConnectConfigProperty.Issuer``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-appsync-graphqlapi-openidconnectconfig.html#cfn-appsync-graphqlapi-openidconnectconfig-issuer </remarks>
        [JsiiProperty("issuer", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object Issuer
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}