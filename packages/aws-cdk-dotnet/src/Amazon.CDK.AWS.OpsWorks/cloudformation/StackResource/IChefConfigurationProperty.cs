using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.OpsWorks.cloudformation.StackResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-chefconfiguration.html </remarks>
    [JsiiInterface(typeof(IChefConfigurationProperty), "@aws-cdk/aws-opsworks.cloudformation.StackResource.ChefConfigurationProperty")]
    public interface IChefConfigurationProperty
    {
        /// <summary>``StackResource.ChefConfigurationProperty.BerkshelfVersion``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-chefconfiguration.html#cfn-opsworks-chefconfiguration-berkshelfversion </remarks>
        [JsiiProperty("berkshelfVersion", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object BerkshelfVersion
        {
            get;
            set;
        }

        /// <summary>``StackResource.ChefConfigurationProperty.ManageBerkshelf``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-chefconfiguration.html#cfn-opsworks-chefconfiguration-berkshelfversion </remarks>
        [JsiiProperty("manageBerkshelf", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ManageBerkshelf
        {
            get;
            set;
        }
    }
}