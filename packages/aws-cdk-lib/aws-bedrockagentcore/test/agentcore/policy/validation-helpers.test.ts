/**
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */

import {
  validatePolicyEngineName,
  validatePolicyName,
  validatePolicyDefinition,
  validateDescription,
  throwIfInvalidPolicyEngineName,
  throwIfInvalidPolicyName,
  throwIfInvalidPolicyDefinition,
  throwIfInvalidDescription,
  POLICY_ENGINE_NAME_MIN_LENGTH,
  POLICY_ENGINE_NAME_MAX_LENGTH,
  POLICY_NAME_MIN_LENGTH,
  POLICY_NAME_MAX_LENGTH,
  POLICY_DEFINITION_MIN_LENGTH,
  POLICY_DEFINITION_MAX_LENGTH,
  DESCRIPTION_MAX_LENGTH,
} from '../../../lib/policy/validation-helpers';

describe('validatePolicyEngineName', () => {
  test('Should accept valid policy engine names', () => {
    expect(validatePolicyEngineName('ValidName').length).toBe(0);
    expect(validatePolicyEngineName('Valid_Name_123').length).toBe(0);
    expect(validatePolicyEngineName('a').length).toBe(0);
    expect(validatePolicyEngineName('A').length).toBe(0);
    expect(validatePolicyEngineName('aB_123_xyz').length).toBe(0);
  });

  test('Should reject names starting with number', () => {
    const errors = validatePolicyEngineName('1invalid');
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toContain('must start with a letter');
  });

  test('Should reject names with special characters', () => {
    const errors = validatePolicyEngineName('invalid-name');
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toContain('must start with a letter');
  });

  test('Should reject names that are too short', () => {
    const errors = validatePolicyEngineName('');
    expect(errors.length).toBeGreaterThan(0);
  });

  test('Should reject names that are too long', () => {
    const longName = 'a'.repeat(POLICY_ENGINE_NAME_MAX_LENGTH + 1);
    const errors = validatePolicyEngineName(longName);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.includes('must be less than or equal to'))).toBe(true);
  });

  test('Should accept name at maximum length', () => {
    const maxName = 'a' + 'b'.repeat(POLICY_ENGINE_NAME_MAX_LENGTH - 1);
    const errors = validatePolicyEngineName(maxName);
    expect(errors.length).toBe(0);
  });

  test('Should accept name at minimum length', () => {
    const minName = 'a';
    const errors = validatePolicyEngineName(minName);
    expect(errors.length).toBe(0);
  });

  test('Should return empty array for null/undefined', () => {
    expect(validatePolicyEngineName(null as any).length).toBe(0);
    expect(validatePolicyEngineName(undefined as any).length).toBe(0);
  });
});

describe('validatePolicyName', () => {
  test('Should accept valid policy names', () => {
    expect(validatePolicyName('ValidName').length).toBe(0);
    expect(validatePolicyName('Valid_Name_123').length).toBe(0);
    expect(validatePolicyName('a').length).toBe(0);
    expect(validatePolicyName('Policy_1').length).toBe(0);
  });

  test('Should reject names starting with number', () => {
    const errors = validatePolicyName('1invalid');
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toContain('must start with a letter');
  });

  test('Should reject names with special characters', () => {
    const errors = validatePolicyName('invalid-name!');
    expect(errors.length).toBeGreaterThan(0);
  });

  test('Should reject names that are too long', () => {
    const longName = 'a'.repeat(POLICY_NAME_MAX_LENGTH + 1);
    const errors = validatePolicyName(longName);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.includes('must be less than or equal to'))).toBe(true);
  });

  test('Should accept name at maximum length', () => {
    const maxName = 'a' + 'b'.repeat(POLICY_NAME_MAX_LENGTH - 1);
    const errors = validatePolicyName(maxName);
    expect(errors.length).toBe(0);
  });

  test('Should return empty array for null/undefined', () => {
    expect(validatePolicyName(null as any).length).toBe(0);
    expect(validatePolicyName(undefined as any).length).toBe(0);
  });
});

describe('validatePolicyDefinition', () => {
  test('Should accept valid policy definitions', () => {
    const validDef = 'permit(principal, action, resource);';
    expect(validatePolicyDefinition(validDef).length).toBe(0);
  });

  test('Should accept definition at minimum length', () => {
    const minDef = 'a'.repeat(POLICY_DEFINITION_MIN_LENGTH);
    expect(validatePolicyDefinition(minDef).length).toBe(0);
  });

  test('Should accept definition at maximum length', () => {
    const maxDef = 'a'.repeat(POLICY_DEFINITION_MAX_LENGTH);
    expect(validatePolicyDefinition(maxDef).length).toBe(0);
  });

  test('Should reject definition that is too short', () => {
    const shortDef = 'a'.repeat(POLICY_DEFINITION_MIN_LENGTH - 1);
    const errors = validatePolicyDefinition(shortDef);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toContain('must be at least');
  });

  test('Should reject definition that is too long', () => {
    const longDef = 'a'.repeat(POLICY_DEFINITION_MAX_LENGTH + 1);
    const errors = validatePolicyDefinition(longDef);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toContain('must be less than or equal to');
  });

  test('Should reject null definition', () => {
    const errors = validatePolicyDefinition(null as any);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toContain('required and cannot be null');
  });

  test('Should reject undefined definition', () => {
    const errors = validatePolicyDefinition(undefined as any);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toContain('required and cannot be null');
  });

  test('Should accept complex Cedar definitions', () => {
    const complexDef = `
      permit(
        principal in Group::"Admins",
        action == Action::"InvokeModel",
        resource
      ) when {
        context.environment == "production"
      };
    `;
    expect(validatePolicyDefinition(complexDef).length).toBe(0);
  });
});

describe('validateDescription', () => {
  test('Should accept valid descriptions', () => {
    expect(validateDescription('A valid description').length).toBe(0);
    expect(validateDescription('').length).toBe(0); // Empty is valid
  });

  test('Should accept description at maximum length', () => {
    const maxDesc = 'a'.repeat(DESCRIPTION_MAX_LENGTH);
    expect(validateDescription(maxDesc).length).toBe(0);
  });

  test('Should reject description that is too long', () => {
    const longDesc = 'a'.repeat(DESCRIPTION_MAX_LENGTH + 1);
    const errors = validateDescription(longDesc);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toContain('must be less than or equal to');
  });

  test('Should return empty array for null/undefined', () => {
    expect(validateDescription(null as any).length).toBe(0);
    expect(validateDescription(undefined as any).length).toBe(0);
  });

  test('Should accept descriptions with special characters', () => {
    const specialDesc = 'Description with special chars: @#$%^&*()';
    expect(validateDescription(specialDesc).length).toBe(0);
  });
});

describe('throwIfInvalidPolicyEngineName', () => {
  test('Should not throw for valid names', () => {
    expect(() => throwIfInvalidPolicyEngineName('ValidName')).not.toThrow();
    expect(() => throwIfInvalidPolicyEngineName('Valid_Name_123')).not.toThrow();
  });

  test('Should throw for invalid names', () => {
    expect(() => throwIfInvalidPolicyEngineName('1invalid')).toThrow();
    expect(() => throwIfInvalidPolicyEngineName('invalid-name!')).toThrow();
    expect(() => throwIfInvalidPolicyEngineName('a'.repeat(49))).toThrow();
  });
});

describe('throwIfInvalidPolicyName', () => {
  test('Should not throw for valid names', () => {
    expect(() => throwIfInvalidPolicyName('ValidName')).not.toThrow();
    expect(() => throwIfInvalidPolicyName('Policy_123')).not.toThrow();
  });

  test('Should throw for invalid names', () => {
    expect(() => throwIfInvalidPolicyName('1invalid')).toThrow();
    expect(() => throwIfInvalidPolicyName('invalid-name!')).toThrow();
    expect(() => throwIfInvalidPolicyName('a'.repeat(49))).toThrow();
  });
});

describe('throwIfInvalidPolicyDefinition', () => {
  test('Should not throw for valid definitions', () => {
    expect(() => throwIfInvalidPolicyDefinition('permit(principal, action, resource);')).not.toThrow();
    expect(() => throwIfInvalidPolicyDefinition('a'.repeat(35))).not.toThrow();
  });

  test('Should throw for invalid definitions', () => {
    expect(() => throwIfInvalidPolicyDefinition('short')).toThrow();
    expect(() => throwIfInvalidPolicyDefinition('a'.repeat(153601))).toThrow();
    expect(() => throwIfInvalidPolicyDefinition(null as any)).toThrow();
  });
});

describe('throwIfInvalidDescription', () => {
  test('Should not throw for valid descriptions', () => {
    expect(() => throwIfInvalidDescription('Valid description')).not.toThrow();
    expect(() => throwIfInvalidDescription('')).not.toThrow();
  });

  test('Should throw for invalid descriptions', () => {
    expect(() => throwIfInvalidDescription('a'.repeat(4097))).toThrow();
  });
});

describe('Validation constants', () => {
  test('Should have correct constant values', () => {
    expect(POLICY_ENGINE_NAME_MIN_LENGTH).toBe(1);
    expect(POLICY_ENGINE_NAME_MAX_LENGTH).toBe(48);
    expect(POLICY_NAME_MIN_LENGTH).toBe(1);
    expect(POLICY_NAME_MAX_LENGTH).toBe(48);
    expect(POLICY_DEFINITION_MIN_LENGTH).toBe(35);
    expect(POLICY_DEFINITION_MAX_LENGTH).toBe(153600);
    expect(DESCRIPTION_MAX_LENGTH).toBe(4096);
  });
});

describe('Edge cases', () => {
  test('Should handle Unicode characters in names', () => {
    // Names should only accept ASCII letters, numbers, and underscores
    const errors = validatePolicyName('name_\u00E9');
    expect(errors.length).toBeGreaterThan(0);
  });

  test('Should handle whitespace in names', () => {
    const errors = validatePolicyName('name with spaces');
    expect(errors.length).toBeGreaterThan(0);
  });

  test('Should handle multiple underscores', () => {
    expect(validatePolicyName('name___with___underscores').length).toBe(0);
  });

  test('Should handle mixed case', () => {
    expect(validatePolicyName('MixedCaseName').length).toBe(0);
    expect(validatePolicyEngineName('MixedCaseEngine').length).toBe(0);
  });

  test('Should handle definitions with newlines', () => {
    const multilineDef = `permit(
      principal,
      action,
      resource
    );`;
    expect(validatePolicyDefinition(multilineDef).length).toBe(0);
  });

  test('Should handle descriptions with newlines', () => {
    const multilineDesc = `This is a description
    with multiple lines
    of text`;
    expect(validateDescription(multilineDesc).length).toBe(0);
  });
});
