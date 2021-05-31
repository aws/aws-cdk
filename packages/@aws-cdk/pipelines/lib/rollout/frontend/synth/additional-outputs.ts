export abstract class AdditionalBuildOutput {
  public static fromDirectory(directory: string): AdditionalBuildOutput {
    return {
      baseDirectory: directory,
    };
  }

  public abstract readonly baseDirectory: string;
}

