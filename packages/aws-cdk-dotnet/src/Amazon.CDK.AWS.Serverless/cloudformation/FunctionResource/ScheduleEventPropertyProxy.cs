using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Serverless.cloudformation.FunctionResource
{
    /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#schedule </remarks>
    [JsiiInterfaceProxy(typeof(IScheduleEventProperty), "@aws-cdk/aws-serverless.cloudformation.FunctionResource.ScheduleEventProperty")]
    internal class ScheduleEventPropertyProxy : DeputyBase, IScheduleEventProperty
    {
        private ScheduleEventPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``FunctionResource.ScheduleEventProperty.Input``</summary>
        /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#schedule </remarks>
        [JsiiProperty("input", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object Input
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``FunctionResource.ScheduleEventProperty.Schedule``</summary>
        /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#schedule </remarks>
        [JsiiProperty("schedule", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object Schedule
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}