using Amazon.CDK;
using Amazon.CDK.AWS.IAM;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.IAM.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iam-instanceprofile.html </remarks>
    [JsiiClass(typeof(InstanceProfileResource), "@aws-cdk/aws-iam.cloudformation.InstanceProfileResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-iam.cloudformation.InstanceProfileResourceProps\"}}]")]
    public class InstanceProfileResource : Resource
    {
        public InstanceProfileResource(Construct parent, string name, IInstanceProfileResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected InstanceProfileResource(ByRefValue reference): base(reference)
        {
        }

        protected InstanceProfileResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(InstanceProfileResource));
        /// <remarks>cloudformation_attribute: Arn</remarks>
        [JsiiProperty("instanceProfileArn", "{\"fqn\":\"@aws-cdk/aws-iam.InstanceProfileArn\"}")]
        public virtual InstanceProfileArn InstanceProfileArn
        {
            get => GetInstanceProperty<InstanceProfileArn>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}