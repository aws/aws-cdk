export enum TerminationPolicy {
  OLDEST_INSTANCE = 'OldestInstance',
  OLDEST_LAUNCH_CONFIGURATION = 'OldestLaunchConfiguration',
  NEWEST_INSTANCE = 'NewestInstance',
  CLOSEST_TO_NEXT_INSTANCE_HOUR = 'ClosestToNextInstanceHour',
  DEFAULT = 'Default',
  OLDEST_LAUNCH_TEMPLATE = 'OldestLaunchTemplate',
  ALLOCATION_STRATEGY = 'AllocationStrategy',
}
