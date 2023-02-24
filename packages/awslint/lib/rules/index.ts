import { apiLinter } from './api';
import { attributesLinter } from './attributes';
import { cfnResourceLinter } from './cfn-resource';
import { eventsLinter } from './cloudwatch-events';
import { constructLinter } from './construct';
import { docsLinter } from './docs';
import { durationsLinter } from './durations';
import { exportsLinter } from './exports';
import { importsLinter } from './imports';
import { integrationLinter } from './integrations';
import { moduleLinter } from './module';
import { noUnusedTypeLinter } from './no-unused-type';
import { publicStaticPropertiesLinter } from './public-static-properties';
import { resourceLinter } from './resource';
import { AggregateLinter } from '../linter';

export const ALL_RULES_LINTER = new AggregateLinter(
  moduleLinter,
  constructLinter,
  cfnResourceLinter,
  resourceLinter,
  apiLinter,
  importsLinter,
  attributesLinter,
  exportsLinter,
  eventsLinter,
  integrationLinter,
  noUnusedTypeLinter,
  durationsLinter,
  publicStaticPropertiesLinter,
  docsLinter,
);