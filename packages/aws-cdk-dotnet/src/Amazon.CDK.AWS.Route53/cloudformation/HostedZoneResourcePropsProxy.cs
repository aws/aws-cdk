using Amazon.CDK;
using Amazon.CDK.AWS.Route53.cloudformation.HostedZoneResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Route53.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53-hostedzone.html </remarks>
    [JsiiInterfaceProxy(typeof(IHostedZoneResourceProps), "@aws-cdk/aws-route53.cloudformation.HostedZoneResourceProps")]
    internal class HostedZoneResourcePropsProxy : DeputyBase, IHostedZoneResourceProps
    {
        private HostedZoneResourcePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``AWS::Route53::HostedZone.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53-hostedzone.html#cfn-route53-hostedzone-name </remarks>
        [JsiiProperty("hostedZoneName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object HostedZoneName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::Route53::HostedZone.HostedZoneConfig``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53-hostedzone.html#cfn-route53-hostedzone-hostedzoneconfig </remarks>
        [JsiiProperty("hostedZoneConfig", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-route53.cloudformation.HostedZoneResource.HostedZoneConfigProperty\"}]},\"optional\":true}")]
        public virtual object HostedZoneConfig
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::Route53::HostedZone.HostedZoneTags``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53-hostedzone.html#cfn-route53-hostedzone-hostedzonetags </remarks>
        [JsiiProperty("hostedZoneTags", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-route53.cloudformation.HostedZoneResource.HostedZoneTagProperty\"}]}}}}]},\"optional\":true}")]
        public virtual object HostedZoneTags
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::Route53::HostedZone.QueryLoggingConfig``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53-hostedzone.html#cfn-route53-hostedzone-queryloggingconfig </remarks>
        [JsiiProperty("queryLoggingConfig", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-route53.cloudformation.HostedZoneResource.QueryLoggingConfigProperty\"}]},\"optional\":true}")]
        public virtual object QueryLoggingConfig
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``AWS::Route53::HostedZone.VPCs``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53-hostedzone.html#cfn-route53-hostedzone-vpcs </remarks>
        [JsiiProperty("vpcs", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-route53.cloudformation.HostedZoneResource.VPCProperty\"}]}}}}]},\"optional\":true}")]
        public virtual object Vpcs
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}