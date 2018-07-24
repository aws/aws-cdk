using Amazon.CDK;
using Amazon.CDK.AWS.Cloud9;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.Cloud9.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloud9-environmentec2.html </remarks>
    [JsiiClass(typeof(EnvironmentEC2Resource_), "@aws-cdk/aws-cloud9.cloudformation.EnvironmentEC2Resource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-cloud9.cloudformation.EnvironmentEC2ResourceProps\"}}]")]
    public class EnvironmentEC2Resource_ : Resource
    {
        public EnvironmentEC2Resource_(Construct parent, string name, IEnvironmentEC2ResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected EnvironmentEC2Resource_(ByRefValue reference): base(reference)
        {
        }

        protected EnvironmentEC2Resource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(EnvironmentEC2Resource_));
        /// <remarks>cloudformation_attribute: Arn</remarks>
        [JsiiProperty("environmentEc2Arn", "{\"fqn\":\"@aws-cdk/aws-cloud9.EnvironmentEC2Arn\"}")]
        public virtual EnvironmentEC2Arn EnvironmentEc2Arn
        {
            get => GetInstanceProperty<EnvironmentEC2Arn>();
        }

        /// <remarks>cloudformation_attribute: Name</remarks>
        [JsiiProperty("environmentEc2Name", "{\"fqn\":\"@aws-cdk/aws-cloud9.EnvironmentEC2Name\"}")]
        public virtual EnvironmentEC2Name EnvironmentEc2Name
        {
            get => GetInstanceProperty<EnvironmentEC2Name>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}