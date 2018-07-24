using Amazon.CDK;
using Amazon.CDK.AWS.Route53.cloudformation.HostedZoneResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Route53.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53-hostedzone.html </remarks>
    public class HostedZoneResourceProps : DeputyBase, IHostedZoneResourceProps
    {
        /// <summary>``AWS::Route53::HostedZone.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53-hostedzone.html#cfn-route53-hostedzone-name </remarks>
        [JsiiProperty("hostedZoneName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object HostedZoneName
        {
            get;
            set;
        }

        /// <summary>``AWS::Route53::HostedZone.HostedZoneConfig``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53-hostedzone.html#cfn-route53-hostedzone-hostedzoneconfig </remarks>
        [JsiiProperty("hostedZoneConfig", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-route53.cloudformation.HostedZoneResource.HostedZoneConfigProperty\"}]},\"optional\":true}", true)]
        public object HostedZoneConfig
        {
            get;
            set;
        }

        /// <summary>``AWS::Route53::HostedZone.HostedZoneTags``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53-hostedzone.html#cfn-route53-hostedzone-hostedzonetags </remarks>
        [JsiiProperty("hostedZoneTags", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-route53.cloudformation.HostedZoneResource.HostedZoneTagProperty\"}]}}}}]},\"optional\":true}", true)]
        public object HostedZoneTags
        {
            get;
            set;
        }

        /// <summary>``AWS::Route53::HostedZone.QueryLoggingConfig``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53-hostedzone.html#cfn-route53-hostedzone-queryloggingconfig </remarks>
        [JsiiProperty("queryLoggingConfig", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-route53.cloudformation.HostedZoneResource.QueryLoggingConfigProperty\"}]},\"optional\":true}", true)]
        public object QueryLoggingConfig
        {
            get;
            set;
        }

        /// <summary>``AWS::Route53::HostedZone.VPCs``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53-hostedzone.html#cfn-route53-hostedzone-vpcs </remarks>
        [JsiiProperty("vpcs", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-route53.cloudformation.HostedZoneResource.VPCProperty\"}]}}}}]},\"optional\":true}", true)]
        public object Vpcs
        {
            get;
            set;
        }
    }
}