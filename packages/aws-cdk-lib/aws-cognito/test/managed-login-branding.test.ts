import { Template } from '../../assertions';
import { Stack } from '../../core';
import {
  AssetCategory,
  AssetExtension,
  ColorMode,
  ManagedLoginBranding,
  UserPool,
} from '../lib';

describe('ManagedLoginBranding', () => {
  test('default setup', () => {
    // GIVEN
    const stack = new Stack();
    const userPool = new UserPool(stack, 'UserPool');

    // WHEN
    new ManagedLoginBranding(stack, 'ManagedLoginBranding', {
      userPoolId: userPool.userPoolId,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties(
      'AWS::Cognito::ManagedLoginBranding',
      {
        UserPoolId: stack.resolve(userPool.userPoolId),
      },
    );
  });

  test('with client', () => {
    // GIVEN
    const stack = new Stack();
    const userPool = new UserPool(stack, 'UserPool');
    const client = userPool.addClient('Client');

    // WHEN
    new ManagedLoginBranding(stack, 'ManagedLoginBranding', {
      userPoolId: userPool.userPoolId,
      clientId: client.userPoolClientId,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties(
      'AWS::Cognito::ManagedLoginBranding',
      {
        UserPoolId: stack.resolve(userPool.userPoolId),
        ClientId: stack.resolve(client.userPoolClientId),
      },
    );
  });

  test('with string user pool ID', () => {
    // GIVEN
    const stack = new Stack();
    const userPoolId = 'us-east-1_abcdefghi';

    // WHEN
    new ManagedLoginBranding(stack, 'ManagedLoginBranding', {
      userPoolId,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties(
      'AWS::Cognito::ManagedLoginBranding',
      {
        UserPoolId: userPoolId,
      },
    );
  });

  test('with assets', () => {
    // GIVEN
    const stack = new Stack();
    const userPool = new UserPool(stack, 'UserPool');

    // WHEN
    new ManagedLoginBranding(stack, 'ManagedLoginBranding', {
      userPoolId: userPool.userPoolId,
      assets: [
        {
          category: AssetCategory.PAGE_HEADER_LOGO,
          colorMode: ColorMode.LIGHT,
          extension: AssetExtension.PNG,
          bytes: 'YmFzZTY0LWVuY29kZWQtaW1hZ2UtZGF0YQ==',
        },
        {
          category: AssetCategory.FAVICON_SVG,
          colorMode: ColorMode.DYNAMIC,
          extension: AssetExtension.SVG,
          bytes: 'c3ZnLWltYWdlLWRhdGEtaW4tYmFzZTY0',
        },
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties(
      'AWS::Cognito::ManagedLoginBranding',
      {
        UserPoolId: stack.resolve(userPool.userPoolId),
        Assets: [
          {
            Category: 'PAGE_HEADER_LOGO',
            ColorMode: 'LIGHT',
            Extension: 'PNG',
            Bytes: 'YmFzZTY0LWVuY29kZWQtaW1hZ2UtZGF0YQ==',
          },
          {
            Category: 'FAVICON_SVG',
            ColorMode: 'DYNAMIC',
            Extension: 'SVG',
            Bytes: 'c3ZnLWltYWdlLWRhdGEtaW4tYmFzZTY0',
          },
        ],
      },
    );
  });

  test('with settings', () => {
    // GIVEN
    const stack = new Stack();
    const userPool = new UserPool(stack, 'UserPool');

    // WHEN
    new ManagedLoginBranding(stack, 'ManagedLoginBranding', {
      userPoolId: userPool.userPoolId,
      settings: {
        components: {
          pageBackground: {
            lightMode: { color: 'ffffffff' },
            darkMode: { color: '0f1b2aff' },
          },
          primaryButton: {
            lightMode: {
              defaults: {
                backgroundColor: '0972d3ff',
                textColor: 'ffffffff',
              },
            },
          },
        },
        categories: {
          global: {
            colorSchemeMode: 'LIGHT',
            spacingDensity: 'REGULAR',
          },
        },
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties(
      'AWS::Cognito::ManagedLoginBranding',
      {
        UserPoolId: stack.resolve(userPool.userPoolId),
        Settings: {
          components: {
            pageBackground: {
              lightMode: { color: 'ffffffff' },
              darkMode: { color: '0f1b2aff' },
            },
            primaryButton: {
              lightMode: {
                defaults: {
                  backgroundColor: '0972d3ff',
                  textColor: 'ffffffff',
                },
              },
            },
          },
          categories: {
            global: {
              colorSchemeMode: 'LIGHT',
              spacingDensity: 'REGULAR',
            },
          },
        },
      },
    );
  });

  test('with useCognitoProvidedValues', () => {
    // GIVEN
    const stack = new Stack();
    const userPool = new UserPool(stack, 'UserPool');

    // WHEN
    new ManagedLoginBranding(stack, 'ManagedLoginBranding', {
      userPoolId: userPool.userPoolId,
      useCognitoProvidedValues: true,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties(
      'AWS::Cognito::ManagedLoginBranding',
      {
        UserPoolId: stack.resolve(userPool.userPoolId),
        UseCognitoProvidedValues: true,
      },
    );
  });

  test('throws when useCognitoProvidedValues is true and settings are provided', () => {
    // GIVEN
    const stack = new Stack();
    const userPool = new UserPool(stack, 'UserPool');

    // WHEN / THEN
    expect(() => {
      new ManagedLoginBranding(stack, 'ManagedLoginBranding', {
        userPoolId: userPool.userPoolId,
        useCognitoProvidedValues: true,
        settings: {
          components: {
            primaryButton: {
              lightMode: {
                defaults: {
                  backgroundColor: '0972d3ff',
                },
              },
            },
          },
        },
      });
    }).toThrow(
      /When useCognitoProvidedValues is true, settings and assets must be omitted/,
    );
  });

  test('throws when useCognitoProvidedValues is true and assets are provided', () => {
    // GIVEN
    const stack = new Stack();
    const userPool = new UserPool(stack, 'UserPool');

    // WHEN / THEN
    expect(() => {
      new ManagedLoginBranding(stack, 'ManagedLoginBranding', {
        userPoolId: userPool.userPoolId,
        useCognitoProvidedValues: true,
        assets: [
          {
            category: AssetCategory.PAGE_HEADER_LOGO,
            colorMode: ColorMode.LIGHT,
            extension: AssetExtension.PNG,
            bytes: 'YmFzZTY0LWVuY29kZWQtaW1hZ2UtZGF0YQ==',
          },
        ],
      });
    }).toThrow(
      /When useCognitoProvidedValues is true, settings and assets must be omitted/,
    );
  });

  test('with returnMergedResources', () => {
    // GIVEN
    const stack = new Stack();
    const userPool = new UserPool(stack, 'UserPool');

    // WHEN
    new ManagedLoginBranding(stack, 'ManagedLoginBranding', {
      userPoolId: userPool.userPoolId,
      returnMergedResources: true,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties(
      'AWS::Cognito::ManagedLoginBranding',
      {
        UserPoolId: stack.resolve(userPool.userPoolId),
        ReturnMergedResources: true,
      },
    );
  });

  test('with string client ID', () => {
    // GIVEN
    const stack = new Stack();
    const userPool = new UserPool(stack, 'UserPool');
    const clientId = 'abc123def456ghi';

    // WHEN
    new ManagedLoginBranding(stack, 'ManagedLoginBranding', {
      userPoolId: userPool.userPoolId,
      clientId,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties(
      'AWS::Cognito::ManagedLoginBranding',
      {
        UserPoolId: stack.resolve(userPool.userPoolId),
        ClientId: clientId,
      },
    );
  });

  test('import from managedLoginBrandingId', () => {
    // GIVEN
    const stack = new Stack();
    const managedLoginBrandingId = 'branding-id';

    // WHEN
    const imported = ManagedLoginBranding.fromManagedLoginBrandingId(
      stack,
      'ImportedManagedLoginBranding',
      managedLoginBrandingId,
    );

    // THEN
    expect(imported.managedLoginBrandingId).toEqual(managedLoginBrandingId);
  });
});
