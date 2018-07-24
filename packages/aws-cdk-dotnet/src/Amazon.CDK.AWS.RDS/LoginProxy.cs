using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.RDS
{
    /// <summary>Username and password combination</summary>
    [JsiiInterfaceProxy(typeof(ILogin), "@aws-cdk/aws-rds.Login")]
    internal class LoginProxy : DeputyBase, ILogin
    {
        private LoginProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>Username</summary>
        [JsiiProperty("username", "{\"fqn\":\"@aws-cdk/aws-rds.Username\"}")]
        public virtual Username Username
        {
            get => GetInstanceProperty<Username>();
            set => SetInstanceProperty(value);
        }

        /// <summary>
        /// Password
        /// 
        /// Do not put passwords in your CDK code directly. Import it from a Stack
        /// Parameter or the SSM Parameter Store instead.
        /// </summary>
        [JsiiProperty("password", "{\"fqn\":\"@aws-cdk/aws-rds.Password\"}")]
        public virtual Password Password
        {
            get => GetInstanceProperty<Password>();
            set => SetInstanceProperty(value);
        }
    }
}