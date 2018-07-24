using Amazon.CDK;
using Amazon.CDK.AWS.Cognito.cloudformation.UserPoolUserResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Cognito.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluser.html </remarks>
    [JsiiInterface(typeof(IUserPoolUserResourceProps), "@aws-cdk/aws-cognito.cloudformation.UserPoolUserResourceProps")]
    public interface IUserPoolUserResourceProps
    {
        /// <summary>``AWS::Cognito::UserPoolUser.UserPoolId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluser.html#cfn-cognito-userpooluser-userpoolid </remarks>
        [JsiiProperty("userPoolId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object UserPoolId
        {
            get;
            set;
        }

        /// <summary>``AWS::Cognito::UserPoolUser.DesiredDeliveryMediums``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluser.html#cfn-cognito-userpooluser-desireddeliverymediums </remarks>
        [JsiiProperty("desiredDeliveryMediums", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object DesiredDeliveryMediums
        {
            get;
            set;
        }

        /// <summary>``AWS::Cognito::UserPoolUser.ForceAliasCreation``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluser.html#cfn-cognito-userpooluser-forcealiascreation </remarks>
        [JsiiProperty("forceAliasCreation", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ForceAliasCreation
        {
            get;
            set;
        }

        /// <summary>``AWS::Cognito::UserPoolUser.MessageAction``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluser.html#cfn-cognito-userpooluser-messageaction </remarks>
        [JsiiProperty("messageAction", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object MessageAction
        {
            get;
            set;
        }

        /// <summary>``AWS::Cognito::UserPoolUser.UserAttributes``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluser.html#cfn-cognito-userpooluser-userattributes </remarks>
        [JsiiProperty("userAttributes", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-cognito.cloudformation.UserPoolUserResource.AttributeTypeProperty\"}]}}}}]},\"optional\":true}")]
        object UserAttributes
        {
            get;
            set;
        }

        /// <summary>``AWS::Cognito::UserPoolUser.Username``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluser.html#cfn-cognito-userpooluser-username </remarks>
        [JsiiProperty("username", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Username
        {
            get;
            set;
        }

        /// <summary>``AWS::Cognito::UserPoolUser.ValidationData``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpooluser.html#cfn-cognito-userpooluser-validationdata </remarks>
        [JsiiProperty("validationData", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-cognito.cloudformation.UserPoolUserResource.AttributeTypeProperty\"}]}}}}]},\"optional\":true}")]
        object ValidationData
        {
            get;
            set;
        }
    }
}