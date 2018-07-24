using Amazon.CDK;
using Amazon.CDK.AWS.EC2;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.EC2.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-launchtemplate.html </remarks>
    [JsiiClass(typeof(LaunchTemplateResource_), "@aws-cdk/aws-ec2.cloudformation.LaunchTemplateResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-ec2.cloudformation.LaunchTemplateResourceProps\",\"optional\":true}}]")]
    public class LaunchTemplateResource_ : Resource
    {
        public LaunchTemplateResource_(Construct parent, string name, ILaunchTemplateResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected LaunchTemplateResource_(ByRefValue reference): base(reference)
        {
        }

        protected LaunchTemplateResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(LaunchTemplateResource_));
        /// <remarks>cloudformation_attribute: DefaultVersionNumber</remarks>
        [JsiiProperty("launchTemplateDefaultVersionNumber", "{\"fqn\":\"@aws-cdk/aws-ec2.LaunchTemplateDefaultVersionNumber\"}")]
        public virtual LaunchTemplateDefaultVersionNumber LaunchTemplateDefaultVersionNumber
        {
            get => GetInstanceProperty<LaunchTemplateDefaultVersionNumber>();
        }

        /// <remarks>cloudformation_attribute: LatestVersionNumber</remarks>
        [JsiiProperty("launchTemplateLatestVersionNumber", "{\"fqn\":\"@aws-cdk/aws-ec2.LaunchTemplateLatestVersionNumber\"}")]
        public virtual LaunchTemplateLatestVersionNumber LaunchTemplateLatestVersionNumber
        {
            get => GetInstanceProperty<LaunchTemplateLatestVersionNumber>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}