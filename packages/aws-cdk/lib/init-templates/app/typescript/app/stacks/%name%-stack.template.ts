import * as cdk from '@aws-cdk/core';

export interface %name.PascalCased%StackProps extends cdk.StackProps {
  // Place your stack configuration here
}

export class %name.PascalCased%Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: %name.PascalCased%StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    // Consider creating reusable construct classes 
    // and place the inside the constructs folder
  }
}
