import { UnscopedValidationError } from '../../lib';
import { TemplateString } from '../../lib/helpers-internal';

describe('new TemplateString', () => {
  describe('parse', () => {
    it('parses template with single variable correctly', () => {
      const result = new TemplateString('Hello, ${name}!').parse('Hello, John!');
      expect(result).toEqual({ name: 'John' });
    });

    it('parses template with multiple variables correctly', () => {
      const result = new TemplateString('My name is ${firstName} ${lastName}.').parse('My name is Jane Doe.');
      expect(result).toEqual({ firstName: 'Jane', lastName: 'Doe' });
    });

    it('throws error when input does not match template', () => {
      expect(() => {
        new TemplateString('Hello, ${name}!').parse('Hi, John!');
      }).toThrow(UnscopedValidationError);
    });

    it('parses template with no variables correctly', () => {
      const result = new TemplateString('Hello, world!').parse('Hello, world!');
      expect(result).toEqual({});
    });

    it('parses template with trailing variable correctly', () => {
      const result = new TemplateString('Path: ${path}').parse('Path: /home/user');
      expect(result).toEqual({ path: '/home/user' });
    });

    it('throws error when input has extra characters', () => {
      expect(() => {
        new TemplateString('Hello, ${name}!').parse('Hello, John!!');
      }).toThrow(UnscopedValidationError);
    });

    it('parses template with adjacent variables correctly', () => {
      const result = new TemplateString('${greeting}, ${name}!').parse('Hi, John!');
      expect(result).toEqual({ greeting: 'Hi', name: 'John' });
    });

    it('throws error when input is shorter than template', () => {
      expect(() => {
        new TemplateString('Hello, ${name}!').parse('Hello, ');
      }).toThrow(UnscopedValidationError);
    });

    it('parses template with empty variable value correctly', () => {
      const result = new TemplateString('Hello, ${name}!').parse('Hello, !');
      expect(result).toEqual({ name: '' });
    });

    it('parses template with variable at the start correctly', () => {
      const result = new TemplateString('${greeting}, world!').parse('Hi, world!');
      expect(result).toEqual({ greeting: 'Hi' });
    });

    it('parses complex template correctly', () => {
      const result = new TemplateString('arn:${Partition}:dynamodb:${Region}:${Account}:table/${TableName}')
        .parse('arn:aws:dynamodb:us-east-1:12345:table/MyTable');
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
      const result = new TemplateString('Hello, ${name}!').interpolate({ name: 'John' });
      expect(result).toBe('Hello, John!');
    });

    it('interpolates template with multiple variables correctly', () => {
      const result = new TemplateString('My name is ${firstName} ${lastName}.').interpolate({
        firstName: 'Jane',
        lastName: 'Doe',
      });
      expect(result).toBe('My name is Jane Doe.');
    });

    it('throws error when variable is missing in interpolation', () => {
      expect(() => {
        new TemplateString('Hello, ${name}!').interpolate({});
      }).toThrow(UnscopedValidationError);
    });

    it('interpolates template with no variables correctly', () => {
      const result = new TemplateString('Hello, world!').interpolate({});
      expect(result).toBe('Hello, world!');
    });

    it('throws error when template contains undefined variable', () => {
      expect(() => {
        new TemplateString('Hello, ${name}!').interpolate({ greeting: 'Hi' });
      }).toThrow(UnscopedValidationError);
    });

    it('interpolates template with adjacent variables correctly', () => {
      const result = new TemplateString('${greeting}, ${name}!').interpolate({ greeting: 'Hi', name: 'John' });
      expect(result).toBe('Hi, John!');
    });

    it('interpolates template with empty variable value correctly', () => {
      const result = new TemplateString('Hello, ${name}!').interpolate({ name: '' });
      expect(result).toBe('Hello, !');
    });

    it('interpolates template with variable at the start correctly', () => {
      const result = new TemplateString('${greeting}, world!').interpolate({ greeting: 'Hi' });
      expect(result).toBe('Hi, world!');
    });
  });
});
