using Amazon.CDK.AWS.EC2;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.QuickStarts
{
    [JsiiInterface(typeof(IRemoteDesktopGatewayProps), "@aws-cdk/aws-quickstarts.RemoteDesktopGatewayProps")]
    public interface IRemoteDesktopGatewayProps
    {
        [JsiiProperty("rdgwCIDR", "{\"primitive\":\"string\"}")]
        string RdgwCIDR
        {
            get;
            set;
        }

        [JsiiProperty("vpc", "{\"fqn\":\"@aws-cdk/aws-ec2.VpcNetworkRef\"}")]
        VpcNetworkRef Vpc
        {
            get;
            set;
        }

        [JsiiProperty("keyPairName", "{\"primitive\":\"string\"}")]
        string KeyPairName
        {
            get;
            set;
        }

        [JsiiProperty("adminPassword", "{\"primitive\":\"string\"}")]
        string AdminPassword
        {
            get;
            set;
        }

        [JsiiProperty("adminUser", "{\"primitive\":\"string\",\"optional\":true}")]
        string AdminUser
        {
            get;
            set;
        }

        [JsiiProperty("domainDNSName", "{\"primitive\":\"string\",\"optional\":true}")]
        string DomainDNSName
        {
            get;
            set;
        }

        [JsiiProperty("numberOfRDGWHosts", "{\"primitive\":\"number\",\"optional\":true}")]
        double? NumberOfRDGWHosts
        {
            get;
            set;
        }

        [JsiiProperty("qss3BucketName", "{\"primitive\":\"string\",\"optional\":true}")]
        string Qss3BucketName
        {
            get;
            set;
        }

        [JsiiProperty("qss3KeyPrefix", "{\"primitive\":\"string\",\"optional\":true}")]
        string Qss3KeyPrefix
        {
            get;
            set;
        }

        [JsiiProperty("rdgwInstanceType", "{\"primitive\":\"string\",\"optional\":true}")]
        string RdgwInstanceType
        {
            get;
            set;
        }
    }
}