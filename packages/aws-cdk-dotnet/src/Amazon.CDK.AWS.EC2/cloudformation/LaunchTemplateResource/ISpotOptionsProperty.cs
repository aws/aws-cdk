using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2.cloudformation.LaunchTemplateResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-launchtemplatedata-instancemarketoptions-spotoptions.html </remarks>
    [JsiiInterface(typeof(ISpotOptionsProperty), "@aws-cdk/aws-ec2.cloudformation.LaunchTemplateResource.SpotOptionsProperty")]
    public interface ISpotOptionsProperty
    {
        /// <summary>``LaunchTemplateResource.SpotOptionsProperty.InstanceInterruptionBehavior``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-launchtemplatedata-instancemarketoptions-spotoptions.html#cfn-ec2-launchtemplate-launchtemplatedata-instancemarketoptions-spotoptions-instanceinterruptionbehavior </remarks>
        [JsiiProperty("instanceInterruptionBehavior", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object InstanceInterruptionBehavior
        {
            get;
            set;
        }

        /// <summary>``LaunchTemplateResource.SpotOptionsProperty.MaxPrice``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-launchtemplatedata-instancemarketoptions-spotoptions.html#cfn-ec2-launchtemplate-launchtemplatedata-instancemarketoptions-spotoptions-maxprice </remarks>
        [JsiiProperty("maxPrice", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object MaxPrice
        {
            get;
            set;
        }

        /// <summary>``LaunchTemplateResource.SpotOptionsProperty.SpotInstanceType``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-launchtemplatedata-instancemarketoptions-spotoptions.html#cfn-ec2-launchtemplate-launchtemplatedata-instancemarketoptions-spotoptions-spotinstancetype </remarks>
        [JsiiProperty("spotInstanceType", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object SpotInstanceType
        {
            get;
            set;
        }
    }
}