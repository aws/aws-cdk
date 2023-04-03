import { Template } from './template';
export declare function findResources(template: Template, type: string, props?: any): {
    [key: string]: {
        [key: string]: any;
    };
};
export declare function allResources(template: Template, type: string, props: any): string | void;
export declare function allResourcesProperties(template: Template, type: string, props: any): string | void;
export declare function hasResource(template: Template, type: string, props: any): string | void;
export declare function hasResourceProperties(template: Template, type: string, props: any): string | void;
export declare function countResources(template: Template, type: string): number;
export declare function countResourcesProperties(template: Template, type: string, props: any): number;
