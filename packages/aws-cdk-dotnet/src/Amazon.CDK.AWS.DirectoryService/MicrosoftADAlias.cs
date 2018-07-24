using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.DirectoryService
{
    [JsiiClass(typeof(MicrosoftADAlias), "@aws-cdk/aws-directoryservice.MicrosoftADAlias", "[{\"name\":\"valueOrFunction\",\"type\":{\"primitive\":\"any\",\"optional\":true}}]")]
    public class MicrosoftADAlias : Token
    {
        public MicrosoftADAlias(object valueOrFunction): base(new DeputyProps(new object[]{valueOrFunction}))
        {
        }

        protected MicrosoftADAlias(ByRefValue reference): base(reference)
        {
        }

        protected MicrosoftADAlias(DeputyProps props): base(props)
        {
        }
    }
}