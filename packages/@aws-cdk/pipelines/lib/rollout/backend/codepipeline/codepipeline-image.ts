import * as codebuild from '@aws-cdk/aws-codebuild';
import { CommandImage } from '../../shared';

export abstract class CodePipelineImage extends CommandImage {
  public static fromCodeBuildImage(image: codebuild.IBuildImage): CodePipelineImage {
    return new class extends CodePipelineImage {
      public readonly codeBuildImage = image;
    }();
  }

  public abstract readonly codeBuildImage?: codebuild.IBuildImage;
}