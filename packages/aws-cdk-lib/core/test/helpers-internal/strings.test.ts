import { UnscopedValidationError } from '../../lib';
import { TemplateStringParser } from '../../lib/helpers-internal/strings';

describe('TemplateStringParser', () => {
  describe('parse', () => {
    it('parses template with single variable correctly', () => {
      const result = TemplateStringParser.parse('Hello, ${name}!', 'Hello, John!');
      expect(result).toEqual({ name: 'John' });
    });

    it('parses template with multiple variables correctly', () => {
      const result = TemplateStringParser.parse('My name is ${firstName} ${lastName}.', 'My name is Jane Doe.');
      expect(result).toEqual({ firstName: 'Jane', lastName: 'Doe' });
    });

    it('throws error when input does not match template', () => {
      expect(() => {
        TemplateStringParser.parse('Hello, ${name}!', 'Hi, John!');
      }).toThrow(UnscopedValidationError);
    });

    it('parses template with no variables correctly', () => {
      const result = TemplateStringParser.parse('Hello, world!', 'Hello, world!');
      expect(result).toEqual({});
    });

    it('parses template with trailing variable correctly', () => {
      const result = TemplateStringParser.parse('Path: ${path}', 'Path: /home/user');
      expect(result).toEqual({ path: '/home/user' });
    });

    it('throws error when input has extra characters', () => {
      expect(() => {
        TemplateStringParser.parse('Hello, ${name}!', 'Hello, John!!');
      }).toThrow(UnscopedValidationError);
    });

    it('parses template with adjacent variables correctly', () => {
      const result = TemplateStringParser.parse('${greeting}, ${name}!', 'Hi, John!');
      expect(result).toEqual({ greeting: 'Hi', name: 'John' });
    });

    it('throws error when input is shorter than template', () => {
      expect(() => {
        TemplateStringParser.parse('Hello, ${name}!', 'Hello, ');
      }).toThrow(UnscopedValidationError);
    });

    it('parses template with empty variable value correctly', () => {
      const result = TemplateStringParser.parse('Hello, ${name}!', 'Hello, !');
      expect(result).toEqual({ name: '' });
    });

    it('parses template with variable at the start correctly', () => {
      const result = TemplateStringParser.parse('${greeting}, world!', 'Hi, world!');
      expect(result).toEqual({ greeting: 'Hi' });
    });

    it('parses complex template correctly', () => {
      const result = TemplateStringParser.parse(
        'arn:${Partition}:dynamodb:${Region}:${Account}:table/${TableName}',
        'arn:aws:dynamodb:us-east-1:12345:table/MyTable',
      );
      expect(result).toEqual({
        Partition: 'aws',
        Region: 'us-east-1',
        Account: '12345',
        TableName: 'MyTable',
      });
    });
  });

  describe('interpolate', () => {
    it('interpolates template with single variable correctly', () => {
      const result = TemplateStringParser.interpolate('Hello, ${name}!', { name: 'John' });
      expect(result).toBe('Hello, John!');
    });

    it('interpolates template with multiple variables correctly', () => {
      const result = TemplateStringParser.interpolate('My name is ${firstName} ${lastName}.', {
        firstName: 'Jane',
        lastName: 'Doe',
      });
      expect(result).toBe('My name is Jane Doe.');
    });

    it('throws error when variable is missing in interpolation', () => {
      expect(() => {
        TemplateStringParser.interpolate('Hello, ${name}!', {});
      }).toThrow(UnscopedValidationError);
    });

    it('interpolates template with no variables correctly', () => {
      const result = TemplateStringParser.interpolate('Hello, world!', {});
      expect(result).toBe('Hello, world!');
    });

    it('throws error when template contains undefined variable', () => {
      expect(() => {
        TemplateStringParser.interpolate('Hello, ${name}!', { greeting: 'Hi' });
      }).toThrow(UnscopedValidationError);
    });

    it('interpolates template with adjacent variables correctly', () => {
      const result = TemplateStringParser.interpolate('${greeting}, ${name}!', { greeting: 'Hi', name: 'John' });
      expect(result).toBe('Hi, John!');
    });

    it('interpolates template with empty variable value correctly', () => {
      const result = TemplateStringParser.interpolate('Hello, ${name}!', { name: '' });
      expect(result).toBe('Hello, !');
    });

    it('interpolates template with variable at the start correctly', () => {
      const result = TemplateStringParser.interpolate('${greeting}, world!', { greeting: 'Hi' });
      expect(result).toBe('Hi, world!');
    });
  });
});
