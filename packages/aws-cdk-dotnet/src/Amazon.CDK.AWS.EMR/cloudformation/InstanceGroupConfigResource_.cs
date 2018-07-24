using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.EMR.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emr-instancegroupconfig.html </remarks>
    [JsiiClass(typeof(InstanceGroupConfigResource_), "@aws-cdk/aws-emr.cloudformation.InstanceGroupConfigResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-emr.cloudformation.InstanceGroupConfigResourceProps\"}}]")]
    public class InstanceGroupConfigResource_ : Resource
    {
        public InstanceGroupConfigResource_(Construct parent, string name, IInstanceGroupConfigResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected InstanceGroupConfigResource_(ByRefValue reference): base(reference)
        {
        }

        protected InstanceGroupConfigResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(InstanceGroupConfigResource_));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}