using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SES.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-configurationset.html </remarks>
    [JsiiInterface(typeof(IConfigurationSetResourceProps), "@aws-cdk/aws-ses.cloudformation.ConfigurationSetResourceProps")]
    public interface IConfigurationSetResourceProps
    {
        /// <summary>``AWS::SES::ConfigurationSet.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-configurationset.html#cfn-ses-configurationset-name </remarks>
        [JsiiProperty("configurationSetName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ConfigurationSetName
        {
            get;
            set;
        }
    }
}