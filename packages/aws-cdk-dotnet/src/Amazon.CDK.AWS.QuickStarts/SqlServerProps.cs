using Amazon.CDK.AWS.EC2;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.QuickStarts
{
    public class SqlServerProps : DeputyBase, ISqlServerProps
    {
        [JsiiProperty("instanceClass", "{\"primitive\":\"string\",\"optional\":true}", true)]
        public string InstanceClass
        {
            get;
            set;
        }

        [JsiiProperty("engine", "{\"primitive\":\"string\",\"optional\":true}", true)]
        public string Engine
        {
            get;
            set;
        }

        [JsiiProperty("engineVersion", "{\"primitive\":\"string\",\"optional\":true}", true)]
        public string EngineVersion
        {
            get;
            set;
        }

        [JsiiProperty("licenseModel", "{\"primitive\":\"string\",\"optional\":true}", true)]
        public string LicenseModel
        {
            get;
            set;
        }

        [JsiiProperty("masterUsername", "{\"primitive\":\"string\"}", true)]
        public string MasterUsername
        {
            get;
            set;
        }

        [JsiiProperty("masterPassword", "{\"primitive\":\"string\"}", true)]
        public string MasterPassword
        {
            get;
            set;
        }

        [JsiiProperty("allocatedStorage", "{\"primitive\":\"number\",\"optional\":true}", true)]
        public double? AllocatedStorage
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
    }
}