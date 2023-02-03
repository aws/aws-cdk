// eslint-disable-next-line import/order
import * as Mock from './mock';

jest.mock('aws-sdk', () => {
  return {
    QuickSight: jest.fn(() => Mock.mockQuickSight),
    config: { logger: '' },
  };
});

// eslint-disable-next-line import/order
import { Stack } from '@aws-cdk/core';
import { CfnTheme, Theme } from '../lib';

// INTERFACE CHECKERS
function instanceOfDataColorPaletteProperty(o: any): o is CfnTheme.DataColorPaletteProperty {
  return o == o;
}

describe('analysis', () => {

  let oldConsoleLog: any;

  beforeAll(() => {
    oldConsoleLog = global.console.log;
    global.console.log = jest.fn();
  });

  afterAll(() => {
    global.console.log = oldConsoleLog;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('fromId: Custom Theme', () => {
    // GIVEN
    const stack = new Stack(undefined, undefined, {
      env: {
        account: '0123456789',
        region: 'us-east-1',
      },
    });

    // WHEN
    let theme = Theme.fromId(stack, 'ImportedTheme', Mock.CUSTOM_THEME);

    // THEN
    expect(theme.resourceId).toBe(Mock.CUSTOM_THEME);
    expect(theme.baseTheme?.resourceId).toBe(Mock.MANAGED_THEME);
    expect(theme.permissions?.[0].principal).toBe('ThemePermissionsPrincipal');
    expect(theme.tags?.[0].key).toBe('ResourceArn');
    if (instanceOfDataColorPaletteProperty(theme.configuration?.dataColorPalette)) {
      expect(theme.configuration?.dataColorPalette?.emptyFillColor).toBe('EmptyFillColor');
    }
  });

  test('fromId: Managed Theme', () => {
    // GIVEN
    const stack = new Stack(undefined, undefined, {
      env: {
        account: '0123456789',
        region: 'us-east-1',
      },
    });

    // WHEN
    let theme = Theme.fromId(stack, 'ImportedTheme', Mock.MANAGED_THEME);

    // THEN
    expect(theme.resourceId).toBe(Mock.MANAGED_THEME);
  });

  test('fromId: No Description', () => {
    // GIVEN
    const stack = new Stack(undefined, undefined, {
      env: {
        account: '0123456789',
        region: 'us-east-1',
      },
    });

    // WHEN
    let theme = Theme.fromId(stack, 'ImportedTheme', Mock.NO_VERSION_DESCRIPTION);

    // THEN
    expect(theme.resourceId).toBe(Mock.NO_VERSION_DESCRIPTION);
  });

  test('new Theme from Theme', () => {
    // GIVEN
    const stack = new Stack(undefined, undefined, {
      env: {
        account: '0123456789',
        region: 'us-east-1',
      },
    });

    // WHEN
    let importedTheme = Theme.fromId(stack, 'ImportedTheme', Mock.MANAGED_THEME);
    let theme = new Theme(stack, 'TestId', {
      resourceId: 'TestId',
      themeName: 'TestName',
      baseTheme: importedTheme,
      versionDescription: 'TestDescription',
    });

    // THEN
    expect(theme.resourceId).toBe('TestId');
    expect(theme.themeArn).toContain('arn');
  });
});