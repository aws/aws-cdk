using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Cognito.cloudformation.IdentityPoolResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypool-cognitostreams.html </remarks>
    [JsiiInterfaceProxy(typeof(ICognitoStreamsProperty), "@aws-cdk/aws-cognito.cloudformation.IdentityPoolResource.CognitoStreamsProperty")]
    internal class CognitoStreamsPropertyProxy : DeputyBase, ICognitoStreamsProperty
    {
        private CognitoStreamsPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``IdentityPoolResource.CognitoStreamsProperty.RoleArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypool-cognitostreams.html#cfn-cognito-identitypool-cognitostreams-rolearn </remarks>
        [JsiiProperty("roleArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object RoleArn
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``IdentityPoolResource.CognitoStreamsProperty.StreamName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypool-cognitostreams.html#cfn-cognito-identitypool-cognitostreams-streamname </remarks>
        [JsiiProperty("streamName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object StreamName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``IdentityPoolResource.CognitoStreamsProperty.StreamingStatus``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-identitypool-cognitostreams.html#cfn-cognito-identitypool-cognitostreams-streamingstatus </remarks>
        [JsiiProperty("streamingStatus", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object StreamingStatus
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}