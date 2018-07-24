using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Route53.cloudformation.RecordSetResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-aliastarget.html </remarks>
    public class AliasTargetProperty : DeputyBase, Amazon.CDK.AWS.Route53.cloudformation.RecordSetResource.IAliasTargetProperty
    {
        /// <summary>``RecordSetResource.AliasTargetProperty.DNSName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-aliastarget.html#cfn-route53-aliastarget-dnshostname </remarks>
        [JsiiProperty("dnsName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object DnsName
        {
            get;
            set;
        }

        /// <summary>``RecordSetResource.AliasTargetProperty.EvaluateTargetHealth``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-aliastarget.html#cfn-route53-aliastarget-evaluatetargethealth </remarks>
        [JsiiProperty("evaluateTargetHealth", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object EvaluateTargetHealth
        {
            get;
            set;
        }

        /// <summary>``RecordSetResource.AliasTargetProperty.HostedZoneId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-aliastarget.html#cfn-route53-aliastarget-hostedzoneid </remarks>
        [JsiiProperty("hostedZoneId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object HostedZoneId
        {
            get;
            set;
        }
    }
}