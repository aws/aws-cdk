import { IResolvable, IResolveContext, Token } from '@aws-cdk/core';
import { namespaceName } from '../codepipeline/private/outputs';

// const STEP_OUTPUT_SYM = Symbol.for('@aws-cdk/pipelines.AssetStepOutput');

// const PRODUCED_OUTPUTS_SYM = Symbol.for('@aws-cdk/pipelines.outputs');


// const PRODUCED_OUTPUTS_SYM = Symbol.for('@aws-cdk/pipelines.outputs');

export class AssetStepOutput implements IResolvable {
  public static addAssetStepExporter(stepId: string, variable: string) {
    const stepIds = AssetStepOutput.exportedVariables.get(variable) ?? [];
    stepIds.push(stepId);
    AssetStepOutput.exportedVariables.set(variable, stepIds);
  }

  public static hasAssetStepExports() {
    return AssetStepOutput.exportedVariables.size > 0;
  }

  public static getAssetStepExportedVariables() {
    return [...AssetStepOutput.exportedVariables.keys()];
  }

  public static isAssetStepOutputToken(token: string) {
    return AssetStepOutput.tokens.includes(token);
  }

  private static exportedVariables: Map<string, any[]> = new Map();
  private static tokens: string[] = [];

  // private resolution: any = undefined;
  public readonly creationStack: string[] = [];
  /**
     * Name of the engine for which this output is intended
     */
  public readonly engineName: string;

  /**
     * Additional data on the output, to be interpreted by the engine
     */
  public readonly engineSpecificInformation: any;


  constructor(engineName: string, engineSpecificInformation: any) {
    this.engineName = engineName;
    this.engineSpecificInformation = engineSpecificInformation;
    if (!AssetStepOutput.exportedVariables.get(engineSpecificInformation)) {
      AssetStepOutput.exportedVariables.set(engineSpecificInformation, []);
    }
    //Object.defineProperty(this, STEP_OUTPUT_SYM, { value: true });
  }

  public resolve(_context: IResolveContext) {
    const references = AssetStepOutput.exportedVariables.get(this.engineSpecificInformation)?.map(stepId => {
      return `#{${namespaceName('Assets', stepId)}.${this.engineSpecificInformation}}`;
    });
    return (references?.join(',') as any);
  }

  public toString(): string {
    const tokenString = Token.asString(this);
    AssetStepOutput.tokens.push(tokenString);
    return tokenString;
  }

}
