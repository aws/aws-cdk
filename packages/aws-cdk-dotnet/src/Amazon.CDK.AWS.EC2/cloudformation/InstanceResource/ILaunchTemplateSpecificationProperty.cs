using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2.cloudformation.InstanceResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance-launchtemplatespecification.html </remarks>
    [JsiiInterface(typeof(ILaunchTemplateSpecificationProperty), "@aws-cdk/aws-ec2.cloudformation.InstanceResource.LaunchTemplateSpecificationProperty")]
    public interface ILaunchTemplateSpecificationProperty
    {
        /// <summary>``InstanceResource.LaunchTemplateSpecificationProperty.LaunchTemplateId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance-launchtemplatespecification.html#cfn-ec2-instance-launchtemplatespecification-launchtemplateid </remarks>
        [JsiiProperty("launchTemplateId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object LaunchTemplateId
        {
            get;
            set;
        }

        /// <summary>``InstanceResource.LaunchTemplateSpecificationProperty.LaunchTemplateName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance-launchtemplatespecification.html#cfn-ec2-instance-launchtemplatespecification-launchtemplatename </remarks>
        [JsiiProperty("launchTemplateName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object LaunchTemplateName
        {
            get;
            set;
        }

        /// <summary>``InstanceResource.LaunchTemplateSpecificationProperty.Version``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-instance-launchtemplatespecification.html#cfn-ec2-instance-launchtemplatespecification-version </remarks>
        [JsiiProperty("version", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Version
        {
            get;
            set;
        }
    }
}