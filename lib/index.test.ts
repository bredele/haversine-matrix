import test from "node:test";
import assert from "node:assert";
import matrix, { getHaversineDistance, Point } from ".";

test("matrix function with empty array", () => {
  const result = matrix([]);
  assert.deepStrictEqual(result, []);
});

test("matrix function with single point", () => {
  const points: Point[] = [{ latitude: 0, longitude: 0 }];
  const result = matrix(points);
  assert.deepStrictEqual(result, [[0]]);
});

test("matrix function with two identical points", () => {
  const points: Point[] = [
    { latitude: 40.7128, longitude: -74.006 },
    { latitude: 40.7128, longitude: -74.006 },
  ];
  const result = matrix(points);
  assert.strictEqual(result.length, 2);
  assert.strictEqual(result[0][0], 0);
  assert.strictEqual(result[1][1], 0);
  assert.strictEqual(result[0][1], result[1][0]);
  assert(result[0][1] < 0.1); // Should be very close to 0
});

test("matrix function with two different points", () => {
  const points: Point[] = [
    { latitude: 40.7128, longitude: -74.006 }, // NYC
    { latitude: 34.0522, longitude: -118.2437 }, // LA
  ];
  const result = matrix(points);
  console.log("RESULT", result);
  assert.strictEqual(result.length, 2);
  assert.strictEqual(result[0][0], 0);
  assert.strictEqual(result[1][1], 0);
  assert.strictEqual(result[0][1], result[1][0]); // Symmetric
  assert(result[0][1] > 3900000); // ~3944km between NYC and LA
  assert(result[0][1] < 4000000);
});

test("matrix function with three points forms correct triangle", () => {
  const points: Point[] = [
    { latitude: 0, longitude: 0 },
    { latitude: 1, longitude: 0 },
    { latitude: 0, longitude: 1 },
  ];
  const result = matrix(points);
  assert.strictEqual(result.length, 3);

  // Diagonal should be zero
  assert.strictEqual(result[0][0], 0);
  assert.strictEqual(result[1][1], 0);
  assert.strictEqual(result[2][2], 0);

  // Matrix should be symmetric
  assert.strictEqual(result[0][1], result[1][0]);
  assert.strictEqual(result[0][2], result[2][0]);
  assert.strictEqual(result[1][2], result[2][1]);

  // All distances should be positive
  assert(result[0][1] > 0);
  assert(result[0][2] > 0);
  assert(result[1][2] > 0);
});

test("getHaversineDistance function with known distances", () => {
  // Distance between NYC and LA (approximately 3944 km)
  const nyc: Point = { latitude: 40.7128, longitude: -74.006 };
  const la: Point = { latitude: 34.0522, longitude: -118.2437 };
  const distance = getHaversineDistance(nyc, la);
  assert(distance > 3900000 && distance < 4000000);
});

test("getHaversineDistance with equator points", () => {
  const point1: Point = { latitude: 0, longitude: 0 };
  const point2: Point = { latitude: 0, longitude: 1 };
  const distance = getHaversineDistance(point1, point2);
  // 1 degree longitude at equator ≈ 111,320 meters
  assert(distance > 111000 && distance < 112000);
});

test("getHaversineDistance with same point", () => {
  const point: Point = { latitude: 45.0, longitude: 90.0 };
  const distance = getHaversineDistance(point, point);
  assert.strictEqual(distance, 0);
});

test("getHaversineDistance with antipodal points", () => {
  const point1: Point = { latitude: 0, longitude: 0 };
  const point2: Point = { latitude: 0, longitude: 180 };
  const distance = getHaversineDistance(point1, point2);
  // Half the Earth's circumference at equator ≈ 20,037,508 meters
  assert(distance > 20030000 && distance < 20040000);
});

test("getHaversineDistance with polar points", () => {
  const northPole: Point = { latitude: 90, longitude: 0 };
  const southPole: Point = { latitude: -90, longitude: 0 };
  const distance = getHaversineDistance(northPole, southPole);
  // Half the Earth's meridional circumference ≈ 20,037,508 meters
  assert(distance > 20030000 && distance < 20040000);
});

test("matrix function handles negative coordinates", () => {
  const points: Point[] = [
    { latitude: -33.8688, longitude: 151.2093 }, // Sydney
    { latitude: 55.7558, longitude: 37.6173 }, // Moscow
    { latitude: -22.9068, longitude: -43.1729 }, // Rio de Janeiro
  ];
  const result = matrix(points);
  assert.strictEqual(result.length, 3);

  // All distances should be positive
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (i !== j) {
        assert(result[i][j] > 0);
      }
    }
  }
});

test("matrix function with large dataset performance", () => {
  const points: Point[] = [];
  for (let i = 0; i < 50; i++) {
    points.push({
      latitude: Math.random() * 180 - 90,
      longitude: Math.random() * 360 - 180,
    });
  }

  const start = Date.now();
  const result = matrix(points);
  const elapsed = Date.now() - start;

  assert.strictEqual(result.length, 50);
  assert(elapsed < 1000); // Should complete within 1 second
});
