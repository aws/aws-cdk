using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Glue.cloudformation.JobResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-job-connectionslist.html </remarks>
    [JsiiInterface(typeof(IConnectionsListProperty), "@aws-cdk/aws-glue.cloudformation.JobResource.ConnectionsListProperty")]
    public interface IConnectionsListProperty
    {
        /// <summary>``JobResource.ConnectionsListProperty.Connections``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-glue-job-connectionslist.html#cfn-glue-job-connectionslist-connections </remarks>
        [JsiiProperty("connections", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object Connections
        {
            get;
            set;
        }
    }
}