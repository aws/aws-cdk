using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.CodeDeploy.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codedeploy-deploymentconfig.html </remarks>
    [JsiiClass(typeof(DeploymentConfigResource_), "@aws-cdk/aws-codedeploy.cloudformation.DeploymentConfigResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-codedeploy.cloudformation.DeploymentConfigResourceProps\",\"optional\":true}}]")]
    public class DeploymentConfigResource_ : Resource
    {
        public DeploymentConfigResource_(Construct parent, string name, IDeploymentConfigResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected DeploymentConfigResource_(ByRefValue reference): base(reference)
        {
        }

        protected DeploymentConfigResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(DeploymentConfigResource_));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}