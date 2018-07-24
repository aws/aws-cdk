using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.Elasticsearch
{
    [JsiiClass(typeof(DomainEndpoint), "@aws-cdk/aws-elasticsearch.DomainEndpoint", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class DomainEndpoint : Token
    {
        public DomainEndpoint(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected DomainEndpoint(ByRefValue reference): base(reference)
        {
        }

        protected DomainEndpoint(DeputyProps props): base(props)
        {
        }
    }
}