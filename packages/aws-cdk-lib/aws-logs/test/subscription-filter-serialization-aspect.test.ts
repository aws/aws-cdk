import type { Construct } from 'constructs';
import { Match, Template } from '../../assertions';
import type { CfnElement } from '../../core';
import { App, Aspects, Stack, Token } from '../../core';
import type { ILogGroup, ILogSubscriptionDestination } from '../lib';
import { CfnSubscriptionFilter, FilterPattern, LogGroup, SubscriptionFilter, SubscriptionFilterSerializationAspect } from '../lib';

describe('subscription filter serialization aspect', () => {
  test('serializes subscription filters in the same stack into a dependency chain', () => {
    // GIVEN
    const stack = new Stack();
    const filter1 = addFilter(stack, 'Filter1', 'filter-1');
    const filter2 = addFilter(stack, 'Filter2', 'filter-2');
    addFilter(stack, 'Filter3', 'filter-3');

    // WHEN
    Aspects.of(stack).add(new SubscriptionFilterSerializationAspect());

    // THEN
    const template = Template.fromStack(stack);
    template.hasResource('AWS::Logs::SubscriptionFilter', {
      Properties: Match.objectLike({ FilterName: 'filter-1' }),
      DependsOn: Match.absent(),
    });
    template.hasResource('AWS::Logs::SubscriptionFilter', {
      Properties: Match.objectLike({ FilterName: 'filter-2' }),
      DependsOn: [logicalIdOf(stack, filter1)],
    });
    template.hasResource('AWS::Logs::SubscriptionFilter', {
      Properties: Match.objectLike({ FilterName: 'filter-3' }),
      DependsOn: [logicalIdOf(stack, filter2)],
    });
  });

  test('does not add dependencies when there is only one subscription filter', () => {
    // GIVEN
    const stack = new Stack();
    addFilter(stack, 'Filter1', 'filter-1');

    // WHEN
    Aspects.of(stack).add(new SubscriptionFilterSerializationAspect());

    // THEN
    Template.fromStack(stack).hasResource('AWS::Logs::SubscriptionFilter', {
      Properties: Match.objectLike({ FilterName: 'filter-1' }),
      DependsOn: Match.absent(),
    });
  });

  test('serializes subscription filters created through addSubscriptionFilter', () => {
    // GIVEN
    const stack = new Stack();
    const logGroup1 = new LogGroup(stack, 'LogGroup1');
    const logGroup2 = new LogGroup(stack, 'LogGroup2');
    const filter1 = logGroup1.addSubscriptionFilter('Subscription', {
      destination: new FakeDestination(),
      filterPattern: FilterPattern.allEvents(),
      filterName: 'filter-1',
    });
    logGroup2.addSubscriptionFilter('Subscription', {
      destination: new FakeDestination(),
      filterPattern: FilterPattern.allEvents(),
      filterName: 'filter-2',
    });

    // WHEN
    Aspects.of(stack).add(new SubscriptionFilterSerializationAspect());

    // THEN
    Template.fromStack(stack).hasResource('AWS::Logs::SubscriptionFilter', {
      Properties: Match.objectLike({ FilterName: 'filter-2' }),
      DependsOn: [logicalIdOf(stack, filter1)],
    });
  });

  test('serializes raw CfnSubscriptionFilter resources', () => {
    // GIVEN
    const stack = new Stack();
    new CfnSubscriptionFilter(stack, 'Raw1', {
      logGroupName: 'log-group-1',
      destinationArn: 'arn:bogus',
      filterPattern: '',
    });
    new CfnSubscriptionFilter(stack, 'Raw2', {
      logGroupName: 'log-group-2',
      destinationArn: 'arn:bogus',
      filterPattern: '',
    });

    // WHEN
    Aspects.of(stack).add(new SubscriptionFilterSerializationAspect());

    // THEN
    const template = Template.fromStack(stack);
    template.hasResource('AWS::Logs::SubscriptionFilter', {
      Properties: Match.objectLike({ LogGroupName: 'log-group-1' }),
      DependsOn: Match.absent(),
    });
    template.hasResource('AWS::Logs::SubscriptionFilter', {
      Properties: Match.objectLike({ LogGroupName: 'log-group-2' }),
      DependsOn: ['Raw1'],
    });
  });

  test('serializes subscription filters independently per stack when applied to the app', () => {
    // GIVEN
    const app = new App();
    const stack1 = new Stack(app, 'Stack1');
    const stack2 = new Stack(app, 'Stack2');
    const stack1Filter1 = addFilter(stack1, 'Filter1', 'stack1-filter-1');
    addFilter(stack1, 'Filter2', 'stack1-filter-2');
    const stack2Filter1 = addFilter(stack2, 'Filter1', 'stack2-filter-1');
    addFilter(stack2, 'Filter2', 'stack2-filter-2');

    // WHEN
    Aspects.of(app).add(new SubscriptionFilterSerializationAspect());

    // THEN
    const template1 = Template.fromStack(stack1);
    template1.hasResource('AWS::Logs::SubscriptionFilter', {
      Properties: Match.objectLike({ FilterName: 'stack1-filter-1' }),
      DependsOn: Match.absent(),
    });
    template1.hasResource('AWS::Logs::SubscriptionFilter', {
      Properties: Match.objectLike({ FilterName: 'stack1-filter-2' }),
      DependsOn: [logicalIdOf(stack1, stack1Filter1)],
    });
    const template2 = Template.fromStack(stack2);
    template2.hasResource('AWS::Logs::SubscriptionFilter', {
      Properties: Match.objectLike({ FilterName: 'stack2-filter-1' }),
      DependsOn: Match.absent(),
    });
    template2.hasResource('AWS::Logs::SubscriptionFilter', {
      Properties: Match.objectLike({ FilterName: 'stack2-filter-2' }),
      DependsOn: [logicalIdOf(stack2, stack2Filter1)],
    });
  });

  test('does not add dependencies to other resource types', () => {
    // GIVEN
    const stack = new Stack();
    addFilter(stack, 'Filter1', 'filter-1');
    addFilter(stack, 'Filter2', 'filter-2');

    // WHEN
    Aspects.of(stack).add(new SubscriptionFilterSerializationAspect());

    // THEN
    const logGroups = Template.fromStack(stack).findResources('AWS::Logs::LogGroup');
    expect(Object.keys(logGroups).length).toEqual(2);
    for (const logGroup of Object.values(logGroups)) {
      expect(logGroup.DependsOn).toBeUndefined();
    }
  });

  test('splits subscription filters into parallel chains with maxConcurrency', () => {
    // GIVEN
    const stack = new Stack();
    const filters = [1, 2, 3, 4, 5].map((i) => addFilter(stack, `Filter${i}`, `filter-${i}`));

    // WHEN
    Aspects.of(stack).add(new SubscriptionFilterSerializationAspect({ maxConcurrency: 2 }));

    // THEN: round-robin over 2 chains: 1 <- 3 <- 5 and 2 <- 4
    const template = Template.fromStack(stack);
    template.hasResource('AWS::Logs::SubscriptionFilter', {
      Properties: Match.objectLike({ FilterName: 'filter-1' }),
      DependsOn: Match.absent(),
    });
    template.hasResource('AWS::Logs::SubscriptionFilter', {
      Properties: Match.objectLike({ FilterName: 'filter-2' }),
      DependsOn: Match.absent(),
    });
    template.hasResource('AWS::Logs::SubscriptionFilter', {
      Properties: Match.objectLike({ FilterName: 'filter-3' }),
      DependsOn: [logicalIdOf(stack, filters[0])],
    });
    template.hasResource('AWS::Logs::SubscriptionFilter', {
      Properties: Match.objectLike({ FilterName: 'filter-4' }),
      DependsOn: [logicalIdOf(stack, filters[1])],
    });
    template.hasResource('AWS::Logs::SubscriptionFilter', {
      Properties: Match.objectLike({ FilterName: 'filter-5' }),
      DependsOn: [logicalIdOf(stack, filters[2])],
    });
  });

  test('does not add dependencies when maxConcurrency is at least the number of filters', () => {
    // GIVEN
    const stack = new Stack();
    addFilter(stack, 'Filter1', 'filter-1');
    addFilter(stack, 'Filter2', 'filter-2');
    addFilter(stack, 'Filter3', 'filter-3');

    // WHEN
    Aspects.of(stack).add(new SubscriptionFilterSerializationAspect({ maxConcurrency: 3 }));

    // THEN
    const filters = Template.fromStack(stack).findResources('AWS::Logs::SubscriptionFilter');
    expect(Object.keys(filters).length).toEqual(3);
    for (const filter of Object.values(filters)) {
      expect(filter.DependsOn).toBeUndefined();
    }
  });

  test.each([0, -1, 1.5, NaN])('fails for invalid maxConcurrency %p', (maxConcurrency) => {
    expect(() => {
      new SubscriptionFilterSerializationAspect({ maxConcurrency });
    }).toThrow(/maxConcurrency must be a positive integer/);
  });

  test('fails when maxConcurrency is an unresolved token', () => {
    expect(() => {
      new SubscriptionFilterSerializationAspect({ maxConcurrency: Token.asNumber({ resolve: () => 1 }) });
    }).toThrow(/maxConcurrency cannot be an unresolved token/);
  });

  test('produces identical templates across synthesis of the same app', () => {
    // GIVEN
    const synthesize = () => {
      const app = new App();
      const stack = new Stack(app, 'Stack');
      for (let i = 1; i <= 5; i++) {
        addFilter(stack, `Filter${i}`, `filter-${i}`);
      }
      Aspects.of(stack).add(new SubscriptionFilterSerializationAspect({ maxConcurrency: 2 }));
      return Template.fromStack(stack).toJSON();
    };

    // WHEN
    const first = synthesize();
    const second = synthesize();

    // THEN
    expect(second).toEqual(first);
  });

  test('does not create self-dependencies when the same aspect is applied at multiple scopes', () => {
    // GIVEN
    const app = new App();
    const stack = new Stack(app, 'Stack');
    const filter1 = addFilter(stack, 'Filter1', 'filter-1');
    addFilter(stack, 'Filter2', 'filter-2');

    // WHEN: same instance applied at both the app and the stack scope
    const aspect = new SubscriptionFilterSerializationAspect();
    Aspects.of(app).add(aspect);
    Aspects.of(stack).add(aspect);

    // THEN: still a single clean chain
    const template = Template.fromStack(stack);
    template.hasResource('AWS::Logs::SubscriptionFilter', {
      Properties: Match.objectLike({ FilterName: 'filter-1' }),
      DependsOn: Match.absent(),
    });
    template.hasResource('AWS::Logs::SubscriptionFilter', {
      Properties: Match.objectLike({ FilterName: 'filter-2' }),
      DependsOn: [logicalIdOf(stack, filter1)],
    });
  });
});

function addFilter(stack: Stack, id: string, filterName: string): SubscriptionFilter {
  const logGroup = new LogGroup(stack, `${id}LogGroup`);
  return new SubscriptionFilter(stack, id, {
    logGroup,
    destination: new FakeDestination(),
    filterPattern: FilterPattern.allEvents(),
    filterName,
  });
}

function logicalIdOf(stack: Stack, filter: SubscriptionFilter): string {
  return stack.getLogicalId(filter.node.defaultChild as CfnElement);
}

class FakeDestination implements ILogSubscriptionDestination {
  public bind(_scope: Construct, _sourceLogGroup: ILogGroup) {
    return {
      arn: 'arn:bogus',
    };
  }
}
