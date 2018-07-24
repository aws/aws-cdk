using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Logs
{
    /// <summary>Properties for a new LogGroup</summary>
    [JsiiInterfaceProxy(typeof(ILogGroupProps), "@aws-cdk/aws-logs.LogGroupProps")]
    internal class LogGroupPropsProxy : DeputyBase, ILogGroupProps
    {
        private LogGroupPropsProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>Name of the log group.</summary>
        /// <remarks>default: Automatically generated</remarks>
        [JsiiProperty("logGroupName", "{\"primitive\":\"string\",\"optional\":true}")]
        public virtual string LogGroupName
        {
            get => GetInstanceProperty<string>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// How long, in days, the log contents will be retained.
        /// 
        /// To retain all logs, set this value to Infinity.
        /// </summary>
        /// <remarks>default: 730 days (2 years)</remarks>
        [JsiiProperty("retentionDays", "{\"primitive\":\"number\",\"optional\":true}")]
        public virtual double? RetentionDays
        {
            get => GetInstanceProperty<double? >();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// Retain the log group if the stack or containing construct ceases to exist
        /// 
        /// Normally you want to retain the log group so you can diagnose issues
        /// from logs even after a deployment that no longer includes the log group.
        /// In that case, use the normal date-based retention policy to age out your
        /// logs.
        /// </summary>
        /// <remarks>default: true</remarks>
        [JsiiProperty("retainLogGroup", "{\"primitive\":\"boolean\",\"optional\":true}")]
        public virtual bool? RetainLogGroup
        {
            get => GetInstanceProperty<bool? >();
            set => SetInstanceProperty(value);
        }
    }
}