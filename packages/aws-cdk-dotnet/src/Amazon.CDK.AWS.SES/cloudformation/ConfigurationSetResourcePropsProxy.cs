using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SES.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-configurationset.html </remarks>
    [JsiiInterfaceProxy(typeof(IConfigurationSetResourceProps), "@aws-cdk/aws-ses.cloudformation.ConfigurationSetResourceProps")]
    internal class ConfigurationSetResourcePropsProxy : DeputyBase, IConfigurationSetResourceProps
    {
        private ConfigurationSetResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::SES::ConfigurationSet.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-configurationset.html#cfn-ses-configurationset-name </remarks>
        [JsiiProperty("configurationSetName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object ConfigurationSetName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}