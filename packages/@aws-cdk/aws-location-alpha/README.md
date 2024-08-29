# AWS::Location Construct Library
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

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

## Geofence Collection

Geofence collection resources allow you to store and manage geofences—virtual boundaries on a map.
You can evaluate locations against a geofence collection resource and get notifications when the location
update crosses the boundary of any of the geofences in the geofence collection.

```ts
declare const key: kms.Key;

new location.GeofenceCollection(this, 'GeofenceCollection', {
  geofenceCollectionName: 'MyGeofenceCollection', // optional, defaults to a generated name
  kmsKey: key, // optional, defaults to use an AWS managed key
});
```

Use the `grant()` or `grantRead()` method to grant the given identity permissions to perform actions
on the geofence collection:

```ts
declare const role: iam.Role;

const geofenceCollection = new location.GeofenceCollection(this, 'GeofenceCollection', {
  geofenceCollectionName: 'MyGeofenceCollection',
});

geofenceCollection.grantRead(role);
```
