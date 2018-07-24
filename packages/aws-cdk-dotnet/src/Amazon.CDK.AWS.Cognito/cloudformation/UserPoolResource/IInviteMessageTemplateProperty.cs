using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Cognito.cloudformation.UserPoolResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-invitemessagetemplate.html </remarks>
    [JsiiInterface(typeof(IInviteMessageTemplateProperty), "@aws-cdk/aws-cognito.cloudformation.UserPoolResource.InviteMessageTemplateProperty")]
    public interface IInviteMessageTemplateProperty
    {
        /// <summary>``UserPoolResource.InviteMessageTemplateProperty.EmailMessage``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-invitemessagetemplate.html#cfn-cognito-userpool-invitemessagetemplate-emailmessage </remarks>
        [JsiiProperty("emailMessage", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object EmailMessage
        {
            get;
            set;
        }

        /// <summary>``UserPoolResource.InviteMessageTemplateProperty.EmailSubject``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-invitemessagetemplate.html#cfn-cognito-userpool-invitemessagetemplate-emailsubject </remarks>
        [JsiiProperty("emailSubject", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object EmailSubject
        {
            get;
            set;
        }

        /// <summary>``UserPoolResource.InviteMessageTemplateProperty.SMSMessage``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-cognito-userpool-invitemessagetemplate.html#cfn-cognito-userpool-invitemessagetemplate-smsmessage </remarks>
        [JsiiProperty("smsMessage", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object SmsMessage
        {
            get;
            set;
        }
    }
}