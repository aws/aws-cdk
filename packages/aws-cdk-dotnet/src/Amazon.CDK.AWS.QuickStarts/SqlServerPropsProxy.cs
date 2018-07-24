using Amazon.CDK.AWS.EC2;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.QuickStarts
{
    [JsiiInterfaceProxy(typeof(ISqlServerProps), "@aws-cdk/aws-quickstarts.SqlServerProps")]
    internal class SqlServerPropsProxy : DeputyBase, ISqlServerProps
    {
        private SqlServerPropsProxy(ByRefValue reference): base(reference)
        {
        }

        [JsiiProperty("instanceClass", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string InstanceClass
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        [JsiiProperty("engine", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string Engine
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        [JsiiProperty("engineVersion", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string EngineVersion
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        [JsiiProperty("licenseModel", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string LicenseModel
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        [JsiiProperty("masterUsername", "{\"primitive\":\"string\"}")]
        public virtual string MasterUsername
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        [JsiiProperty("masterPassword", "{\"primitive\":\"string\"}")]
        public virtual string MasterPassword
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        [JsiiProperty("allocatedStorage", "{\"primitive\":\"number\",\"optional\":true}")]
        public virtual double? AllocatedStorage
        {
            get => GetInstanceProperty<double? >();
            set => SetInstanceProperty(value);
        }

        [JsiiProperty("vpc", "{\"fqn\":\"@aws-cdk/aws-ec2.VpcNetworkRef\"}")]
        public virtual VpcNetworkRef Vpc
        {
            get => GetInstanceProperty<VpcNetworkRef>();
            set => SetInstanceProperty(value);
        }
    }
}