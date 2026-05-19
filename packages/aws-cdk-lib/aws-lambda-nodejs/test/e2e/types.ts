import type { BundlingOptions, ICommandHooks } from '../../lib';
import type { NodejsFunctionProps } from '../../lib/function';

export type SerializableNodejsFunctionProps = Omit<NodejsFunctionProps, 'runtime' | 'entry' | 'bundling'> & {
  entry: string;
  runtime?: RuntimeKey;
  bundling: Omit<BundlingOptions, 'forceDockerBundling' | 'image' | 'commandHooks'> & {
    forceDockerBundling: boolean;
    commandHooks?: {[K in keyof ICommandHooks]: ReturnType<ICommandHooks[K]> };
  };
};

export type RuntimeKey = 'NODEJS_LATEST' | 'NODEJS_20_X' | 'NODEJS_22_X' | 'NODEJS_24_X';
