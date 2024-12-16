import type { CliConfig } from '@aws-cdk/yargs-gen';
import { makeConfig } from './config';

// Helper type to extract option type based on yargs option definition
type OptionType<T> = T extends { type: 'boolean' } ? boolean :
  T extends { type: 'string' } ? string :
    T extends { type: 'number' } ? number :
      T extends { type: 'array' } ? string[] :
        never;

// Extract types from options object
export type ExtractOptionsType<T> = {
  [K in keyof T]: OptionType<T[K]>
}

// Generate command specific options including global options
type CommandOptions<T extends CliConfig, K extends keyof T['commands']> =
  ExtractOptionsType<T['globalOptions']> &
  (T['commands'][K] extends { options: any } ? ExtractOptionsType<T['commands'][K]['options']> : {});

// Generate the full CLI options type
type GenerateCliOptions<T extends CliConfig> = {
  [K in keyof T['commands']]: CommandOptions<T, K>
}

export type CliOptions = GenerateCliOptions<ReturnType<typeof makeConfig>>;
