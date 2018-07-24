using Amazon.CDK;
using Amazon.CDK.AWS.EC2.cloudformation.LaunchTemplateResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-launchtemplate.html </remarks>
    public class LaunchTemplateResourceProps : DeputyBase, ILaunchTemplateResourceProps
    {
        /// <summary>``AWS::EC2::LaunchTemplate.LaunchTemplateData``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-launchtemplate.html#cfn-ec2-launchtemplate-launchtemplatedata </remarks>
        [JsiiProperty("launchTemplateData", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ec2.cloudformation.LaunchTemplateResource.LaunchTemplateDataProperty\"}]},\"optional\":true}", true)]
        public object LaunchTemplateData
        {
            get;
            set;
        }

        /// <summary>``AWS::EC2::LaunchTemplate.LaunchTemplateName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ec2-launchtemplate.html#cfn-ec2-launchtemplate-launchtemplatename </remarks>
        [JsiiProperty("launchTemplateName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object LaunchTemplateName
        {
            get;
            set;
        }
    }
}