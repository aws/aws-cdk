# AWS::Location Construct Library


This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

Amazon Location Service lets you add location data and functionality to applications, which
includes capabilities such as maps, points of interest, geocoding, routing, geofences, and
tracking. Amazon Location provides location-based services (LBS) using high-quality data from
global, trusted providers Esri and HERE. With affordable data, tracking and geofencing
capabilities, and built-in metrics for health monitoring, you can build sophisticated
location-enabled applications.

## Place Index

A key function of Amazon Location Service is the ability to search the geolocation information.
Amazon Location provides this functionality via the Place index resource. The place index includes
which [data provider](https://docs.aws.amazon.com/location/latest/developerguide/what-is-data-provider.html)
to use for the search.

To create a place index, define a `PlaceIndex`:

```ts
new location.PlaceIndex(this, 'PlaceIndex', {
  placeIndexName: 'MyPlaceIndex', // optional, defaults to a generated name
  dataSource: location.DataSource.HERE, // optional, defaults to Esri
});
```

Use the `grant()` or `grantSearch()` method to grant the given identity permissions to perform actions
on the place index:

```ts
declare const role: iam.Role;

const placeIndex = new location.PlaceIndex(this, 'PlaceIndex');
placeIndex.grantSearch(role);
```
