using Amazon.CDK;
using Amazon.CDK.AWS.Inspector;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.Inspector.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-assessmenttemplate.html </remarks>
    [JsiiClass(typeof(AssessmentTemplateResource), "@aws-cdk/aws-inspector.cloudformation.AssessmentTemplateResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-inspector.cloudformation.AssessmentTemplateResourceProps\"}}]")]
    public class AssessmentTemplateResource : Resource
    {
        public AssessmentTemplateResource(Construct parent, string name, IAssessmentTemplateResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected AssessmentTemplateResource(ByRefValue reference): base(reference)
        {
        }

        protected AssessmentTemplateResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(AssessmentTemplateResource));
        /// <remarks>cloudformation_attribute: Arn</remarks>
        [JsiiProperty("assessmentTemplateArn", "{\"fqn\":\"@aws-cdk/aws-inspector.AssessmentTemplateArn\"}")]
        public virtual AssessmentTemplateArn AssessmentTemplateArn
        {
            get => GetInstanceProperty<AssessmentTemplateArn>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}