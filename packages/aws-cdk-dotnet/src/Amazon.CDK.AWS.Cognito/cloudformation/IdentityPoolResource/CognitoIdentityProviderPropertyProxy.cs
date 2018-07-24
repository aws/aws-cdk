using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Cognito.cloudformation.IdentityPoolResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypool-cognitoidentityprovider.html </remarks>
    [JsiiInterfaceProxy(typeof(ICognitoIdentityProviderProperty), "@aws-cdk/aws-cognito.cloudformation.IdentityPoolResource.CognitoIdentityProviderProperty")]
    internal class CognitoIdentityProviderPropertyProxy : DeputyBase, ICognitoIdentityProviderProperty
    {
        private CognitoIdentityProviderPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``IdentityPoolResource.CognitoIdentityProviderProperty.ClientId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypool-cognitoidentityprovider.html#cfn-cognito-identitypool-cognitoidentityprovider-clientid </remarks>
        [JsiiProperty("clientId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object ClientId
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``IdentityPoolResource.CognitoIdentityProviderProperty.ProviderName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypool-cognitoidentityprovider.html#cfn-cognito-identitypool-cognitoidentityprovider-providername </remarks>
        [JsiiProperty("providerName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object ProviderName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``IdentityPoolResource.CognitoIdentityProviderProperty.ServerSideTokenCheck``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypool-cognitoidentityprovider.html#cfn-cognito-identitypool-cognitoidentityprovider-serversidetokencheck </remarks>
        [JsiiProperty("serverSideTokenCheck", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object ServerSideTokenCheck
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}