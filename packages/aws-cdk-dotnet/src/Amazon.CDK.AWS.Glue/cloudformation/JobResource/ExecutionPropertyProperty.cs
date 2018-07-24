using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Glue.cloudformation.JobResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-job-executionproperty.html </remarks>
    public class ExecutionPropertyProperty : DeputyBase, IExecutionPropertyProperty
    {
        /// <summary>``JobResource.ExecutionPropertyProperty.MaxConcurrentRuns``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-job-executionproperty.html#cfn-glue-job-executionproperty-maxconcurrentruns </remarks>
        [JsiiProperty("maxConcurrentRuns", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object MaxConcurrentRuns
        {
            get;
            set;
        }
    }
}