using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.CodeDeploy.cloudformation.DeploymentGroupResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-elbinfo.html </remarks>
    [JsiiInterfaceProxy(typeof(IELBInfoProperty), "@aws-cdk/aws-codedeploy.cloudformation.DeploymentGroupResource.ELBInfoProperty")]
    internal class ELBInfoPropertyProxy : DeputyBase, IELBInfoProperty
    {
        private ELBInfoPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``DeploymentGroupResource.ELBInfoProperty.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codedeploy-deploymentgroup-elbinfo.html#cfn-codedeploy-deploymentgroup-elbinfo-name </remarks>
        [JsiiProperty("name", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object Name
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}