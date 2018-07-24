using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Serverless.cloudformation.FunctionResource
{
    /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#schedule </remarks>
    public class ScheduleEventProperty : DeputyBase, IScheduleEventProperty
    {
        /// <summary>``FunctionResource.ScheduleEventProperty.Input``</summary>
        /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#schedule </remarks>
        [JsiiProperty("input", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Input
        {
            get;
            set;
        }

        /// <summary>``FunctionResource.ScheduleEventProperty.Schedule``</summary>
        /// <remarks>link: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#schedule </remarks>
        [JsiiProperty("schedule", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object Schedule
        {
            get;
            set;
        }
    }
}