using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Route53
{
    [JsiiInterface(typeof(IZoneDelegationRecordProps), "@aws-cdk/aws-route53.ZoneDelegationRecordProps")]
    public interface IZoneDelegationRecordProps
    {
        /// <summary>The name of the zone that delegation is made to.</summary>
        [JsiiProperty("delegatedZoneName", "{\"primitive\":\"string\"}")]
        string DelegatedZoneName
        {
            get;
            set;
        }

        /// <summary>The name servers to report in the delegation records.</summary>
        [JsiiProperty("nameServers", "{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"primitive\":\"string\"}}}")]
        string[] NameServers
        {
            get;
            set;
        }

        /// <summary>The TTL of the zone delegation records.</summary>
        /// <remarks>default: 172800 seconds.</remarks>
        [JsiiProperty("ttl", "{\"primitive\":\"number\",\"optional\":true}")]
        double? Ttl
        {
            get;
            set;
        }

        /// <summary>Any comments that you want to include about the zone delegation records.</summary>
        /// <remarks>default: no comment.</remarks>
        [JsiiProperty("comment", "{\"primitive\":\"string\",\"optional\":true}")]
        string Comment
        {
            get;
            set;
        }
    }
}