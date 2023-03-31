import { CfnParameter, StackProps } from 'aws-cdk-lib';
export interface consumerDeployProps extends StackProps {
    stringListGetAtt: string[];
    stringListRef: CfnParameter;
    manualStringList: string[];
}
