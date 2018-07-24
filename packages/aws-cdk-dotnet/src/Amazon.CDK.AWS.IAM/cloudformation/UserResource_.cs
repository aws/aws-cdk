using Amazon.CDK;
using Amazon.CDK.AWS.IAM;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.IAM.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iam-user.html </remarks>
    [JsiiClass(typeof(UserResource_), "@aws-cdk/aws-iam.cloudformation.UserResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-iam.cloudformation.UserResourceProps\",\"optional\":true}}]")]
    public class UserResource_ : Resource
    {
        public UserResource_(Construct parent, string name, IUserResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected UserResource_(ByRefValue reference): base(reference)
        {
        }

        protected UserResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(UserResource_));
        /// <remarks>cloudformation_attribute: Arn</remarks>
        [JsiiProperty("userArn", "{\"fqn\":\"@aws-cdk/aws-iam.UserArn\"}")]
        public virtual UserArn UserArn
        {
            get => GetInstanceProperty<UserArn>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}