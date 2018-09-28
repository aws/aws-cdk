import { cloudformation } from './ecs.generated';

export class LinuxParameters {

  public addCapability() {
    // FIXME
  }

  public dropCapability() {
    // FIXME
  }

  public toLinuxParametersJson(): cloudformation.TaskDefinitionResource.LinuxParametersProperty {
    return {};
  }
}