using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.DMS
{
    [JsiiClass(typeof(EndpointExternalId), "@aws-cdk/aws-dms.EndpointExternalId", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class EndpointExternalId : Token
    {
        public EndpointExternalId(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected EndpointExternalId(ByRefValue reference): base(reference)
        {
        }

        protected EndpointExternalId(DeputyProps props): base(props)
        {
        }
    }
}