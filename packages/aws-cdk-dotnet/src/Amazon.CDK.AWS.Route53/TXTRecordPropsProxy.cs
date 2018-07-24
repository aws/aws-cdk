using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Route53
{
    [JsiiInterfaceProxy(typeof(ITXTRecordProps), "@aws-cdk/aws-route53.TXTRecordProps")]
    internal class TXTRecordPropsProxy : DeputyBase, ITXTRecordProps
    {
        private TXTRecordPropsProxy(ByRefValue reference): base(reference)
        {
        }

        [JsiiProperty("recordName", "{\"primitive\":\"string\"}")]
        public virtual string RecordName
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        [JsiiProperty("recordValue", "{\"primitive\":\"string\"}")]
        public virtual string RecordValue
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <remarks>default: 1800 seconds </remarks>
        [JsiiProperty("ttl", "{\"primitive\":\"number\",\"optional\":true}")]
        public virtual double? Ttl
        {
            get => GetInstanceProperty<double? >();
            set => SetInstanceProperty(value);
        }
    }
}