using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>Amazon Linux image properties</summary>
    public class AmazonLinuxImageProps : DeputyBase, IAmazonLinuxImageProps
    {
        /// <summary>What edition of Amazon Linux to use</summary>
        /// <remarks>default: Standard</remarks>
        [JsiiProperty("edition", "{\"fqn\":\"@aws-cdk/aws-ec2.AmazonLinuxEdition\",\"optional\":true}", true)]
        public AmazonLinuxEdition Edition
        {
            get;
            set;
        }

        /// <summary>Virtualization type</summary>
        /// <remarks>default: HVM</remarks>
        [JsiiProperty("virtualization", "{\"fqn\":\"@aws-cdk/aws-ec2.AmazonLinuxVirt\",\"optional\":true}", true)]
        public AmazonLinuxVirt Virtualization
        {
            get;
            set;
        }

        /// <summary>What storage backed image to use</summary>
        /// <remarks>default: GeneralPurpose</remarks>
        [JsiiProperty("storage", "{\"fqn\":\"@aws-cdk/aws-ec2.AmazonLinuxStorage\",\"optional\":true}", true)]
        public AmazonLinuxStorage Storage
        {
            get;
            set;
        }
    }
}