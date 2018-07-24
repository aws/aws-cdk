using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2.cloudformation.LaunchTemplateResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-launchtemplatedata-instancemarketoptions.html </remarks>
    [JsiiInterface(typeof(IInstanceMarketOptionsProperty), "@aws-cdk/aws-ec2.cloudformation.LaunchTemplateResource.InstanceMarketOptionsProperty")]
    public interface IInstanceMarketOptionsProperty
    {
        /// <summary>``LaunchTemplateResource.InstanceMarketOptionsProperty.MarketType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-launchtemplatedata-instancemarketoptions.html#cfn-ec2-launchtemplate-launchtemplatedata-instancemarketoptions-markettype </remarks>
        [JsiiProperty("marketType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object MarketType
        {
            get;
            set;
        }

        /// <summary>``LaunchTemplateResource.InstanceMarketOptionsProperty.SpotOptions``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-launchtemplatedata-instancemarketoptions.html#cfn-ec2-launchtemplate-launchtemplatedata-instancemarketoptions-spotoptions </remarks>
        [JsiiProperty("spotOptions", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ec2.cloudformation.LaunchTemplateResource.SpotOptionsProperty\"}]},\"optional\":true}")]
        object SpotOptions
        {
            get;
            set;
        }
    }
}