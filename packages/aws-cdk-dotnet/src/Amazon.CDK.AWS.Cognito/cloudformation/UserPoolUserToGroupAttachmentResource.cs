using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.Cognito.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolusertogroupattachment.html </remarks>
    [JsiiClass(typeof(UserPoolUserToGroupAttachmentResource), "@aws-cdk/aws-cognito.cloudformation.UserPoolUserToGroupAttachmentResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-cognito.cloudformation.UserPoolUserToGroupAttachmentResourceProps\"}}]")]
    public class UserPoolUserToGroupAttachmentResource : Resource
    {
        public UserPoolUserToGroupAttachmentResource(Construct parent, string name, IUserPoolUserToGroupAttachmentResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected UserPoolUserToGroupAttachmentResource(ByRefValue reference): base(reference)
        {
        }

        protected UserPoolUserToGroupAttachmentResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(UserPoolUserToGroupAttachmentResource));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}