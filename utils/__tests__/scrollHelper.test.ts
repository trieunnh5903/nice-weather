import { getSnappedOffset } from "../scrollHelpers";

test("snap offset < max/2", () => {
  expect(getSnappedOffset(40, 100)).toBe(0);
});

test("snap offset > max/2", () => {
  expect(getSnappedOffset(70, 100)).toBe(100);
});

test("no snap needed", () => {
  expect(getSnappedOffset(0, 100)).toBeNull();
  expect(getSnappedOffset(150, 100)).toBeNull();
});
