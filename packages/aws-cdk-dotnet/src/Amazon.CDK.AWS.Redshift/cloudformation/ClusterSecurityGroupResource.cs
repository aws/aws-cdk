using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.Redshift.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-redshift-clustersecuritygroup.html </remarks>
    [JsiiClass(typeof(ClusterSecurityGroupResource), "@aws-cdk/aws-redshift.cloudformation.ClusterSecurityGroupResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-redshift.cloudformation.ClusterSecurityGroupResourceProps\"}}]")]
    public class ClusterSecurityGroupResource : Resource
    {
        public ClusterSecurityGroupResource(Construct parent, string name, IClusterSecurityGroupResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected ClusterSecurityGroupResource(ByRefValue reference): base(reference)
        {
        }

        protected ClusterSecurityGroupResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(ClusterSecurityGroupResource));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}