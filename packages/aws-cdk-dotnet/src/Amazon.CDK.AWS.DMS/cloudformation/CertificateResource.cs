using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using System.Collections.Generic;

namespace Amazon.CDK.AWS.DMS.cloudformation
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dms-certificate.html </remarks>
    [JsiiClass(typeof(CertificateResource), "@aws-cdk/aws-dms.cloudformation.CertificateResource", "[{\"name\":\"parent\",\"type\":{\"fqn\":\"@aws-cdk/cdk.Construct\"}},{\"name\":\"name\",\"type\":{\"primitive\":\"string\"}},{\"name\":\"properties\",\"type\":{\"fqn\":\"@aws-cdk/aws-dms.cloudformation.CertificateResourceProps\",\"optional\":true}}]")]
    public class CertificateResource : Resource
    {
        public CertificateResource(Construct parent, string name, ICertificateResourceProps properties): base(new DeputyProps(new object[]{parent, name, properties}))
        {
        }

        protected CertificateResource(ByRefValue reference): base(reference)
        {
        }

        protected CertificateResource(DeputyProps props): base(props)
        {
        }

        /// <summary>The CloudFormation resource type name for this resource class.</summary>
        [JsiiProperty("resourceTypeName", "{\"primitive\":\"string\"}")]
        public static string ResourceTypeName
        {
            get;
        }

        = GetStaticProperty<string>(typeof(CertificateResource));
        [JsiiMethod("renderProperties", "{\"collection\":{\"kind\":\"map\",\"elementtype\":{\"primitive\":\"any\"}}}", "[]")]
        protected override IDictionary<string, object> RenderProperties()
        {
            return InvokeInstanceMethod<IDictionary<string, object>>(new object[]{});
        }
    }
}