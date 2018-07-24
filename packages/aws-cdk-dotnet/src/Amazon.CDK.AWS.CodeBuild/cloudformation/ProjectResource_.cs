using Amazon.CDK;
using Amazon.CDK.AWS.CodeBuild;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.CodeBuild.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codebuild-project.html </remarks>
    [JsiiClass(typeof(ProjectResource_), "@aws-cdk/aws-codebuild.cloudformation.ProjectResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-codebuild.cloudformation.ProjectResourceProps\"}}]")]
    public class ProjectResource_ : Resource
    {
        public ProjectResource_(Construct parent, string name, IProjectResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected ProjectResource_(ByRefValue reference): base(reference)
        {
        }

        protected ProjectResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(ProjectResource_));
        /// <remarks>cloudformation_attribute: Arn</remarks>
        [JsiiProperty("projectArn", "{\"fqn\":\"@aws-cdk/aws-codebuild.ProjectArn\"}")]
        public virtual ProjectArn ProjectArn
        {
            get => GetInstanceProperty<ProjectArn>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}