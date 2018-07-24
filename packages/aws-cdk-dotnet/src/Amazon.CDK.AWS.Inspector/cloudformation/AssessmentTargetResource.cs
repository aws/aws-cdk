using Amazon.CDK;
using Amazon.CDK.AWS.Inspector;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.Inspector.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-inspector-assessmenttarget.html </remarks>
    [JsiiClass(typeof(AssessmentTargetResource), "@aws-cdk/aws-inspector.cloudformation.AssessmentTargetResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-inspector.cloudformation.AssessmentTargetResourceProps\"}}]")]
    public class AssessmentTargetResource : Resource
    {
        public AssessmentTargetResource(Construct parent, string name, IAssessmentTargetResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected AssessmentTargetResource(ByRefValue reference): base(reference)
        {
        }

        protected AssessmentTargetResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(AssessmentTargetResource));
        /// <remarks>cloudformation_attribute: Arn</remarks>
        [JsiiProperty("assessmentTargetArn", "{\"fqn\":\"@aws-cdk/aws-inspector.AssessmentTargetArn\"}")]
        public virtual AssessmentTargetArn AssessmentTargetArn
        {
            get => GetInstanceProperty<AssessmentTargetArn>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}