using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Logs
{
    /// <summary>A filter that extracts information from CloudWatch Logs and emits to CloudWatch Metrics</summary>
    [JsiiClass(typeof(MetricFilter), "@aws-cdk/aws-logs.MetricFilter", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"id\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"props\",\"type\":{\"fqn\":\"@aws-cdk/aws-logs.MetricFilterProps\"}}]")]
    public class MetricFilter : Construct
    {
        public MetricFilter(Construct parent, string id, IMetricFilterProps props): base(new DeputyProps(new object[]{parent, id, props}))
        {
        }

        protected MetricFilter(ByRefValue reference): base(reference)
        {
        }

        protected MetricFilter(DeputyProps props): base(props)
        {
        }
    }
}