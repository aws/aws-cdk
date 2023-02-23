import * as reflect from 'jsii-reflect';
import { ConstructReflection } from './construct';
import { CoreTypes } from './core-types';
import { Linter } from '../linter';

export const eventsLinter = new Linter<EventsReflection>(assembly => assembly.classes
  .filter(t => CoreTypes.isConstructClass(t))
  .map(construct => new EventsReflection(construct)));

export class EventsReflection extends ConstructReflection {
  public get directEventMethods() {
    return this.classType.allMethods.filter(isDirectEventMethod);
  }

  public get cloudTrailEventMethods() {
    return this.classType.allMethods.filter(isCloudTrailEventMethod);
  }
}

const ON_EVENT_OPTIONS_FQN = '@aws-cdk/aws-events.OnEventOptions';
const EVENT_RULE_FQN = '@aws-cdk/aws-events.Rule';

eventsLinter.add({
  code: 'events-in-interface',
  message: '\'onXxx()\' methods should also be defined on construct interface',
  eval: e => {
    for (const method of e.ctx.directEventMethods.concat(e.ctx.cloudTrailEventMethods)) {
      e.assert(!e.ctx.interfaceType || e.ctx.interfaceType.allMethods.filter(m => !m.protected).some(m => m.name === method.name), `${e.ctx.fqn}.${method.name}`);
    }
  },
});

eventsLinter.add({
  code: 'events-generic',
  message: 'if there are specific \'onXxx()\' methods, there should also be a generic \'onEvent()\' method',
  eval: e => {
    e.assert(e.ctx.directEventMethods.length === 0 || e.ctx.classType.allMethods.some(m => m.name === 'onEvent'), e.ctx.fqn);
  },
});

eventsLinter.add({
  code: 'events-generic-cloudtrail',
  message: 'if there are specific \'onCloudTrailXxx()\' methods, there should also be a generic \'onCloudTrailEvent()\' method',
  eval: e => {
    e.assert(e.ctx.cloudTrailEventMethods.length === 0 || e.ctx.classType.allMethods.some(m => m.name === 'onCloudTrailEvent'), e.ctx.fqn);
  },
});

eventsLinter.add({
  code: 'events-method-signature',
  message: 'all \'onXxx()\' methods should have the CloudWatch Events signature (id: string, options: events.OnEventOptions = {}) => events.Rule',
  eval: e => {
    for (const method of e.ctx.directEventMethods) {
      // give slack to protected methods like "onSynthesize", "onPrepare", ...
      if (method.protected) {
        continue;
      }
      e.assertSignature(method, {
        parameters: [
          { type: 'string' },
          { type: ON_EVENT_OPTIONS_FQN, subtypeAllowed: true, optional: true },
        ],
        returns: EVENT_RULE_FQN,
      });
    }
  },
});

function isDirectEventMethod(m: reflect.Method) {
  return !m.protected && m.name.startsWith('on') && ! m.name.startsWith('onCloudTrail');
}

function isCloudTrailEventMethod(m: reflect.Method) {
  return m.name.startsWith('onCloudTrail');
}
