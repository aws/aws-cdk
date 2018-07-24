using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.DMS.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-replicationtask.html </remarks>
    [JsiiClass(typeof(ReplicationTaskResource), "@aws-cdk/aws-dms.cloudformation.ReplicationTaskResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-dms.cloudformation.ReplicationTaskResourceProps\"}}]")]
    public class ReplicationTaskResource : Resource
    {
        public ReplicationTaskResource(Construct parent, string name, IReplicationTaskResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected ReplicationTaskResource(ByRefValue reference): base(reference)
        {
        }

        protected ReplicationTaskResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(ReplicationTaskResource));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}