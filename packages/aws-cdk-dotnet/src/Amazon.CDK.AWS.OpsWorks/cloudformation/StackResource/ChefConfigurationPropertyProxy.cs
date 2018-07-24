using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.OpsWorks.cloudformation.StackResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-chefconfiguration.html </remarks>
    [JsiiInterfaceProxy(typeof(IChefConfigurationProperty), "@aws-cdk/aws-opsworks.cloudformation.StackResource.ChefConfigurationProperty")]
    internal class ChefConfigurationPropertyProxy : DeputyBase, IChefConfigurationProperty
    {
        private ChefConfigurationPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``StackResource.ChefConfigurationProperty.BerkshelfVersion``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-chefconfiguration.html#cfn-opsworks-chefconfiguration-berkshelfversion </remarks>
        [JsiiProperty("berkshelfVersion", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object BerkshelfVersion
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``StackResource.ChefConfigurationProperty.ManageBerkshelf``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-chefconfiguration.html#cfn-opsworks-chefconfiguration-berkshelfversion </remarks>
        [JsiiProperty("manageBerkshelf", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object ManageBerkshelf
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}