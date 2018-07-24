using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SES.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-configurationset.html </remarks>
    public class ConfigurationSetResourceProps : DeputyBase, IConfigurationSetResourceProps
    {
        /// <summary>``AWS::SES::ConfigurationSet.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-configurationset.html#cfn-ses-configurationset-name </remarks>
        [JsiiProperty("configurationSetName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object ConfigurationSetName
        {
            get;
            set;
        }
    }
}