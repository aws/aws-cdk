using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>Amazon Linux image properties</summary>
    [JsiiInterfaceProxy(typeof(IAmazonLinuxImageProps), "@aws-cdk/aws-ec2.AmazonLinuxImageProps")]
    internal class AmazonLinuxImagePropsProxy : DeputyBase, IAmazonLinuxImageProps
    {
        private AmazonLinuxImagePropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>What edition of Amazon Linux to use</summary>
        /// <remarks>default: Standard</remarks>
        [JsiiProperty("edition", "{\"fqn\":\"@aws-cdk/aws-ec2.AmazonLinuxEdition\",\"optional\":true}")]
        public virtual AmazonLinuxEdition Edition
        {
            get => GetInstanceProperty<AmazonLinuxEdition>();
            set => SetInstanceProperty(value);
        }

        /// <summary>Virtualization type</summary>
        /// <remarks>default: HVM</remarks>
        [JsiiProperty("virtualization", "{\"fqn\":\"@aws-cdk/aws-ec2.AmazonLinuxVirt\",\"optional\":true}")]
        public virtual AmazonLinuxVirt Virtualization
        {
            get => GetInstanceProperty<AmazonLinuxVirt>();
            set => SetInstanceProperty(value);
        }

        /// <summary>What storage backed image to use</summary>
        /// <remarks>default: GeneralPurpose</remarks>
        [JsiiProperty("storage", "{\"fqn\":\"@aws-cdk/aws-ec2.AmazonLinuxStorage\",\"optional\":true}")]
        public virtual AmazonLinuxStorage Storage
        {
            get => GetInstanceProperty<AmazonLinuxStorage>();
            set => SetInstanceProperty(value);
        }
    }
}