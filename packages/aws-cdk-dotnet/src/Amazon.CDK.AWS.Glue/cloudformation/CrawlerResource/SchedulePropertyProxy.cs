using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Glue.cloudformation.CrawlerResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-schedule.html </remarks>
    [JsiiInterfaceProxy(typeof(IScheduleProperty), "@aws-cdk/aws-glue.cloudformation.CrawlerResource.ScheduleProperty")]
    internal class SchedulePropertyProxy : DeputyBase, IScheduleProperty
    {
        private SchedulePropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``CrawlerResource.ScheduleProperty.ScheduleExpression``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-crawler-schedule.html#cfn-glue-crawler-schedule-scheduleexpression </remarks>
        [JsiiProperty("scheduleExpression", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object ScheduleExpression
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}