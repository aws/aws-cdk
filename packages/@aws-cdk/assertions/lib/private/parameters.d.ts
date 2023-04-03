import { Template } from './template';
export declare function findParameters(template: Template, logicalId: string, props?: any): {
    [key: string]: {
        [key: string]: any;
    };
};
export declare function hasParameter(template: Template, logicalId: string, props: any): string | void;
