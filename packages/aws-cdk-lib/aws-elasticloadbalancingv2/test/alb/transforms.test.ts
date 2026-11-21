import { ListenerTransform } from '../../lib/alb/transforms';

describe('ListenerTransform', () => {
  describe('hostHeaderRewrite', () => {
    test('throws when more than one rewrite rule is specified', () => {
      expect(() => ListenerTransform.hostHeaderRewrite([
        { regex: '^(.*)$', replace: 'example.com' },
        { regex: '^www\\.(.*)$', replace: '$1' },
      ])).toThrow('Exactly one rewrite rule must be specified, got 2.');
    });

    test('throws when no rewrite rules are specified', () => {
      expect(() => ListenerTransform.hostHeaderRewrite([])).toThrow('Exactly one rewrite rule must be specified, got 0.');
    });

    test('throws when regex is empty', () => {
      expect(() => ListenerTransform.hostHeaderRewrite([
        { regex: '', replace: 'example.com' },
      ])).toThrow('Rewrite rule at index 0: regex cannot be empty');
    });

    test('throws when replace is empty', () => {
      expect(() => ListenerTransform.hostHeaderRewrite([
        { regex: '^(.*)$', replace: '' },
      ])).toThrow('Rewrite rule at index 0: replace cannot be empty');
    });
  });

  describe('urlRewrite', () => {
    test('throws when more than one rewrite rule is specified', () => {
      expect(() => ListenerTransform.urlRewrite([
        { regex: '^/old/(.*)$', replace: '/new/$1' },
        { regex: '^/deprecated/(.*)$', replace: '/updated/$1' },
      ])).toThrow('Exactly one rewrite rule must be specified, got 2.');
    });

    test('throws when no rewrite rules are specified', () => {
      expect(() => ListenerTransform.urlRewrite([])).toThrow('Exactly one rewrite rule must be specified, got 0.');
    });

    test('throws when regex is empty', () => {
      expect(() => ListenerTransform.urlRewrite([
        { regex: '', replace: '/new' },
      ])).toThrow('Rewrite rule at index 0: regex cannot be empty');
    });

    test('throws when replace is empty', () => {
      expect(() => ListenerTransform.urlRewrite([
        { regex: '^/old/(.*)$', replace: '' },
      ])).toThrow('Rewrite rule at index 0: replace cannot be empty');
    });
  });
});
