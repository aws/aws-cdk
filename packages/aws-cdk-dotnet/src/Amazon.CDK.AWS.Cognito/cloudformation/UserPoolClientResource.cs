using Amazon.CDK;
using Amazon.CDK.AWS.Cognito;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.Cognito.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpoolclient.html </remarks>
    [JsiiClass(typeof(UserPoolClientResource), "@aws-cdk/aws-cognito.cloudformation.UserPoolClientResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-cognito.cloudformation.UserPoolClientResourceProps\"}}]")]
    public class UserPoolClientResource : Resource
    {
        public UserPoolClientResource(Construct parent, string name, IUserPoolClientResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected UserPoolClientResource(ByRefValue reference): base(reference)
        {
        }

        protected UserPoolClientResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(UserPoolClientResource));
        /// <remarks>cloudformation_attribute: ClientSecret</remarks>
        [JsiiProperty("userPoolClientClientSecret", "{\"fqn\":\"@aws-cdk/aws-cognito.UserPoolClientClientSecret\"}")]
        public virtual UserPoolClientClientSecret UserPoolClientClientSecret
        {
            get => GetInstanceProperty<UserPoolClientClientSecret>();
        }

        /// <remarks>cloudformation_attribute: Name</remarks>
        [JsiiProperty("userPoolClientName", "{\"fqn\":\"@aws-cdk/aws-cognito.UserPoolClientName\"}")]
        public virtual UserPoolClientName UserPoolClientName
        {
            get => GetInstanceProperty<UserPoolClientName>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}