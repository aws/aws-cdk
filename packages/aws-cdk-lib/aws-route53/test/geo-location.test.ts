import * as route53 from '../lib';

describe('geo location', () => {
  test('invalid continent', () => {
    const error = /Invalid format for continent: .*/;
    expect(() => { route53.GeoLocation.continent('eu'); }).toThrow(error);
    expect(() => { route53.GeoLocation.continent('12'); }).toThrow(error);
    expect(() => { route53.GeoLocation.continent('abc'); }).toThrow(error);
    expect(() => { route53.GeoLocation.continent('A'); }).toThrow(error);
  });

  test('valid continent', () => {
    expect(route53.GeoLocation.continent('EU').continentCode).toEqual('EU');
  });

  test('invalid country', () => {
    const error = /Invalid country format for country: .*/;
    expect(() => { route53.GeoLocation.country('de'); }).toThrow(error);
    expect(() => { route53.GeoLocation.country('us'); }).toThrow(error);
    expect(() => { route53.GeoLocation.country('a'); }).toThrow(error);
    expect(() => { route53.GeoLocation.country('abc'); }).toThrow(error);
    expect(() => { route53.GeoLocation.country('01'); }).toThrow(error);
  });

  test('valid country', () => {
    expect(route53.GeoLocation.country('EU').countryCode).toEqual('EU');
    expect(route53.GeoLocation.country('US').countryCode).toEqual('US');
  });

  test('invalid subdivision', () => {
    const error = /Invalid subdivision format for subdivision: .*/;
    expect(() => { route53.GeoLocation.subdivision('aa'); }).toThrow(error);
    expect(() => { route53.GeoLocation.subdivision('ABCD'); }).toThrow(error);
    expect(() => { route53.GeoLocation.subdivision('abc'); }).toThrow(error);
    expect(() => { route53.GeoLocation.subdivision('1234'); }).toThrow(error);
  });

  test('valid subdivision', () => {
    expect(route53.GeoLocation.subdivision('WA').subdivisionCode).toEqual('WA');
    expect(route53.GeoLocation.subdivision('05', 'UA').subdivisionCode).toEqual('05');
  });

  test('default record', () => {
    expect(route53.GeoLocation.default().countryCode).toEqual('*');
  });
});