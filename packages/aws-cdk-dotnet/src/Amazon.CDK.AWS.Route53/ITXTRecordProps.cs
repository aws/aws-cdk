using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Route53
{
    [JsiiInterface(typeof(ITXTRecordProps), "@aws-cdk/aws-route53.TXTRecordProps")]
    public interface ITXTRecordProps
    {
        [JsiiProperty("recordName", "{\"primitive\":\"string\"}")]
        string RecordName
        {
            get;
            set;
        }

        [JsiiProperty("recordValue", "{\"primitive\":\"string\"}")]
        string RecordValue
        {
            get;
            set;
        }

        /// <remarks>default: 1800 seconds </remarks>
        [JsiiProperty("ttl", "{\"primitive\":\"number\",\"optional\":true}")]
        double? Ttl
        {
            get;
            set;
        }
    }
}