using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.EMR.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-elasticmapreduce-instancefleetconfig.html </remarks>
    [JsiiClass(typeof(InstanceFleetConfigResource_), "@aws-cdk/aws-emr.cloudformation.InstanceFleetConfigResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-emr.cloudformation.InstanceFleetConfigResourceProps\"}}]")]
    public class InstanceFleetConfigResource_ : Resource
    {
        public InstanceFleetConfigResource_(Construct parent, string name, IInstanceFleetConfigResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected InstanceFleetConfigResource_(ByRefValue reference): base(reference)
        {
        }

        protected InstanceFleetConfigResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(InstanceFleetConfigResource_));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}