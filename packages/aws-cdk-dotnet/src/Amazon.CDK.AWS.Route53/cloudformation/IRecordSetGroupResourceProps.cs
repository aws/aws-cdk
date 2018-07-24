using Amazon.CDK;
using Amazon.CDK.AWS.Route53.cloudformation.RecordSetGroupResource;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Route53.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53-recordsetgroup.html </remarks>
    [JsiiInterface(typeof(IRecordSetGroupResourceProps), "@aws-cdk/aws-route53.cloudformation.RecordSetGroupResourceProps")]
    public interface IRecordSetGroupResourceProps
    {
        /// <summary>``AWS::Route53::RecordSetGroup.Comment``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53-recordsetgroup.html#cfn-route53-recordsetgroup-comment </remarks>
        [JsiiProperty("comment", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Comment
        {
            get;
            set;
        }

        /// <summary>``AWS::Route53::RecordSetGroup.HostedZoneId``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53-recordsetgroup.html#cfn-route53-recordsetgroup-hostedzoneid </remarks>
        [JsiiProperty("hostedZoneId", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object HostedZoneId
        {
            get;
            set;
        }

        /// <summary>``AWS::Route53::RecordSetGroup.HostedZoneName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53-recordsetgroup.html#cfn-route53-recordsetgroup-hostedzonename </remarks>
        [JsiiProperty("hostedZoneName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object HostedZoneName
        {
            get;
            set;
        }

        /// <summary>``AWS::Route53::RecordSetGroup.RecordSets``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-route53-recordsetgroup.html#cfn-route53-recordsetgroup-recordsets </remarks>
        [JsiiProperty("recordSets", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-route53.cloudformation.RecordSetGroupResource.RecordSetProperty\"}]}}}}]},\"optional\":true}")]
        object RecordSets
        {
            get;
            set;
        }
    }
}