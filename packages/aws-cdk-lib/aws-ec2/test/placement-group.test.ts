import { Template } from '../../assertions';
import { Stack } from '../../core';
import { PlacementGroup, PlacementGroupSpreadLevel, PlacementGroupStrategy } from '../lib';

test('can configure empty placement group', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new PlacementGroup(stack, 'placementgroup');

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::EC2::PlacementGroup', {});
});

test('only specifying partitions => strategy is PARTITION', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new PlacementGroup(stack, 'placementgroup', {
    partitions: 5,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::EC2::PlacementGroup', {
    PartitionCount: 5,
    Strategy: PlacementGroupStrategy.PARTITION,
  });
});

test('only specifying spreadLevel => strategy is SPREAD', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new PlacementGroup(stack, 'placementgroup', {
    spreadLevel: PlacementGroupSpreadLevel.HOST,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::EC2::PlacementGroup', {
    Strategy: PlacementGroupStrategy.SPREAD,
  });
});

test('placement group respects spreadLevel', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new PlacementGroup(stack, 'placementgroup', {
    spreadLevel: PlacementGroupSpreadLevel.HOST,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::EC2::PlacementGroup', {
    SpreadLevel: PlacementGroupSpreadLevel.HOST,
  });
});

test('placement group respects strategy', () => {
  // GIVEN
  const stack = new Stack();

  new PlacementGroup(stack, 'placementgroup', {
    strategy: PlacementGroupStrategy.SPREAD,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::EC2::PlacementGroup', {
    Strategy: PlacementGroupStrategy.SPREAD,
  });
});

test('placement group throws if the CLUSTER strategy is used with partitions', () => {
  // GIVEN
  const stack = new Stack();

  expect(() => new PlacementGroup(stack, 'placementgroup', {
    partitions: 5,
    spreadLevel: PlacementGroupSpreadLevel.HOST,
    strategy: PlacementGroupStrategy.CLUSTER,
  })).toThrow(/PlacementGroup 'placementgroup' can only specify 'partitions' with the 'PARTITION' strategy/);
});

test('placement group throws if the SPREAD strategy is used with partitions', () => {
  // GIVEN
  const stack = new Stack();

  expect(() => new PlacementGroup(stack, 'placementgroup', {
    partitions: 5,
    spreadLevel: PlacementGroupSpreadLevel.HOST,
    strategy: PlacementGroupStrategy.SPREAD,
  })).toThrow(/PlacementGroup 'placementgroup' can only specify 'partitions' with the 'PARTITION' strategy/);
});

test('placement group throws if the SPREAD strategy is used with partitions', () => {
  // GIVEN
  const stack = new Stack();

  expect(() => new PlacementGroup(stack, 'placementgroup', {
    partitions: 5,
    spreadLevel: PlacementGroupSpreadLevel.HOST,
    strategy: PlacementGroupStrategy.SPREAD,
  })).toThrow(/PlacementGroup 'placementgroup' can only specify 'partitions' with the 'PARTITION' strategy/);
});

test('placement group throws if spreadLevel is used without the SPREAD strategy', () => {
  // GIVEN
  const stack = new Stack();

  expect(() => new PlacementGroup(stack, 'placementgroup', {
    spreadLevel: PlacementGroupSpreadLevel.HOST,
    strategy: PlacementGroupStrategy.CLUSTER,
  })).toThrow(/PlacementGroup 'placementgroup' can only specify 'spreadLevel' with the 'SPREAD' strategy/);
});
