using Amazon.CDK;
using Amazon.CDK.AWS.ServiceCatalog;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.ServiceCatalog.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-servicecatalog-cloudformationprovisionedproduct.html </remarks>
    [JsiiClass(typeof(CloudFormationProvisionedProductResource_), "@aws-cdk/aws-servicecatalog.cloudformation.CloudFormationProvisionedProductResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-servicecatalog.cloudformation.CloudFormationProvisionedProductResourceProps\",\"optional\":true}}]")]
    public class CloudFormationProvisionedProductResource_ : Resource
    {
        public CloudFormationProvisionedProductResource_(Construct parent, string name, ICloudFormationProvisionedProductResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected CloudFormationProvisionedProductResource_(ByRefValue reference): base(reference)
        {
        }

        protected CloudFormationProvisionedProductResource_(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(CloudFormationProvisionedProductResource_));
        /// <remarks>cloudformation_attribute: CloudformationStackArn</remarks>
        [JsiiProperty("cloudFormationProvisionedProductCloudformationStackArn", "{\"fqn\":\"@aws-cdk/aws-servicecatalog.CloudFormationProvisionedProductCloudformationStackArn\"}")]
        public virtual CloudFormationProvisionedProductCloudformationStackArn CloudFormationProvisionedProductCloudformationStackArn
        {
            get => GetInstanceProperty<CloudFormationProvisionedProductCloudformationStackArn>();
        }

        /// <remarks>cloudformation_attribute: RecordId</remarks>
        [JsiiProperty("cloudFormationProvisionedProductRecordId", "{\"fqn\":\"@aws-cdk/aws-servicecatalog.CloudFormationProvisionedProductRecordId\"}")]
        public virtual CloudFormationProvisionedProductRecordId CloudFormationProvisionedProductRecordId
        {
            get => GetInstanceProperty<CloudFormationProvisionedProductRecordId>();
        }

        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}