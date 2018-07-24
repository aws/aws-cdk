using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.OpsWorks.cloudformation.StackResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-stackconfigmanager.html </remarks>
    [JsiiInterfaceProxy(typeof(IStackConfigurationManagerProperty), "@aws-cdk/aws-opsworks.cloudformation.StackResource.StackConfigurationManagerProperty")]
    internal class StackConfigurationManagerPropertyProxy : DeputyBase, IStackConfigurationManagerProperty
    {
        private StackConfigurationManagerPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``StackResource.StackConfigurationManagerProperty.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-stackconfigmanager.html#cfn-opsworks-configmanager-name </remarks>
        [JsiiProperty("name", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object Name
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``StackResource.StackConfigurationManagerProperty.Version``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-stackconfigmanager.html#cfn-opsworks-configmanager-version </remarks>
        [JsiiProperty("version", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object Version
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}