import { Template } from './template';
export declare function findOutputs(template: Template, logicalId: string, props?: any): {
    [key: string]: {
        [key: string]: any;
    };
};
export declare function hasOutput(template: Template, logicalId: string, props: any): string | void;
