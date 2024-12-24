import type { ForReading as PluginForReading, ForWriting as PluginForWriting } from '@aws-cdk/cli-plugin-contract';

export enum Mode {
  ForReading = 0 satisfies PluginForReading,
  ForWriting = 1 satisfies PluginForWriting,
}
