import { Module, ClassType, TypeScriptRenderer, PropertySpec, Type } from '@cdklabs/typewriter';

export abstract class FrameworkGenerator {
  /**
   * Generates a CdkHandler class that can be rendered to produce code.
   */
  public static generateCdkHandler() {
    return new (class CdkHandlerGenerator extends FrameworkGenerator {
      public constructor() {
        const module = new Module('cdk-handler');

        const codeDirectoryProperty: PropertySpec = {
          name: 'codeDirectory',
          type: Type.STRING,
        };

        new ClassType(module, {
          name: 'CdkHandler',
          properties: [codeDirectoryProperty],
        });
        super(module);
      }
    })();
  }

  public readonly renderer = new TypeScriptRenderer();

  protected constructor(public readonly module: Module) {}

  /**
   * Render code for the framework.
   */
  public render() {
    return this.renderer.render(this.module);
  };
}
