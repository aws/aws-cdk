using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.OpsWorks.cloudformation.StackResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-rdsdbinstance.html </remarks>
    [JsiiInterface(typeof(IRdsDbInstanceProperty), "@aws-cdk/aws-opsworks.cloudformation.StackResource.RdsDbInstanceProperty")]
    public interface IRdsDbInstanceProperty
    {
        /// <summary>``StackResource.RdsDbInstanceProperty.DbPassword``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-rdsdbinstance.html#cfn-opsworks-stack-rdsdbinstance-dbpassword </remarks>
        [JsiiProperty("dbPassword", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object DbPassword
        {
            get;
            set;
        }

        /// <summary>``StackResource.RdsDbInstanceProperty.DbUser``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-rdsdbinstance.html#cfn-opsworks-stack-rdsdbinstance-dbuser </remarks>
        [JsiiProperty("dbUser", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object DbUser
        {
            get;
            set;
        }

        /// <summary>``StackResource.RdsDbInstanceProperty.RdsDbInstanceArn``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-stack-rdsdbinstance.html#cfn-opsworks-stack-rdsdbinstance-rdsdbinstancearn </remarks>
        [JsiiProperty("rdsDbInstanceArn", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object RdsDbInstanceArn
        {
            get;
            set;
        }
    }
}