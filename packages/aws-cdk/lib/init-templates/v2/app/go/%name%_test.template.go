package main

import (
	"testing"

	"github.com/aws/aws-cdk-go/awscdk/v2"
	assertions "github.com/aws/aws-cdk-go/awscdkassertionsalpha/v2"
	"github.com/aws/jsii-runtime-go"
)

func Test%name.PascalCased%Stack(t *testing.T) {
	// GIVEN
	app := awscdk.NewApp(nil)

	// WHEN
	stack := New%name.PascalCased%Stack(app, "MyStack", nil)

	// THEN
	template := assertions.Template_FromStack(stack)

	template.HasResourceProperties(jsii.String("AWS::SNS::Topic"), map[string]interface{}{
		"DisplayName": "MyCoolTopic",
	})
}
