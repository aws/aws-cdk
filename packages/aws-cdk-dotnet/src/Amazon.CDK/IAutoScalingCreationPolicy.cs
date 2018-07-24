using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    /// <summary>
    /// For an Auto Scaling group replacement update, specifies how many instances must signal success for the
    /// update to succeed.
    /// </summary>
    [JsiiInterface(typeof(IAutoScalingCreationPolicy), "@aws-cdk/cdk.AutoScalingCreationPolicy")]
    public interface IAutoScalingCreationPolicy
    {
        /// <summary>
        /// Specifies the percentage of instances in an Auto Scaling replacement update that must signal success for the
        /// update to succeed. You can specify a value from 0 to 100. AWS CloudFormation rounds to the nearest tenth of a percent.
        /// For example, if you update five instances with a minimum successful percentage of 50, three instances must signal success.
        /// If an instance doesn't send a signal within the time specified by the Timeout property, AWS CloudFormation assumes that the
        /// instance wasn't created.
        /// </summary>
        [JsiiProperty("minSuccessfulInstancesPercent", "{\"primitive\":\"number\",\"optional\":true}")]
        double? MinSuccessfulInstancesPercent
        {
            get;
            set;
        }
    }
}