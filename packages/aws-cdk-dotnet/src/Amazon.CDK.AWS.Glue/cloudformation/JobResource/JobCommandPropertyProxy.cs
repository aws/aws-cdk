using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Glue.cloudformation.JobResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-job-jobcommand.html </remarks>
    [JsiiInterfaceProxy(typeof(IJobCommandProperty), "@aws-cdk/aws-glue.cloudformation.JobResource.JobCommandProperty")]
    internal class JobCommandPropertyProxy : DeputyBase, IJobCommandProperty
    {
        private JobCommandPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``JobResource.JobCommandProperty.Name``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-job-jobcommand.html#cfn-glue-job-jobcommand-name </remarks>
        [JsiiProperty("name", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object Name
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``JobResource.JobCommandProperty.ScriptLocation``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-job-jobcommand.html#cfn-glue-job-jobcommand-scriptlocation </remarks>
        [JsiiProperty("scriptLocation", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object ScriptLocation
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}