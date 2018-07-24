using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Route53.cloudformation.HostedZoneResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-hostedzone-hostedzoneconfig.html </remarks>
    [JsiiInterfaceProxy(typeof(IHostedZoneConfigProperty), "@aws-cdk/aws-route53.cloudformation.HostedZoneResource.HostedZoneConfigProperty")]
    internal class HostedZoneConfigPropertyProxy : DeputyBase, IHostedZoneConfigProperty
    {
        private HostedZoneConfigPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``HostedZoneResource.HostedZoneConfigProperty.Comment``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-hostedzone-hostedzoneconfig.html#cfn-route53-hostedzone-hostedzoneconfig-comment </remarks>
        [JsiiProperty("comment", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object Comment
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}