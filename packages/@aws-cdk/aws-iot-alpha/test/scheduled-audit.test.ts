import { Template } from 'aws-cdk-lib/assertions';
import * as cdk from 'aws-cdk-lib';
import * as iot from '../lib';

let stack: cdk.Stack;
let config: iot.AccountAuditConfiguration;

beforeEach(() => {
  stack = new cdk.Stack();
  config = new iot.AccountAuditConfiguration(stack, 'AccountAuditConfiguration');
});

test('Default property', () => {
  new iot.ScheduledAudit(stack, 'ScheduledAudit', {
    accountAuditConfiguration: config,
    frequency: iot.Frequency.DAILY,
    auditChecks: [iot.AuditCheck.AUTHENTICATED_COGNITO_ROLE_OVERLY_PERMISSIVE_CHECK],
  });

  Template.fromStack(stack).hasResource('AWS::IoT::ScheduledAudit', {
    DependsOn: ['AccountAuditConfigurationAuditRoleBEFDE978', 'AccountAuditConfigurationA87E7758'],
    Properties: {
      Frequency: 'DAILY',
      TargetCheckNames: ['AUTHENTICATED_COGNITO_ROLE_OVERLY_PERMISSIVE_CHECK'],
    },
  });
});

test('full settings', () => {
  new iot.ScheduledAudit(stack, 'ScheduledAudit', {
    accountAuditConfiguration: config,
    frequency: iot.Frequency.DAILY,
    auditChecks: [iot.AuditCheck.AUTHENTICATED_COGNITO_ROLE_OVERLY_PERMISSIVE_CHECK],
    scheduledAuditName: 'MyScheduledAudit',
  });

  Template.fromStack(stack).hasResourceProperties('AWS::IoT::ScheduledAudit', {
    Frequency: 'DAILY',
    ScheduledAuditName: 'MyScheduledAudit',
    TargetCheckNames: ['AUTHENTICATED_COGNITO_ROLE_OVERLY_PERMISSIVE_CHECK'],
  });
});

describe('daily audit', () => {
  test('throw error for specifying day of week', () => {
    expect(() => {
      new iot.ScheduledAudit(stack, 'ScheduledAudit', {
        accountAuditConfiguration: config,
        frequency: iot.Frequency.DAILY,
        dayOfWeek: iot.DayOfWeek.MONDAY,
        auditChecks: [iot.AuditCheck.AUTHENTICATED_COGNITO_ROLE_OVERLY_PERMISSIVE_CHECK],
      });
    }).toThrow('Day of the week must not be specified for daily audits.');
  });

  test('throw error for specifying day of month', () => {
    expect(() => {
      new iot.ScheduledAudit(stack, 'ScheduledAudit', {
        accountAuditConfiguration: config,
        frequency: iot.Frequency.DAILY,
        dayOfMonth: iot.DayOfMonth.of(29),
        auditChecks: [iot.AuditCheck.AUTHENTICATED_COGNITO_ROLE_OVERLY_PERMISSIVE_CHECK],
      });
    }).toThrow('Day of the month must not be specified for daily audits.');
  });
});

describe('weekly audit', () => {
  test('set day of week', () => {
    new iot.ScheduledAudit(stack, 'ScheduledAudit', {
      accountAuditConfiguration: config,
      frequency: iot.Frequency.WEEKLY,
      dayOfWeek: iot.DayOfWeek.MONDAY,
      auditChecks: [iot.AuditCheck.AUTHENTICATED_COGNITO_ROLE_OVERLY_PERMISSIVE_CHECK],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IoT::ScheduledAudit', {
      Frequency: 'WEEKLY',
      DayOfWeek: 'MON',
      TargetCheckNames: ['AUTHENTICATED_COGNITO_ROLE_OVERLY_PERMISSIVE_CHECK'],
    });
  });

  test('throw error for missing day of week', () => {
    expect(() => {
      new iot.ScheduledAudit(stack, 'ScheduledAudit', {
        accountAuditConfiguration: config,
        frequency: iot.Frequency.WEEKLY,
        auditChecks: [iot.AuditCheck.AUTHENTICATED_COGNITO_ROLE_OVERLY_PERMISSIVE_CHECK],
      });
    }).toThrow('Day of the week must be specified for weekly or bi-weekly audits.');
  });

  test('throw error for specifying both day of week and day of month', () => {
    expect(() => {
      new iot.ScheduledAudit(stack, 'ScheduledAudit', {
        accountAuditConfiguration: config,
        frequency: iot.Frequency.WEEKLY,
        dayOfWeek: iot.DayOfWeek.MONDAY,
        dayOfMonth: iot.DayOfMonth.of(29),
        auditChecks: [iot.AuditCheck.AUTHENTICATED_COGNITO_ROLE_OVERLY_PERMISSIVE_CHECK],
      });
    }).toThrow('Day of the month must not be specified for weekly or bi-weekly audits.');
  });
});

describe('bi-weekly audit', () => {
  test('set day of week', () => {
    new iot.ScheduledAudit(stack, 'ScheduledAudit', {
      accountAuditConfiguration: config,
      frequency: iot.Frequency.BI_WEEKLY,
      dayOfWeek: iot.DayOfWeek.MONDAY,
      auditChecks: [iot.AuditCheck.AUTHENTICATED_COGNITO_ROLE_OVERLY_PERMISSIVE_CHECK],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IoT::ScheduledAudit', {
      Frequency: 'BIWEEKLY',
      DayOfWeek: 'MON',
      TargetCheckNames: ['AUTHENTICATED_COGNITO_ROLE_OVERLY_PERMISSIVE_CHECK'],
    });
  });

  test('throw error for missing day of week', () => {
    expect(() => {
      new iot.ScheduledAudit(stack, 'ScheduledAudit', {
        accountAuditConfiguration: config,
        frequency: iot.Frequency.BI_WEEKLY,
        auditChecks: [iot.AuditCheck.AUTHENTICATED_COGNITO_ROLE_OVERLY_PERMISSIVE_CHECK],
      });
    }).toThrow('Day of the week must be specified for weekly or bi-weekly audits.');
  });

  test('throw error for specifying both day of week and day of month', () => {
    expect(() => {
      new iot.ScheduledAudit(stack, 'ScheduledAudit', {
        accountAuditConfiguration: config,
        frequency: iot.Frequency.BI_WEEKLY,
        dayOfWeek: iot.DayOfWeek.MONDAY,
        dayOfMonth: iot.DayOfMonth.of(29),
        auditChecks: [iot.AuditCheck.AUTHENTICATED_COGNITO_ROLE_OVERLY_PERMISSIVE_CHECK],
      });
    }).toThrow('Day of the month must not be specified for weekly or bi-weekly audits.');
  });
});

describe('monthly audit', () => {
  test('set day of month', () => {
    new iot.ScheduledAudit(stack, 'ScheduledAudit', {
      accountAuditConfiguration: config,
      frequency: iot.Frequency.MONTHLY,
      dayOfMonth: iot.DayOfMonth.of(29),
      auditChecks: [iot.AuditCheck.AUTHENTICATED_COGNITO_ROLE_OVERLY_PERMISSIVE_CHECK],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::IoT::ScheduledAudit', {
      Frequency: 'MONTHLY',
      DayOfMonth: '29',
      TargetCheckNames: ['AUTHENTICATED_COGNITO_ROLE_OVERLY_PERMISSIVE_CHECK'],
    });
  });

  test('throw error for missing day of month', () => {
    expect(() => {
      new iot.ScheduledAudit(stack, 'ScheduledAudit', {
        accountAuditConfiguration: config,
        frequency: iot.Frequency.MONTHLY,
        auditChecks: [iot.AuditCheck.AUTHENTICATED_COGNITO_ROLE_OVERLY_PERMISSIVE_CHECK],
      });
    }).toThrow('Day of the month must be specified for monthly audits.');
  });

  test('throw error for specifying both day of week and day of month', () => {
    expect(() => {
      new iot.ScheduledAudit(stack, 'ScheduledAudit', {
        accountAuditConfiguration: config,
        frequency: iot.Frequency.MONTHLY,
        dayOfWeek: iot.DayOfWeek.MONDAY,
        dayOfMonth: iot.DayOfMonth.of(29),
        auditChecks: [iot.AuditCheck.AUTHENTICATED_COGNITO_ROLE_OVERLY_PERMISSIVE_CHECK],
      });
    }).toThrow('Day of the week must not be specified for monthly audits.');
  });
});

test.each(['', 'a'.repeat(129)])('throw error for invalid length of scheduled audit name %s', (name) => {
  expect(() => {
    new iot.ScheduledAudit(stack, 'ScheduledAudit', {
      accountAuditConfiguration: config,
      frequency: iot.Frequency.DAILY,
      auditChecks: [iot.AuditCheck.AUTHENTICATED_COGNITO_ROLE_OVERLY_PERMISSIVE_CHECK],
      scheduledAuditName: name,
    });
  }).toThrow(`Scheduled audit name must be between 1 and 128 characters, got: ${name.length}`);
});

test('throw error for invalid scheduled audit name', () => {
  expect(() => {
    new iot.ScheduledAudit(stack, 'ScheduledAudit', {
      accountAuditConfiguration: config,
      frequency: iot.Frequency.DAILY,
      auditChecks: [iot.AuditCheck.AUTHENTICATED_COGNITO_ROLE_OVERLY_PERMISSIVE_CHECK],
      scheduledAuditName: '*!()',
    });
  }).toThrow('Scheduled audit name must be alphanumeric and may include colons, underscores, and hyphens, got: *!()');
});

test('import by attributes', () => {
  const name = 'scheduled-audit-name';
  const arn = 'arn:aws:iot:us-east-1:123456789012:scheduledaudit/scheduled-audit-name';

  const scheduledAudit = iot.ScheduledAudit.fromScheduledAuditAttributes(stack, 'AccountAuditConfigurationFromId', {
    scheduledAuditName: name,
    scheduledAuditArn: arn,
  });

  expect(scheduledAudit).toMatchObject({
    scheduledAuditName: name,
    scheduledAuditArn: arn,
  });
});

test('import by arn', () => {
  const arn = 'arn:aws:iot:us-east-1:123456789012:scheduledaudit/scheduled-audit-name';

  const scheduledAudit = iot.ScheduledAudit.fromScheduledAuditArn(stack, 'AccountAuditConfigurationFromArn', arn);

  expect(scheduledAudit).toMatchObject({
    scheduledAuditArn: arn,
    scheduledAuditName: 'scheduled-audit-name',
  });
});
