using Amazon.CDK;
using Amazon.CDK.AWS.Cognito.cloudformation.UserPoolResource;
using AWS.Jsii.Runtime.Deputy;
using Newtonsoft.Json.Linq;

namespace Amazon.CDK.AWS.Cognito.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html </remarks>
    public class UserPoolResourceProps : DeputyBase, IUserPoolResourceProps
    {
        /// <summary>``AWS::Cognito::UserPool.AdminCreateUserConfig``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-admincreateuserconfig </remarks>
        [JsiiProperty("adminCreateUserConfig", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-cognito.cloudformation.UserPoolResource.AdminCreateUserConfigProperty\"}]},\"optional\":true}", true)]
        public object AdminCreateUserConfig
        {
            get;
            set;
        }

        /// <summary>``AWS::Cognito::UserPool.AliasAttributes``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-aliasattributes </remarks>
        [JsiiProperty("aliasAttributes", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}", true)]
        public object AliasAttributes
        {
            get;
            set;
        }

        /// <summary>``AWS::Cognito::UserPool.AutoVerifiedAttributes``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-autoverifiedattributes </remarks>
        [JsiiProperty("autoVerifiedAttributes", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}", true)]
        public object AutoVerifiedAttributes
        {
            get;
            set;
        }

        /// <summary>``AWS::Cognito::UserPool.DeviceConfiguration``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-deviceconfiguration </remarks>
        [JsiiProperty("deviceConfiguration", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-cognito.cloudformation.UserPoolResource.DeviceConfigurationProperty\"}]},\"optional\":true}", true)]
        public object DeviceConfiguration
        {
            get;
            set;
        }

        /// <summary>``AWS::Cognito::UserPool.EmailConfiguration``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-emailconfiguration </remarks>
        [JsiiProperty("emailConfiguration", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-cognito.cloudformation.UserPoolResource.EmailConfigurationProperty\"}]},\"optional\":true}", true)]
        public object EmailConfiguration
        {
            get;
            set;
        }

        /// <summary>``AWS::Cognito::UserPool.EmailVerificationMessage``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-emailverificationmessage </remarks>
        [JsiiProperty("emailVerificationMessage", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object EmailVerificationMessage
        {
            get;
            set;
        }

        /// <summary>``AWS::Cognito::UserPool.EmailVerificationSubject``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-emailverificationsubject </remarks>
        [JsiiProperty("emailVerificationSubject", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object EmailVerificationSubject
        {
            get;
            set;
        }

        /// <summary>``AWS::Cognito::UserPool.LambdaConfig``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-lambdaconfig </remarks>
        [JsiiProperty("lambdaConfig", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-cognito.cloudformation.UserPoolResource.LambdaConfigProperty\"}]},\"optional\":true}", true)]
        public object LambdaConfig
        {
            get;
            set;
        }

        /// <summary>``AWS::Cognito::UserPool.MfaConfiguration``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-mfaconfiguration </remarks>
        [JsiiProperty("mfaConfiguration", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object MfaConfiguration
        {
            get;
            set;
        }

        /// <summary>``AWS::Cognito::UserPool.Policies``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-policies </remarks>
        [JsiiProperty("policies", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-cognito.cloudformation.UserPoolResource.PoliciesProperty\"}]},\"optional\":true}", true)]
        public object Policies
        {
            get;
            set;
        }

        /// <summary>``AWS::Cognito::UserPool.Schema``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-schema </remarks>
        [JsiiProperty("schema", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-cognito.cloudformation.UserPoolResource.SchemaAttributeProperty\"}]}}}}]},\"optional\":true}", true)]
        public object Schema
        {
            get;
            set;
        }

        /// <summary>``AWS::Cognito::UserPool.SmsAuthenticationMessage``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-smsauthenticationmessage </remarks>
        [JsiiProperty("smsAuthenticationMessage", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object SmsAuthenticationMessage
        {
            get;
            set;
        }

        /// <summary>``AWS::Cognito::UserPool.SmsConfiguration``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-smsconfiguration </remarks>
        [JsiiProperty("smsConfiguration", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-cognito.cloudformation.UserPoolResource.SmsConfigurationProperty\"}]},\"optional\":true}", true)]
        public object SmsConfiguration
        {
            get;
            set;
        }

        /// <summary>``AWS::Cognito::UserPool.SmsVerificationMessage``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-smsverificationmessage </remarks>
        [JsiiProperty("smsVerificationMessage", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object SmsVerificationMessage
        {
            get;
            set;
        }

        /// <summary>``AWS::Cognito::UserPool.UsernameAttributes``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-usernameattributes </remarks>
        [JsiiProperty("usernameAttributes", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}", true)]
        public object UsernameAttributes
        {
            get;
            set;
        }

        /// <summary>``AWS::Cognito::UserPool.UserPoolName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-userpoolname </remarks>
        [JsiiProperty("userPoolName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object UserPoolName
        {
            get;
            set;
        }

        /// <summary>``AWS::Cognito::UserPool.UserPoolTags``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html#cfn-cognito-userpool-userpooltags </remarks>
        [JsiiProperty("userPoolTags", "{\"union\":{\"types\":[{\"primitive\":\"json\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object UserPoolTags
        {
            get;
            set;
        }
    }
}