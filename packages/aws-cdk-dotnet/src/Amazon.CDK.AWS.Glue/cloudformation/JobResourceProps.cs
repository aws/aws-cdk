using Amazon.CDK;
using Amazon.CDK.AWS.Glue.cloudformation.JobResource;
using AWS.Jsii.Runtime.Deputy;
using Newtonsoft.Json.Linq;

namespace Amazon.CDK.AWS.Glue.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-job.html </remarks>
    public class JobResourceProps : DeputyBase, IJobResourceProps
    {
        /// <summary>``AWS::Glue::Job.Command``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-job.html#cfn-glue-job-command </remarks>
        [JsiiProperty("command", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-glue.cloudformation.JobResource.JobCommandProperty\"}]}}", true)]
        public object Command
        {
            get;
            set;
        }

        /// <summary>``AWS::Glue::Job.Role``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-job.html#cfn-glue-job-role </remarks>
        [JsiiProperty("role", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}", true)]
        public object Role
        {
            get;
            set;
        }

        /// <summary>``AWS::Glue::Job.AllocatedCapacity``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-job.html#cfn-glue-job-allocatedcapacity </remarks>
        [JsiiProperty("allocatedCapacity", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object AllocatedCapacity
        {
            get;
            set;
        }

        /// <summary>``AWS::Glue::Job.Connections``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-job.html#cfn-glue-job-connections </remarks>
        [JsiiProperty("connections", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-glue.cloudformation.JobResource.ConnectionsListProperty\"}]},\"optional\":true}", true)]
        public object Connections
        {
            get;
            set;
        }

        /// <summary>``AWS::Glue::Job.DefaultArguments``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-job.html#cfn-glue-job-defaultarguments </remarks>
        [JsiiProperty("defaultArguments", "{\"union\":{\"types\":[{\"primitive\":\"json\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object DefaultArguments
        {
            get;
            set;
        }

        /// <summary>``AWS::Glue::Job.Description``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-job.html#cfn-glue-job-description </remarks>
        [JsiiProperty("description", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Description
        {
            get;
            set;
        }

        /// <summary>``AWS::Glue::Job.ExecutionProperty``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-job.html#cfn-glue-job-executionproperty </remarks>
        [JsiiProperty("executionProperty", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-glue.cloudformation.JobResource.ExecutionPropertyProperty\"}]},\"optional\":true}", true)]
        public object ExecutionProperty
        {
            get;
            set;
        }

        /// <summary>``AWS::Glue::Job.LogUri``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-job.html#cfn-glue-job-loguri </remarks>
        [JsiiProperty("logUri", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object LogUri
        {
            get;
            set;
        }

        /// <summary>``AWS::Glue::Job.MaxRetries``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-job.html#cfn-glue-job-maxretries </remarks>
        [JsiiProperty("maxRetries", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object MaxRetries
        {
            get;
            set;
        }

        /// <summary>``AWS::Glue::Job.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-glue-job.html#cfn-glue-job-name </remarks>
        [JsiiProperty("jobName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object JobName
        {
            get;
            set;
        }
    }
}