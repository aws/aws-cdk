import { Template } from './template';
export declare function findConditions(template: Template, logicalId: string, props?: any): {
    [key: string]: {
        [key: string]: any;
    };
};
export declare function hasCondition(template: Template, logicalId: string, props: any): string | void;
