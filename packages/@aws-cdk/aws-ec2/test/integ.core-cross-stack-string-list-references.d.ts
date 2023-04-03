import { CfnParameter, StackProps } from '@aws-cdk/core';
export interface consumerDeployProps extends StackProps {
    stringListGetAtt: string[];
    stringListRef: CfnParameter;
    manualStringList: string[];
}
