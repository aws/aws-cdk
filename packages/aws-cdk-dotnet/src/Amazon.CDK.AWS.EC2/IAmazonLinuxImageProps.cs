using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EC2
{
    /// <summary>Amazon Linux image properties</summary>
    [JsiiInterface(typeof(IAmazonLinuxImageProps), "@aws-cdk/aws-ec2.AmazonLinuxImageProps")]
    public interface IAmazonLinuxImageProps
    {
        /// <summary>What edition of Amazon Linux to use</summary>
        /// <remarks>default: Standard</remarks>
        [JsiiProperty("edition", "{\"fqn\":\"@aws-cdk/aws-ec2.AmazonLinuxEdition\",\"optional\":true}")]
        AmazonLinuxEdition Edition
        {
            get;
            set;
        }

        /// <summary>Virtualization type</summary>
        /// <remarks>default: HVM</remarks>
        [JsiiProperty("virtualization", "{\"fqn\":\"@aws-cdk/aws-ec2.AmazonLinuxVirt\",\"optional\":true}")]
        AmazonLinuxVirt Virtualization
        {
            get;
            set;
        }

        /// <summary>What storage backed image to use</summary>
        /// <remarks>default: GeneralPurpose</remarks>
        [JsiiProperty("storage", "{\"fqn\":\"@aws-cdk/aws-ec2.AmazonLinuxStorage\",\"optional\":true}")]
        AmazonLinuxStorage Storage
        {
            get;
            set;
        }
    }
}