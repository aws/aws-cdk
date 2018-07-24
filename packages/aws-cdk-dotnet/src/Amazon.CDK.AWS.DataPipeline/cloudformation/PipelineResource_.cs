using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.DataPipeline.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-datapipeline-pipeline.html </remarks>
    [JsiiClass(typeof(PipelineResource_), "@aws-cdk/aws-datapipeline.cloudformation.PipelineResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-datapipeline.cloudformation.PipelineResourceProps\"}}]")]
    public class PipelineResource_ : Resource
    {
        public PipelineResource_(Construct parent, string name, IPipelineResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected PipelineResource_(ByRefValue reference): base(reference)
        {
        }

        protected PipelineResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(PipelineResource_));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}