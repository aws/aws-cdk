import * as cdk from '@aws-cdk/core';
import * as reflect from 'jsii-reflect';
export interface DeclarativeStackProps extends cdk.StackProps {
    typeSystem: reflect.TypeSystem;
    template: any;
    workingDirectory?: string;
}
export declare class DeclarativeStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props: DeclarativeStackProps);
}
