using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.AutoScaling.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-launchconfig.html </remarks>
    [JsiiClass(typeof(LaunchConfigurationResource_), "@aws-cdk/aws-autoscaling.cloudformation.LaunchConfigurationResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-autoscaling.cloudformation.LaunchConfigurationResourceProps\"}}]")]
    public class LaunchConfigurationResource_ : Resource
    {
        public LaunchConfigurationResource_(Construct parent, string name, ILaunchConfigurationResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected LaunchConfigurationResource_(ByRefValue reference): base(reference)
        {
        }

        protected LaunchConfigurationResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(LaunchConfigurationResource_));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}