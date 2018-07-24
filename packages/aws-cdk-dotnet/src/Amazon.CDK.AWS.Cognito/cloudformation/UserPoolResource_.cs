using Amazon.CDK;
using Amazon.CDK.AWS.Cognito;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.Cognito.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cognito-userpool.html </remarks>
    [JsiiClass(typeof(UserPoolResource_), "@aws-cdk/aws-cognito.cloudformation.UserPoolResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-cognito.cloudformation.UserPoolResourceProps\",\"optional\":true}}]")]
    public class UserPoolResource_ : Resource
    {
        public UserPoolResource_(Construct parent, string name, IUserPoolResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected UserPoolResource_(ByRefValue reference): base(reference)
        {
        }

        protected UserPoolResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(UserPoolResource_));
        /// <remarks>cloudformation_attribute: Arn</remarks>
        [JsiiProperty("userPoolArn", "{\"fqn\":\"@aws-cdk/aws-cognito.UserPoolArn\"}")]
        public virtual UserPoolArn UserPoolArn
        {
            get => GetInstanceProperty<UserPoolArn>();
        }

        /// <remarks>cloudformation_attribute: ProviderName</remarks>
        [JsiiProperty("userPoolProviderName", "{\"fqn\":\"@aws-cdk/aws-cognito.UserPoolProviderName\"}")]
        public virtual UserPoolProviderName UserPoolProviderName
        {
            get => GetInstanceProperty<UserPoolProviderName>();
        }

        /// <remarks>cloudformation_attribute: ProviderURL</remarks>
        [JsiiProperty("userPoolProviderUrl", "{\"fqn\":\"@aws-cdk/aws-cognito.UserPoolProviderUrl\"}")]
        public virtual UserPoolProviderUrl UserPoolProviderUrl
        {
            get => GetInstanceProperty<UserPoolProviderUrl>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}