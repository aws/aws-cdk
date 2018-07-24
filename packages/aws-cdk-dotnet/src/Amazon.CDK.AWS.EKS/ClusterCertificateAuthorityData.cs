using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.EKS
{
    [JsiiClass(typeof(ClusterCertificateAuthorityData), "@aws-cdk/aws-eks.ClusterCertificateAuthorityData", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class ClusterCertificateAuthorityData : Token
    {
        public ClusterCertificateAuthorityData(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected ClusterCertificateAuthorityData(ByRefValue reference): base(reference)
        {
        }

        protected ClusterCertificateAuthorityData(DeputyProps props): base(props)
        {
        }
    }
}