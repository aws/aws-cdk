using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Route53
{
    public class ZoneDelegationRecordProps : DeputyBase, IZoneDelegationRecordProps
    {
        /// <summary>The name of the zone that delegation is made to.</summary>
        [JsiiProperty("delegatedZoneName", "{\"primitive\":\"string\"}", true)]
        public string DelegatedZoneName
        {
            get;
            set;
        }

        /// <summary>The name servers to report in the delegation records.</summary>
        [JsiiProperty("nameServers", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"string\"}}}", true)]
        public string[] NameServers
        {
            get;
            set;
        }

        /// <summary>The TTL of the zone delegation records.</summary>
        /// <remarks>default: 172800 seconds.</remarks>
        [JsiiProperty("ttl", "{\"primitive\":\"number\",\"optional\":true}", true)]
        public double? Ttl
        {
            get;
            set;
        }

        /// <summary>Any comments that you want to include about the zone delegation records.</summary>
        /// <remarks>default: no comment.</remarks>
        [JsiiProperty("comment", "{\"primitive\":\"string\",\"optional\":true}", true)]
        public string Comment
        {
            get;
            set;
        }
    }
}