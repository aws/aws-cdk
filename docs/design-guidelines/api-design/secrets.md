## Secrets

If you expect a secret in your API (such as passwords, tokens), use the
**cdk.SecretValue** class to signal to users that they should not include
secrets in their CDK code or templates.

If a property is named “password” it must use the **SecretValue** type
[_awslint:secret-password_].  If a property has the word “token” in it, it must
use the SecretValue type [_awslint:secret-token_].
