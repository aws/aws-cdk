import { existingType, ambientType } from './type';
import { InstalledModule } from './source-module';

export const CONSTRUCT = existingType('Construct', new InstalledModule('constructs'));
export const RESOURCE = existingType('Resource', new InstalledModule('@aws-cdk/core'));
export const DURATION = existingType('Duration', new InstalledModule('@aws-cdk/core'));
export const STRING = ambientType('string');
export const NUMBER = ambientType('number');
export const BOOLEAN = ambientType('boolean');
export const ANY = ambientType('any');
