using Amazon.CDK;
using Amazon.CDK.AWS.ECS;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.ECS.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ecs-cluster.html </remarks>
    [JsiiClass(typeof(ClusterResource), "@aws-cdk/aws-ecs.cloudformation.ClusterResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-ecs.cloudformation.ClusterResourceProps\",\"optional\":true}}]")]
    public class ClusterResource : Resource
    {
        public ClusterResource(Construct parent, string name, IClusterResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected ClusterResource(ByRefValue reference): base(reference)
        {
        }

        protected ClusterResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(ClusterResource));
        /// <remarks>cloudformation_attribute: Arn</remarks>
        [JsiiProperty("clusterArn", "{\"fqn\":\"@aws-cdk/aws-ecs.ClusterArn\"}")]
        public virtual ClusterArn ClusterArn
        {
            get => GetInstanceProperty<ClusterArn>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}