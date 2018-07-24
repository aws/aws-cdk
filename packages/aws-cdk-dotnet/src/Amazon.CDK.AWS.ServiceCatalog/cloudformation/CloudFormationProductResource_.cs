using Amazon.CDK;
using Amazon.CDK.AWS.ServiceCatalog;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.ServiceCatalog.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationproduct.html </remarks>
    [JsiiClass(typeof(CloudFormationProductResource_), "@aws-cdk/aws-servicecatalog.cloudformation.CloudFormationProductResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-servicecatalog.cloudformation.CloudFormationProductResourceProps\"}}]")]
    public class CloudFormationProductResource_ : Resource
    {
        public CloudFormationProductResource_(Construct parent, string name, ICloudFormationProductResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected CloudFormationProductResource_(ByRefValue reference): base(reference)
        {
        }

        protected CloudFormationProductResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(CloudFormationProductResource_));
        /// <remarks>cloudformation_attribute: ProductName</remarks>
        [JsiiProperty("cloudFormationProductProductName", "{\"fqn\":\"@aws-cdk/aws-servicecatalog.CloudFormationProductProductName\"}")]
        public virtual CloudFormationProductProductName CloudFormationProductProductName
        {
            get => GetInstanceProperty<CloudFormationProductProductName>();
        }

        /// <remarks>cloudformation_attribute: ProvisioningArtifactIds</remarks>
        [JsiiProperty("cloudFormationProductProvisioningArtifactIds", "{\"fqn\":\"@aws-cdk/aws-servicecatalog.CloudFormationProductProvisioningArtifactIds\"}")]
        public virtual CloudFormationProductProvisioningArtifactIds CloudFormationProductProvisioningArtifactIds
        {
            get => GetInstanceProperty<CloudFormationProductProvisioningArtifactIds>();
        }

        /// <remarks>cloudformation_attribute: ProvisioningArtifactNames</remarks>
        [JsiiProperty("cloudFormationProductProvisioningArtifactNames", "{\"fqn\":\"@aws-cdk/aws-servicecatalog.CloudFormationProductProvisioningArtifactNames\"}")]
        public virtual CloudFormationProductProvisioningArtifactNames CloudFormationProductProvisioningArtifactNames
        {
            get => GetInstanceProperty<CloudFormationProductProvisioningArtifactNames>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}