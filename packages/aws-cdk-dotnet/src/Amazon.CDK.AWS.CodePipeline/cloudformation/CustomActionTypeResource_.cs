using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.CodePipeline.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codepipeline-customactiontype.html </remarks>
    [JsiiClass(typeof(CustomActionTypeResource_), "@aws-cdk/aws-codepipeline.cloudformation.CustomActionTypeResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-codepipeline.cloudformation.CustomActionTypeResourceProps\"}}]")]
    public class CustomActionTypeResource_ : Resource
    {
        public CustomActionTypeResource_(Construct parent, string name, ICustomActionTypeResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected CustomActionTypeResource_(ByRefValue reference): base(reference)
        {
        }

        protected CustomActionTypeResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(CustomActionTypeResource_));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}