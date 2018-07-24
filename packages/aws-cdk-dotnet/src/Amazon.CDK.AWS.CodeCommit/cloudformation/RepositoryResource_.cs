using Amazon.CDK;
using Amazon.CDK.AWS.CodeCommit;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.CodeCommit.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codecommit-repository.html </remarks>
    [JsiiClass(typeof(RepositoryResource_), "@aws-cdk/aws-codecommit.cloudformation.RepositoryResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-codecommit.cloudformation.RepositoryResourceProps\"}}]")]
    public class RepositoryResource_ : Resource
    {
        public RepositoryResource_(Construct parent, string name, IRepositoryResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected RepositoryResource_(ByRefValue reference): base(reference)
        {
        }

        protected RepositoryResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(RepositoryResource_));
        /// <remarks>cloudformation_attribute: Arn</remarks>
        [JsiiProperty("repositoryArn", "{\"fqn\":\"@aws-cdk/aws-codecommit.RepositoryArn\"}")]
        public virtual RepositoryArn RepositoryArn
        {
            get => GetInstanceProperty<RepositoryArn>();
        }

        /// <remarks>cloudformation_attribute: CloneUrlHttp</remarks>
        [JsiiProperty("repositoryCloneUrlHttp", "{\"fqn\":\"@aws-cdk/aws-codecommit.RepositoryCloneUrlHttp\"}")]
        public virtual RepositoryCloneUrlHttp RepositoryCloneUrlHttp
        {
            get => GetInstanceProperty<RepositoryCloneUrlHttp>();
        }

        /// <remarks>cloudformation_attribute: CloneUrlSsh</remarks>
        [JsiiProperty("repositoryCloneUrlSsh", "{\"fqn\":\"@aws-cdk/aws-codecommit.RepositoryCloneUrlSsh\"}")]
        public virtual RepositoryCloneUrlSsh RepositoryCloneUrlSsh
        {
            get => GetInstanceProperty<RepositoryCloneUrlSsh>();
        }

        /// <remarks>cloudformation_attribute: Name</remarks>
        [JsiiProperty("repositoryName", "{\"fqn\":\"@aws-cdk/aws-codecommit.RepositoryName\"}")]
        public virtual RepositoryName RepositoryName
        {
            get => GetInstanceProperty<RepositoryName>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}