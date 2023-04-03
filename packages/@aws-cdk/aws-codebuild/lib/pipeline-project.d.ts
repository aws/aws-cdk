import { Construct } from 'constructs';
import { CommonProjectProps, Project } from './project';
export interface PipelineProjectProps extends CommonProjectProps {
}
/**
 * A convenience class for CodeBuild Projects that are used in CodePipeline.
 */
export declare class PipelineProject extends Project {
    constructor(scope: Construct, id: string, props?: PipelineProjectProps);
}
