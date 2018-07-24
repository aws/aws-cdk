using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.IAM.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-managedpolicy.html </remarks>
    [JsiiClass(typeof(ManagedPolicyResource), "@aws-cdk/aws-iam.cloudformation.ManagedPolicyResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-iam.cloudformation.ManagedPolicyResourceProps\"}}]")]
    public class ManagedPolicyResource : Resource
    {
        public ManagedPolicyResource(Construct parent, string name, IManagedPolicyResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected ManagedPolicyResource(ByRefValue reference): base(reference)
        {
        }

        protected ManagedPolicyResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(ManagedPolicyResource));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}