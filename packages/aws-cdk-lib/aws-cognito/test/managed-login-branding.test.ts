import { Template } from '../../assertions';
import { Stack } from '../../core';
import {
  BrandingAssetCategory,
  BrandingColorMode,
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
      userPool,
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
      userPool,
      client,
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

  test('with assets', () => {
    // GIVEN
    const stack = new Stack();
    const userPool = new UserPool(stack, 'UserPool');

    // WHEN
    new ManagedLoginBranding(stack, 'ManagedLoginBranding', {
      userPool,
      assets: [
        {
          category: BrandingAssetCategory.LOGO,
          colorMode: BrandingColorMode.LIGHT,
          extension: 'png',
          bytes: 'YmFzZTY0LWVuY29kZWQtaW1hZ2UtZGF0YQ==',
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
            Category: 'LOGO',
            ColorMode: 'LIGHT',
            Extension: 'png',
            Bytes: 'YmFzZTY0LWVuY29kZWQtaW1hZ2UtZGF0YQ==',
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
      userPool,
      settings: {
        colors: {
          primary: '#FF0000',
          background: '#FFFFFF',
        },
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties(
      'AWS::Cognito::ManagedLoginBranding',
      {
        UserPoolId: stack.resolve(userPool.userPoolId),
        Settings: {
          colors: {
            primary: '#FF0000',
            background: '#FFFFFF',
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
      userPool,
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
        userPool,
        useCognitoProvidedValues: true,
        settings: {
          colors: {
            primary: '#FF0000',
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
        userPool,
        useCognitoProvidedValues: true,
        assets: [
          {
            category: BrandingAssetCategory.LOGO,
            colorMode: BrandingColorMode.LIGHT,
            extension: 'png',
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
      userPool,
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
