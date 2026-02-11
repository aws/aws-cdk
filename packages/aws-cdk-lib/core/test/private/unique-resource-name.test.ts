import { md5hash } from '../../lib/helpers-internal';
import { makeUniqueResourceName } from '../../lib/private/unique-resource-name';

const pathHash = (path: string[], discriminator?: string): string => {
  const pathString = path.join('/');
  const hashInput = discriminator ? `${pathString}/${discriminator}` : pathString;
  return md5hash(hashInput).slice(0, 8).toUpperCase();
};

describe('makeUniqueResourceName tests', () => {
  test('unique resource name is just resource name when the resource is top level, short enough, has no nonalphanumeric characters', () => {
    const uniqueResourceName = makeUniqueResourceName(['toplevelresource'], {});
    expect(uniqueResourceName).toEqual('toplevelresource');
  });

  test('unique resource name is shortened with a hash added when resource is top level and resource name is too long', () => {
    const tooLongName = ['anamethatisslightlylongerthan256charactersthatisalsoatoplevelresourcesothereisonlyonevalueinthisarrayandapparentlybrevityisnotthestrongpointofthepersonwhonamedthisresourcewhichIbettheywillcometoregretlaterbutitiswhatitisanywhodlethisfunctionshouldshortenthis'];
    const uniqueResourceName = makeUniqueResourceName(tooLongName, {});

    const expectedName = `anamethatisslightlylongerthan256charactersthatisalsoatoplevelresourcesothereisonlyonevalueinthisarrayandapparentlybrevityisngpointofthepersonwhonamedthisresourcewhichIbettheywillcometoregretlaterbutitiswhatitisanywhodlethisfunctionshouldshortenthis${pathHash(tooLongName)}`;
    expect(uniqueResourceName).toEqual(expectedName);
    expect(uniqueResourceName.length).toEqual(256);
  });

  test('unique resource name removes special characters when resource is top level', () => {
    const componentsPath = ['I-love-special-characters-¯\\\_(ツ)_/¯-for-real-though'];
    const expectedName = 'Ilovespecialcharactersforrealthough';

    expect(makeUniqueResourceName(componentsPath, {})).toEqual(expectedName);
  });

  test('unique resource name shortens from the middle and adds a hash when maxLength is defined, resource is top level, and resource name is longer than max', () => {
    const componentsPath = ['ThisIsStillLongerThanTheAllowedLength'];
    const expectedName = `ThisIsLength${pathHash(componentsPath)}`;

    expect(makeUniqueResourceName(componentsPath, { maxLength: 20 })).toEqual(expectedName);
  });

  test('unique resource name shortens from the middle and adds a hash when maxLength is defined, resource is top level, resource name is longer than max, and separator is provided', () => {
    const componentsPath = ['ThisIsStillLongerThanTheAllowedLength'];
    const expectedName = `ThisIsength-${pathHash(componentsPath)}`;

    expect(makeUniqueResourceName(componentsPath, { maxLength: 20, separator: '-' })).toEqual(expectedName);
  });

  test('unique resource name removes special characters and makes no other changes when resouce is top level and too long with special characters but proper length without', () => {
    const tooLongName = ['a-name-that-is-slightly-longer-than-256-characters-that-is-also-a-top-level-resource-so-there-is-only-one-value-in-this-array-and-apparently-brevity-is-not-the-strong-point-of-the-person-who-named-this-resource-which-I-bet-they-will-come-to-regret-later-but-it-is-what-it-is'];
    const expectedName = 'anamethatisslightlylongerthan256charactersthatisalsoatoplevelresourcesothereisonlyonevalueinthisarrayandapparentlybrevityisnotthestrongpointofthepersonwhonamedthisresourcewhichIbettheywillcometoregretlaterbutitiswhatitis';

    expect(makeUniqueResourceName(tooLongName, {})).toEqual(expectedName);
  });

  test('unique resource name leaves in allowed special characters and adds no hash when resource is top level and resouce name is short enougn', () => {
    const componentsPath = ['¯\\\_(ツ)_/¯-shruggie-gets-to-stay-¯\\\_(ツ)_/¯'];
    const expectedName = '¯\_(ツ)_/¯shruggiegetstostay¯\_(ツ)_/¯';

    expect(makeUniqueResourceName(componentsPath, { allowedSpecialCharacters: '¯\\\_(ツ)/', maxLength: 200 })).toEqual(expectedName);
  });

  test('unique resource name leaves in allowed special characters and adds no hash or separators when resource is top level and resouce name is short enougn', () => {
    const componentsPath = ['¯\\\_(ツ)_/¯-shruggie-gets-to-stay-¯\\\_(ツ)_/¯'];
    const expectedName = '¯\_(ツ)_/¯shruggiegetstostay¯\_(ツ)_/¯';

    expect(makeUniqueResourceName(componentsPath, { allowedSpecialCharacters: '¯\\\_(ツ)/', maxLength: 200, separator: '-' })).toEqual(expectedName);
  });

  test('unique resource name is shortened with a hash and separator added when resource is top level, resource name is too long, and separator is provided', () => {
    const tooLongName = ['anamethatisslightlylongerthan256charactersthatisalsoatoplevelresourcesothereisonlyonevalueinthisarrayandapparentlybrevityisnotthestrongpointofthepersonwhonamedthisresourcewhichIbettheywillcometoregretlaterbutitiswhatitisanywhodlethisfunctionshouldshortenthis'];
    const uniqueResourceName = makeUniqueResourceName(tooLongName, { separator: '~' });

    const expectedName = `anamethatisslightlylongerthan256charactersthatisalsoatoplevelresourcesothereisonlyonevalueinthisarrayandapparentlybrevityisnpointofthepersonwhonamedthisresourcewhichIbettheywillcometoregretlaterbutitiswhatitisanywhodlethisfunctionshouldshortenthis~${pathHash(tooLongName)}`;
    expect(uniqueResourceName).toEqual(expectedName);
    expect(uniqueResourceName.length).toEqual(256);
  });

  test('unique resource name removes special characters when they are included in the components names', () => {
    const componentsPath = ['I', 'love', 'special', 'characters', '¯\\\_(ツ)_/¯', 'for', 'real', 'though'];
    const expectedName = `Ilovespecialcharactersforrealthough${pathHash(componentsPath)}`;

    expect(makeUniqueResourceName(componentsPath, {})).toEqual(expectedName);
  });

  test('unique resource name removes special characters that are not allow listed and leaves the allowed ones', () => {
    const componentsPath = ['I-love-special-characters-', '¯\\\_(ツ)_/¯', '-for-real-though-'];
    const expectedName = `I-love-special-characters--for-real-though-${pathHash(componentsPath)}`;

    expect(makeUniqueResourceName(componentsPath, { allowedSpecialCharacters: '-' })).toEqual(expectedName);
  });

  test('unique resource name adds in separator and adds hash when separator is provided and name is not too long', () => {
    const componentsPath = ['This', 'unique', 'resource', 'name', 'needs', 'a', 'separator'];
    const expectedName = `This.*.unique.*.resource.*.name.*.needs.*.a.*.separator.*.${pathHash(componentsPath)}`;

    expect(makeUniqueResourceName(componentsPath, { separator: '.*.' })).toEqual(expectedName);
  });

  test('unique resource name adds in separator, adds hash, and shortens name when separator is provided and name too long', () => {
    const componentsPath = ['This', 'unique', 'resource', 'name', 'is', 'longer', 'than', 'allowed'];
    const expectedName = `This/unique/resourcelonger/than/allowed/${pathHash(componentsPath)}`;

    expect(makeUniqueResourceName(componentsPath, { maxLength: 48, separator: '/' })).toEqual(expectedName);
  });

  test('unique resource name with discriminator produces different names for same path', () => {
    const componentsPath = ['Stack', 'Construct', 'Resource'];
    const name1 = makeUniqueResourceName(componentsPath, { discriminator: '1' });
    const name2 = makeUniqueResourceName(componentsPath, { discriminator: '2' });

    expect(name1).not.toEqual(name2);
    // Both should have the same human-readable part but different hashes
    expect(name1.slice(0, -8)).toEqual(name2.slice(0, -8));
    expect(name1.slice(-8)).not.toEqual(name2.slice(-8));
  });

  test('unique resource name with same discriminator produces same name', () => {
    const componentsPath = ['Stack', 'Construct', 'Resource'];
    const name1 = makeUniqueResourceName(componentsPath, { discriminator: 'same' });
    const name2 = makeUniqueResourceName(componentsPath, { discriminator: 'same' });

    expect(name1).toEqual(name2);
  });

  test('unique resource name with discriminator includes hash even for short top-level resources', () => {
    const componentsPath = ['toplevelresource'];
    const name = makeUniqueResourceName(componentsPath, { discriminator: '1' });

    // Should include hash when discriminator is provided
    expect(name.length).toBeGreaterThan('toplevelresource'.length);
    expect(name).toMatch(/^toplevelresource[A-F0-9]{8}$/);
  });

  test('unique resource name discriminator is included in hash but not in human-readable part', () => {
    const componentsPath = ['Stack', 'MyResource'];
    const name = makeUniqueResourceName(componentsPath, { discriminator: 'my-discriminator' });

    // Human-readable part should not contain discriminator
    expect(name).not.toContain('my-discriminator');
    // Should end with hash
    expect(name).toMatch(/[A-F0-9]{8}$/);
    // Hash should be different from without discriminator
    const nameWithoutDiscriminator = makeUniqueResourceName(componentsPath, {});
    expect(name.slice(-8)).not.toEqual(nameWithoutDiscriminator.slice(-8));
  });

  test('unique resource name with discriminator works with separator', () => {
    const componentsPath = ['Stack', 'Resource'];
    const name1 = makeUniqueResourceName(componentsPath, { discriminator: '1', separator: '-' });
    const name2 = makeUniqueResourceName(componentsPath, { discriminator: '2', separator: '-' });

    expect(name1).not.toEqual(name2);
    // Both should have separator in human-readable part
    expect(name1).toContain('-');
    expect(name2).toContain('-');
  });
});
