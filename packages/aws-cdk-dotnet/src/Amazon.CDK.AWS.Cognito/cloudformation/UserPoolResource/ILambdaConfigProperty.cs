using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Cognito.cloudformation.UserPoolResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-lambdaconfig.html </remarks>
    [JsiiInterface(typeof(ILambdaConfigProperty), "@aws-cdk/aws-cognito.cloudformation.UserPoolResource.LambdaConfigProperty")]
    public interface ILambdaConfigProperty
    {
        /// <summary>``UserPoolResource.LambdaConfigProperty.CreateAuthChallenge``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-lambdaconfig.html#cfn-cognito-userpool-lambdaconfig-createauthchallenge </remarks>
        [JsiiProperty("createAuthChallenge", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object CreateAuthChallenge
        {
            get;
            set;
        }

        /// <summary>``UserPoolResource.LambdaConfigProperty.CustomMessage``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-lambdaconfig.html#cfn-cognito-userpool-lambdaconfig-custommessage </remarks>
        [JsiiProperty("customMessage", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object CustomMessage
        {
            get;
            set;
        }

        /// <summary>``UserPoolResource.LambdaConfigProperty.DefineAuthChallenge``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-lambdaconfig.html#cfn-cognito-userpool-lambdaconfig-defineauthchallenge </remarks>
        [JsiiProperty("defineAuthChallenge", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object DefineAuthChallenge
        {
            get;
            set;
        }

        /// <summary>``UserPoolResource.LambdaConfigProperty.PostAuthentication``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-lambdaconfig.html#cfn-cognito-userpool-lambdaconfig-postauthentication </remarks>
        [JsiiProperty("postAuthentication", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object PostAuthentication
        {
            get;
            set;
        }

        /// <summary>``UserPoolResource.LambdaConfigProperty.PostConfirmation``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-lambdaconfig.html#cfn-cognito-userpool-lambdaconfig-postconfirmation </remarks>
        [JsiiProperty("postConfirmation", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object PostConfirmation
        {
            get;
            set;
        }

        /// <summary>``UserPoolResource.LambdaConfigProperty.PreAuthentication``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-lambdaconfig.html#cfn-cognito-userpool-lambdaconfig-preauthentication </remarks>
        [JsiiProperty("preAuthentication", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object PreAuthentication
        {
            get;
            set;
        }

        /// <summary>``UserPoolResource.LambdaConfigProperty.PreSignUp``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-lambdaconfig.html#cfn-cognito-userpool-lambdaconfig-presignup </remarks>
        [JsiiProperty("preSignUp", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object PreSignUp
        {
            get;
            set;
        }

        /// <summary>``UserPoolResource.LambdaConfigProperty.VerifyAuthChallengeResponse``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-lambdaconfig.html#cfn-cognito-userpool-lambdaconfig-verifyauthchallengeresponse </remarks>
        [JsiiProperty("verifyAuthChallengeResponse", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object VerifyAuthChallengeResponse
        {
            get;
            set;
        }
    }
}