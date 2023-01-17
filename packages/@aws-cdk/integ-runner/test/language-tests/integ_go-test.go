package main

import (
	"github.com/aws/aws-cdk-go/awscdk/v2"
	"github.com/aws/aws-cdk-go/awscdk/v2/awssqs"
	"github.com/aws/aws-cdk-go/awscdkintegtestsalpha/v2"
	"github.com/aws/jsii-runtime-go"
)

func main() {
	defer jsii.Close()

	app := awscdk.NewApp(nil)
	stack := awscdk.NewStack(app, jsii.String("GoLangStack"), nil)

	queue := awssqs.NewQueue(stack, jsii.String("Queue"), &awssqs.QueueProps{
		Fifo: jsii.Bool(true),
	})

	integ := awscdkintegtestsalpha.NewIntegTest(app, jsii.String("GoLang"), &awscdkintegtestsalpha.IntegTestProps{
		TestCases: &[]awscdk.Stack{
			stack,
		},
	})

	integ.Assertions().AwsApiCall(
		jsii.String("SQS"),
		jsii.String("getQueueAttributes"),
		struct {
			QueueUrl       *string
			AttributeNames []string
		}{
			QueueUrl:       queue.QueueUrl(),
			AttributeNames: []string{"QueueArn"},
		},
		&[]*string{},
	).AssertAtPath(
		jsii.String("Attributes.QueueArn"),
		awscdkintegtestsalpha.ExpectedResult_StringLikeRegexp(jsii.String(".*\\.fifo$")),
	)

	app.Synth(nil)
}
