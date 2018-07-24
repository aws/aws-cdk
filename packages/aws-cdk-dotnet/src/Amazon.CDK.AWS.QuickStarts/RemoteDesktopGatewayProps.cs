using Amazon.CDK.AWS.EC2;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.QuickStarts
{
    public class RemoteDesktopGatewayProps : DeputyBase, IRemoteDesktopGatewayProps
    {
        [JsiiProperty("rdgwCIDR", "{\"primitive\":\"string\"}", true)]
        public string RdgwCIDR
        {
            get;
            set;
        }

        [JsiiProperty("vpc", "{\"fqn\":\"@aws-cdk/aws-ec2.VpcNetworkRef\"}", true)]
        public VpcNetworkRef Vpc
        {
            get;
            set;
        }

        [JsiiProperty("keyPairName", "{\"primitive\":\"string\"}", true)]
        public string KeyPairName
        {
            get;
            set;
        }

        [JsiiProperty("adminPassword", "{\"primitive\":\"string\"}", true)]
        public string AdminPassword
        {
            get;
            set;
        }

        [JsiiProperty("adminUser", "{\"primitive\":\"string\",\"optional\":true}", true)]
        public string AdminUser
        {
            get;
            set;
        }

        [JsiiProperty("domainDNSName", "{\"primitive\":\"string\",\"optional\":true}", true)]
        public string DomainDNSName
        {
            get;
            set;
        }

        [JsiiProperty("numberOfRDGWHosts", "{\"primitive\":\"number\",\"optional\":true}", true)]
        public double? NumberOfRDGWHosts
        {
            get;
            set;
        }

        [JsiiProperty("qss3BucketName", "{\"primitive\":\"string\",\"optional\":true}", true)]
        public string Qss3BucketName
        {
            get;
            set;
        }

        [JsiiProperty("qss3KeyPrefix", "{\"primitive\":\"string\",\"optional\":true}", true)]
        public string Qss3KeyPrefix
        {
            get;
            set;
        }

        [JsiiProperty("rdgwInstanceType", "{\"primitive\":\"string\",\"optional\":true}", true)]
        public string RdgwInstanceType
        {
            get;
            set;
        }
    }
}