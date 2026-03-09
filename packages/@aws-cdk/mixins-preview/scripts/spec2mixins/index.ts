// Thin wrapper — the implementation lives in @aws-cdk/spec2cdk
import { cfnPropMixins } from '@aws-cdk/spec2cdk';
import type { GeneratorResult } from '@aws-cdk/spec2cdk/lib/module-topology';
import { MIXINS_PREVIEW_BASE_NAMES } from '../config';

export { MixinsBuilder } from '@aws-cdk/spec2cdk/lib/cfn-prop-mixins';
export type { MixinsBuilderProps } from '@aws-cdk/spec2cdk/lib/cfn-prop-mixins';

type GenerateOptions = Pick<cfnPropMixins.MixinsGenerateOptions, 'outputPath' | 'clearOutput' | 'debug'>;

export async function generateAll(options: GenerateOptions): Promise<GeneratorResult> {
  return cfnPropMixins.generateAll({ ...options, packageBases: MIXINS_PREVIEW_BASE_NAMES });
}
