import * as bedrock from '../../../bedrock';

describe('ToolChoice', () => {
  describe('static factory methods', () => {
    test('creates ANY tool choice', () => {
      const toolChoice = bedrock.ToolChoice.ANY;

      expect(toolChoice.any).toEqual({});
      expect(toolChoice.auto).toBeUndefined();
      expect(toolChoice.tool).toBeUndefined();
    });

    test('creates AUTO tool choice', () => {
      const toolChoice = bedrock.ToolChoice.AUTO;

      expect(toolChoice.any).toBeUndefined();
      expect(toolChoice.auto).toEqual({});
      expect(toolChoice.tool).toBeUndefined();
    });

    test('creates specific tool choice', () => {
      const toolChoice = bedrock.ToolChoice.specificTool('weather_tool');

      expect(toolChoice.any).toBeUndefined();
      expect(toolChoice.auto).toBeUndefined();
      expect(toolChoice.tool).toBe('weather_tool');
    });

    test('creates specific tool choice with different tool names', () => {
      const toolChoice1 = bedrock.ToolChoice.specificTool('calculator');
      const toolChoice2 = bedrock.ToolChoice.specificTool('search_engine');
      const toolChoice3 = bedrock.ToolChoice.specificTool('database_query');

      expect(toolChoice1.tool).toBe('calculator');
      expect(toolChoice2.tool).toBe('search_engine');
      expect(toolChoice3.tool).toBe('database_query');
    });
  });

  describe('_render method', () => {
    test('renders ANY tool choice correctly', () => {
      const toolChoice = bedrock.ToolChoice.ANY;
      const rendered = toolChoice._render();

      expect(rendered).toEqual({
        any: {},
        auto: undefined,
        tool: undefined,
      });
    });

    test('renders AUTO tool choice correctly', () => {
      const toolChoice = bedrock.ToolChoice.AUTO;
      const rendered = toolChoice._render();

      expect(rendered).toEqual({
        any: undefined,
        auto: {},
        tool: undefined,
      });
    });

    test('renders specific tool choice correctly', () => {
      const toolChoice = bedrock.ToolChoice.specificTool('my_tool');
      const rendered = toolChoice._render();

      expect(rendered).toEqual({
        any: undefined,
        auto: undefined,
        tool: { name: 'my_tool' },
      });
    });

    test('renders different specific tools correctly', () => {
      const tools = ['tool1', 'tool2', 'tool3', 'very_long_tool_name', 'tool-with-hyphens'];

      tools.forEach(toolName => {
        const toolChoice = bedrock.ToolChoice.specificTool(toolName);
        const rendered = toolChoice._render();

        expect(rendered).toEqual({
          any: undefined,
          auto: undefined,
          tool: { name: toolName },
        });
      });
    });
  });

  describe('edge cases', () => {
    test('handles empty string tool name', () => {
      const toolChoice = bedrock.ToolChoice.specificTool('');
      const rendered = toolChoice._render();

      expect(rendered).toEqual({
        any: undefined,
        auto: undefined,
        tool: { name: '' },
      });
    });

    test('handles tool names with special characters', () => {
      const specialToolName = 'tool_with-special.chars@123';
      const toolChoice = bedrock.ToolChoice.specificTool(specialToolName);
      const rendered = toolChoice._render();

      expect(rendered).toEqual({
        any: undefined,
        auto: undefined,
        tool: { name: specialToolName },
      });
    });

    test('handles very long tool names', () => {
      const longToolName = 'a'.repeat(1000);
      const toolChoice = bedrock.ToolChoice.specificTool(longToolName);
      const rendered = toolChoice._render();

      expect(rendered).toEqual({
        any: undefined,
        auto: undefined,
        tool: { name: longToolName },
      });
    });

    test('handles tool names with spaces', () => {
      const toolNameWithSpaces = 'tool with spaces';
      const toolChoice = bedrock.ToolChoice.specificTool(toolNameWithSpaces);
      const rendered = toolChoice._render();

      expect(rendered).toEqual({
        any: undefined,
        auto: undefined,
        tool: { name: toolNameWithSpaces },
      });
    });

    test('handles tool names with unicode characters', () => {
      const unicodeToolName = 'tool_名前_🔧';
      const toolChoice = bedrock.ToolChoice.specificTool(unicodeToolName);
      const rendered = toolChoice._render();

      expect(rendered).toEqual({
        any: undefined,
        auto: undefined,
        tool: { name: unicodeToolName },
      });
    });
  });

  describe('static instances', () => {
    test('ANY and AUTO are singleton instances', () => {
      const any1 = bedrock.ToolChoice.ANY;
      const any2 = bedrock.ToolChoice.ANY;
      const auto1 = bedrock.ToolChoice.AUTO;
      const auto2 = bedrock.ToolChoice.AUTO;

      expect(any1).toBe(any2);
      expect(auto1).toBe(auto2);
    });

    test('specific tool choices are different instances', () => {
      const tool1 = bedrock.ToolChoice.specificTool('tool1');
      const tool2 = bedrock.ToolChoice.specificTool('tool1');
      const tool3 = bedrock.ToolChoice.specificTool('tool2');

      expect(tool1).not.toBe(tool2);
      expect(tool1).not.toBe(tool3);
      expect(tool2).not.toBe(tool3);
    });

    test('static instances have correct properties', () => {
      expect(bedrock.ToolChoice.ANY.any).toEqual({});
      expect(bedrock.ToolChoice.ANY.auto).toBeUndefined();
      expect(bedrock.ToolChoice.ANY.tool).toBeUndefined();

      expect(bedrock.ToolChoice.AUTO.any).toBeUndefined();
      expect(bedrock.ToolChoice.AUTO.auto).toEqual({});
      expect(bedrock.ToolChoice.AUTO.tool).toBeUndefined();
    });
  });

  describe('constructor behavior', () => {
    test('constructor sets properties correctly for ANY', () => {
      const toolChoice = new (bedrock.ToolChoice as any)({}, undefined, undefined);

      expect(toolChoice.any).toEqual({});
      expect(toolChoice.auto).toBeUndefined();
      expect(toolChoice.tool).toBeUndefined();
    });

    test('constructor sets properties correctly for AUTO', () => {
      const toolChoice = new (bedrock.ToolChoice as any)(undefined, {}, undefined);

      expect(toolChoice.any).toBeUndefined();
      expect(toolChoice.auto).toEqual({});
      expect(toolChoice.tool).toBeUndefined();
    });

    test('constructor sets properties correctly for specific tool', () => {
      const toolChoice = new (bedrock.ToolChoice as any)(undefined, undefined, 'my_tool');

      expect(toolChoice.any).toBeUndefined();
      expect(toolChoice.auto).toBeUndefined();
      expect(toolChoice.tool).toBe('my_tool');
    });
  });

  describe('type consistency', () => {
    test('all tool choices have _render method', () => {
      const any = bedrock.ToolChoice.ANY;
      const auto = bedrock.ToolChoice.AUTO;
      const specific = bedrock.ToolChoice.specificTool('test');

      expect(typeof any._render).toBe('function');
      expect(typeof auto._render).toBe('function');
      expect(typeof specific._render).toBe('function');
    });

    test('_render always returns object with correct structure', () => {
      const choices = [
        bedrock.ToolChoice.ANY,
        bedrock.ToolChoice.AUTO,
        bedrock.ToolChoice.specificTool('test1'),
        bedrock.ToolChoice.specificTool('test2'),
      ];

      choices.forEach(choice => {
        const rendered = choice._render();
        expect(rendered).toHaveProperty('any');
        expect(rendered).toHaveProperty('auto');
        expect(rendered).toHaveProperty('tool');
      });
    });

    test('exactly one property is defined in rendered output', () => {
      const any = bedrock.ToolChoice.ANY._render();
      const auto = bedrock.ToolChoice.AUTO._render();
      const specific = bedrock.ToolChoice.specificTool('test')._render();

      // ANY should have only 'any' defined
      expect(any.any).toBeDefined();
      expect(any.auto).toBeUndefined();
      expect(any.tool).toBeUndefined();

      // AUTO should have only 'auto' defined
      expect(auto.any).toBeUndefined();
      expect(auto.auto).toBeDefined();
      expect(auto.tool).toBeUndefined();

      // Specific should have only 'tool' defined
      expect(specific.any).toBeUndefined();
      expect(specific.auto).toBeUndefined();
      expect(specific.tool).toBeDefined();
    });
  });
});
