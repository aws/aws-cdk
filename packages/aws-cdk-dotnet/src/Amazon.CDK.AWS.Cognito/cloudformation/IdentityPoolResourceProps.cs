using Amazon.CDK;
using Amazon.CDK.AWS.Cognito.cloudformation.IdentityPoolResource;
using AWS.Jsii.Runtime.Deputy;
using Newtonsoft.Json.Linq;

namespace Amazon.CDK.AWS.Cognito.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html </remarks>
    public class IdentityPoolResourceProps : DeputyBase, IIdentityPoolResourceProps
    {
        /// <summary>``AWS::Cognito::IdentityPool.AllowUnauthenticatedIdentities``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html#cfn-cognito-identitypool-allowunauthenticatedidentities </remarks>
        [JsiiProperty("allowUnauthenticatedIdentities", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object AllowUnauthenticatedIdentities
        {
            get;
            set;
        }

        /// <summary>``AWS::Cognito::IdentityPool.CognitoEvents``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html#cfn-cognito-identitypool-cognitoevents </remarks>
        [JsiiProperty("cognitoEvents", "{\"union\":{\"types\":[{\"primitive\":\"json\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object CognitoEvents
        {
            get;
            set;
        }

        /// <summary>``AWS::Cognito::IdentityPool.CognitoIdentityProviders``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html#cfn-cognito-identitypool-cognitoidentityproviders </remarks>
        [JsiiProperty("cognitoIdentityProviders", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-cognito.cloudformation.IdentityPoolResource.CognitoIdentityProviderProperty\"}]}}}}]},\"optional\":true}", true)]
        public object CognitoIdentityProviders
        {
            get;
            set;
        }

        /// <summary>``AWS::Cognito::IdentityPool.CognitoStreams``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html#cfn-cognito-identitypool-cognitostreams </remarks>
        [JsiiProperty("cognitoStreams", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-cognito.cloudformation.IdentityPoolResource.CognitoStreamsProperty\"}]},\"optional\":true}", true)]
        public object CognitoStreams
        {
            get;
            set;
        }

        /// <summary>``AWS::Cognito::IdentityPool.DeveloperProviderName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html#cfn-cognito-identitypool-developerprovidername </remarks>
        [JsiiProperty("developerProviderName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object DeveloperProviderName
        {
            get;
            set;
        }

        /// <summary>``AWS::Cognito::IdentityPool.IdentityPoolName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html#cfn-cognito-identitypool-identitypoolname </remarks>
        [JsiiProperty("identityPoolName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object IdentityPoolName
        {
            get;
            set;
        }

        /// <summary>``AWS::Cognito::IdentityPool.OpenIdConnectProviderARNs``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html#cfn-cognito-identitypool-openidconnectproviderarns </remarks>
        [JsiiProperty("openIdConnectProviderArns", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}", true)]
        public object OpenIdConnectProviderArns
        {
            get;
            set;
        }

        /// <summary>``AWS::Cognito::IdentityPool.PushSync``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html#cfn-cognito-identitypool-pushsync </remarks>
        [JsiiProperty("pushSync", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-cognito.cloudformation.IdentityPoolResource.PushSyncProperty\"}]},\"optional\":true}", true)]
        public object PushSync
        {
            get;
            set;
        }

        /// <summary>``AWS::Cognito::IdentityPool.SamlProviderARNs``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html#cfn-cognito-identitypool-samlproviderarns </remarks>
        [JsiiProperty("samlProviderArns", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}", true)]
        public object SamlProviderArns
        {
            get;
            set;
        }

        /// <summary>``AWS::Cognito::IdentityPool.SupportedLoginProviders``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-identitypool.html#cfn-cognito-identitypool-supportedloginproviders </remarks>
        [JsiiProperty("supportedLoginProviders", "{\"union\":{\"types\":[{\"primitive\":\"json\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object SupportedLoginProviders
        {
            get;
            set;
        }
    }
}