# Welcome to your CDK C# project!

You should explore the contents of this project. It demonstrates a CDK app with two instances of
a stack (`%name.PascalCased%Stack`) which also uses a user-defined construct (`%name.PascalCased%Construct`).

The `cdk.json` file tells the CDK Toolkit how to execute your app.

It uses the [.NET Core CLI](https://docs.microsoft.com/dotnet/articles/core/) to compile and execute your project.

## Useful commands

* `dotnet build src` compile this app
* `cdk ls`           list all stacks in the app
* `cdk synth %name.PascalCased%Stack-1`  emits the synthesized CloudFormation template for the first stack
* `cdk deploy %name.PascalCased%Stack-1` deploy this stack to your default AWS account/region
* `cdk diff %name.PascalCased%Stack-1`   compare deployed stack with current state
* `cdk docs`         open CDK documentation

Enjoy!
