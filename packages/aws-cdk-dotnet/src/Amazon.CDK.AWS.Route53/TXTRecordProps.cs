using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Route53
{
    public class TXTRecordProps : DeputyBase, ITXTRecordProps
    {
        [JsiiProperty("recordName", "{\"primitive\":\"string\"}", true)]
        public string RecordName
        {
            get;
            set;
        }

        [JsiiProperty("recordValue", "{\"primitive\":\"string\"}", true)]
        public string RecordValue
        {
            get;
            set;
        }

        /// <remarks>default: 1800 seconds </remarks>
        [JsiiProperty("ttl", "{\"primitive\":\"number\",\"optional\":true}", true)]
        public double? Ttl
        {
            get;
            set;
        }
    }
}