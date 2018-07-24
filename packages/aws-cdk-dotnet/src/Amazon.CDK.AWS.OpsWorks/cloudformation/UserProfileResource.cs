using Amazon.CDK;
using Amazon.CDK.AWS.OpsWorks;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.OpsWorks.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-opsworks-userprofile.html </remarks>
    [JsiiClass(typeof(UserProfileResource), "@aws-cdk/aws-opsworks.cloudformation.UserProfileResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-opsworks.cloudformation.UserProfileResourceProps\"}}]")]
    public class UserProfileResource : Resource
    {
        public UserProfileResource(Construct parent, string name, IUserProfileResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected UserProfileResource(ByRefValue reference): base(reference)
        {
        }

        protected UserProfileResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(UserProfileResource));
        /// <remarks>cloudformation_attribute: SshUsername</remarks>
        [JsiiProperty("userProfileSshUsername", "{\"fqn\":\"@aws-cdk/aws-opsworks.UserProfileSshUsername\"}")]
        public virtual UserProfileSshUsername UserProfileSshUsername
        {
            get => GetInstanceProperty<UserProfileSshUsername>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}