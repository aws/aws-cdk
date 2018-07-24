using Amazon.CDK;
using Amazon.CDK.AWS.IAM;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.IAM.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iam-group.html </remarks>
    [JsiiClass(typeof(GroupResource_), "@aws-cdk/aws-iam.cloudformation.GroupResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-iam.cloudformation.GroupResourceProps\",\"optional\":true}}]")]
    public class GroupResource_ : Resource
    {
        public GroupResource_(Construct parent, string name, IGroupResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected GroupResource_(ByRefValue reference): base(reference)
        {
        }

        protected GroupResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(GroupResource_));
        /// <remarks>cloudformation_attribute: Arn</remarks>
        [JsiiProperty("groupArn", "{\"fqn\":\"@aws-cdk/aws-iam.GroupArn\"}")]
        public virtual GroupArn GroupArn
        {
            get => GetInstanceProperty<GroupArn>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}