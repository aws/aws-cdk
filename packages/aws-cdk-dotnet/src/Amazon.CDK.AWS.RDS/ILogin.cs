using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.RDS
{
    /// <summary>Username and password combination</summary>
    [JsiiInterface(typeof(ILogin), "@aws-cdk/aws-rds.Login")]
    public interface ILogin
    {
        /// <summary>Username</summary>
        [JsiiProperty("username", "{\"fqn\":\"@aws-cdk/aws-rds.Username\"}")]
        Username Username
        {
            get;
            set;
        }

        /// <summary>
        /// Password
        /// 
        /// Do not put passwords in your CDK code directly. Import it from a Stack
        /// Parameter or the SSM Parameter Store instead.
        /// </summary>
        [JsiiProperty("password", "{\"fqn\":\"@aws-cdk/aws-rds.Password\"}")]
        Password Password
        {
            get;
            set;
        }
    }
}