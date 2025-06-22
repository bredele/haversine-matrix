# haversine-matrix

Returns distance matrix for collection of latitude/longitude points using the Haversine formula. Haversime formula is accurate for most geospatial applications as long as it assumes a perfect sphere.

## Installation

```sh
npm install haversine-matrix
```

## Usage

```ts
import matrix from "haversine-matrix";

matrix([
  { latitude: 40.7128, longitude: -74.006 },
  { latitude: 34.0522, longitude: -118.2437 },
]);
// => [ [ 0, 3940155.2046990567 ], [ 3940155.2046990567, 0 ] ]

matrix([
  { latitude: 40.7128, longitude: -74.006 },
  { latitude: 40.7128, longitude: -74.006 },
]);
// => [ [ 0, 0 ], [ 0, 0 ] ]
```
