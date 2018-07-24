using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.SSM.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssm-patchbaseline.html </remarks>
    [JsiiClass(typeof(PatchBaselineResource_), "@aws-cdk/aws-ssm.cloudformation.PatchBaselineResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-ssm.cloudformation.PatchBaselineResourceProps\"}}]")]
    public class PatchBaselineResource_ : Resource
    {
        public PatchBaselineResource_(Construct parent, string name, IPatchBaselineResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected PatchBaselineResource_(ByRefValue reference): base(reference)
        {
        }

        protected PatchBaselineResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(PatchBaselineResource_));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}