using Amazon.CDK.AWS.EC2;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.QuickStarts
{
    [JsiiInterfaceProxy(typeof(IRemoteDesktopGatewayProps), "@aws-cdk/aws-quickstarts.RemoteDesktopGatewayProps")]
    internal class RemoteDesktopGatewayPropsProxy : DeputyBase, IRemoteDesktopGatewayProps
    {
        private RemoteDesktopGatewayPropsProxy(ByRefValue reference): base(reference)
        {
        }

        [JsiiProperty("rdgwCIDR", "{\"primitive\":\"string\"}")]
        public virtual string RdgwCIDR
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        [JsiiProperty("vpc", "{\"fqn\":\"@aws-cdk/aws-ec2.VpcNetworkRef\"}")]
        public virtual VpcNetworkRef Vpc
        {
            get => GetInstanceProperty<VpcNetworkRef>();
            set => SetInstanceProperty(value);
        }

        [JsiiProperty("keyPairName", "{\"primitive\":\"string\"}")]
        public virtual string KeyPairName
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        [JsiiProperty("adminPassword", "{\"primitive\":\"string\"}")]
        public virtual string AdminPassword
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        [JsiiProperty("adminUser", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string AdminUser
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        [JsiiProperty("domainDNSName", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string DomainDNSName
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        [JsiiProperty("numberOfRDGWHosts", "{\"primitive\":\"number\",\"optional\":true}")]
        public virtual double? NumberOfRDGWHosts
        {
            get => GetInstanceProperty<double? >();
            set => SetInstanceProperty(value);
        }

        [JsiiProperty("qss3BucketName", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string Qss3BucketName
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        [JsiiProperty("qss3KeyPrefix", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string Qss3KeyPrefix
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        [JsiiProperty("rdgwInstanceType", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string RdgwInstanceType
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }
    }
}