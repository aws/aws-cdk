using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Route53.cloudformation.HostedZoneResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-hostedzone-hostedzoneconfig.html </remarks>
    [JsiiInterface(typeof(IHostedZoneConfigProperty), "@aws-cdk/aws-route53.cloudformation.HostedZoneResource.HostedZoneConfigProperty")]
    public interface IHostedZoneConfigProperty
    {
        /// <summary>``HostedZoneResource.HostedZoneConfigProperty.Comment``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-hostedzone-hostedzoneconfig.html#cfn-route53-hostedzone-hostedzoneconfig-comment </remarks>
        [JsiiProperty("comment", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Comment
        {
            get;
            set;
        }
    }
}