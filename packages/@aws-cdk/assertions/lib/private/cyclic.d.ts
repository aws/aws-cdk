import { Template } from './template';
/**
 * Check a template for cyclic dependencies
 *
 * This will make sure that we don't happily validate templates
 * in unit tests that wouldn't deploy to CloudFormation anyway.
 */
export declare function checkTemplateForCyclicDependencies(template: Template): void;
