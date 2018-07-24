using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK
{
    /// <summary>
    /// When AWS CloudFormation creates the associated resource, configures the number of required success signals and
    /// the length of time that AWS CloudFormation waits for those signals.
    /// </summary>
    [JsiiInterfaceProxy(typeof(IResourceSignal), "@aws-cdk/cdk.ResourceSignal")]
    internal class ResourceSignalProxy : DeputyBase, IResourceSignal
    {
        private ResourceSignalProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>
        /// The number of success signals AWS CloudFormation must receive before it sets the resource status as CREATE_COMPLETE.
        /// If the resource receives a failure signal or doesn't receive the specified number of signals before the timeout period
        /// expires, the resource creation fails and AWS CloudFormation rolls the stack back.
        /// </summary>
        [JsiiProperty("count", "{\"primitive\":\"number\",\"optional\":true}")]
        public virtual double? Count
        {
            get => GetInstanceProperty<double? >();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// The length of time that AWS CloudFormation waits for the number of signals that was specified in the Count property.
        /// The timeout period starts after AWS CloudFormation starts creating the resource, and the timeout expires no sooner
        /// than the time you specify but can occur shortly thereafter. The maximum time that you can specify is 12 hours.
        /// </summary>
        [JsiiProperty("timeout", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string Timeout
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }
    }
}