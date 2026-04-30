import { describe, it, expect } from "vitest";
import { toCsv } from "@/lib/csv";

describe("toCsv", () => {
  it("returns empty string on no rows", () => {
    expect(toCsv([])).toBe("");
  });
  it("escapes quotes by doubling them", () => {
    const csv = toCsv([{ a: 'hello "world"' }]);
    expect(csv).toContain('"hello ""world"""');
  });
  it("respects header order", () => {
    const csv = toCsv([{ a: 1, b: 2 }], ["b", "a"]);
    expect(csv.split("\n")[0]).toBe('"b","a"');
  });
});
