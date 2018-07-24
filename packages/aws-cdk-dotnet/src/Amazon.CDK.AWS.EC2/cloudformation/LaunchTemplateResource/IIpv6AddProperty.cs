using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2.cloudformation.LaunchTemplateResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-ipv6add.html </remarks>
    [JsiiInterface(typeof(IIpv6AddProperty), "@aws-cdk/aws-ec2.cloudformation.LaunchTemplateResource.Ipv6AddProperty")]
    public interface IIpv6AddProperty
    {
        /// <summary>``LaunchTemplateResource.Ipv6AddProperty.Ipv6Address``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-launchtemplate-ipv6add.html#cfn-ec2-launchtemplate-ipv6add-ipv6address </remarks>
        [JsiiProperty("ipv6Address", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Ipv6Address
        {
            get;
            set;
        }
    }
}