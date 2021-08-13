module %name%

go 1.16

require (
  github.com/aws/aws-cdk-go/awscdk/v2 v%cdk-version%
  github.com/aws/constructs-go/constructs/v10 v10.0.5
  github.com/aws/jsii-runtime-go v1.29.0

  // for testing
  github.com/tidwall/gjson v1.7.4
  github.com/stretchr/testify v1.7.0
)
