using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Route53.cloudformation.RecordSetGroupResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-aliastarget.html </remarks>
    [JsiiInterface(typeof(IAliasTargetProperty), "@aws-cdk/aws-route53.cloudformation.RecordSetGroupResource.AliasTargetProperty")]
    public interface IAliasTargetProperty
    {
        /// <summary>``RecordSetGroupResource.AliasTargetProperty.DNSName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-aliastarget.html#cfn-route53-aliastarget-dnshostname </remarks>
        [JsiiProperty("dnsName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object DnsName
        {
            get;
            set;
        }

        /// <summary>``RecordSetGroupResource.AliasTargetProperty.EvaluateTargetHealth``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-aliastarget.html#cfn-route53-aliastarget-evaluatetargethealth </remarks>
        [JsiiProperty("evaluateTargetHealth", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object EvaluateTargetHealth
        {
            get;
            set;
        }

        /// <summary>``RecordSetGroupResource.AliasTargetProperty.HostedZoneId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-route53-aliastarget.html#cfn-route53-aliastarget-hostedzoneid </remarks>
        [JsiiProperty("hostedZoneId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object HostedZoneId
        {
            get;
            set;
        }
    }
}