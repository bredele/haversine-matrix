// equatorial radius (semi major axis)
const equatorialRadius = 6378137;

export type Point = {
  latitude: number;
  longitude: number;
};

export const getHaversineDistance = (start: Point, end: Point) => {
  const startLat = radians(start.latitude);
  const endLat = radians(end.latitude);
  const startLng = radians(start.longitude);
  const endLng = radians(end.longitude);

  const haversineOfCentralAngle =
    haversine(endLat - startLat) +
    Math.cos(startLat) * Math.cos(endLat) * haversine(endLng - startLng);
  return (
    2 *
    equatorialRadius *
    Math.atan2(
      Math.sqrt(haversineOfCentralAngle),
      Math.sqrt(1 - haversineOfCentralAngle)
    )
  );
};

/**
 * Convert angle from degress to radians.
 */

const radians = (x: number) => {
  return (x * Math.PI) / 180.0;
};

/**
 * Haversine function widely used in geodesy and navigation to get
 * distance between two points on a "perfect" sphere.
 */

const haversine = (x: number) => {
  return Math.sin(x / 2) * Math.sin(x / 2);
};

/**
 * Return 2D matrix of distances between points.
 */

export const matrix = (points: Point[]): number[][] => {
  const n = points.length;
  const result: number[][] = new Array(n);

  for (let i = 0; i < n; i++) {
    result[i] = new Array(n);
    for (let j = 0; j < n; j++) {
      if (i === j) {
        result[i][j] = 0;
      } else if (j < i) {
        result[i][j] = result[j][i];
      } else {
        result[i][j] = getHaversineDistance(points[i], points[j]);
      }
    }
  }

  return result;
};

export default matrix;
