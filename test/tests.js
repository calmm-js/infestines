import * as I from "../src/infestines"

function show(x) {
  switch (typeof x) {
  case "string":
  case "object":
    return JSON.stringify(x)
  default:
    return `${x}`
  }
}

const testEq = (expr, expect) => it(`${expr} => ${show(expect)}`, () => {
  const actual = eval(expr)
  if (!I.acyclicEqualsU(actual, expect))
    throw new Error(`Expected: ${show(expect)}, actual: ${show(actual)}`)
})

describe("currying", () => {
  testEq('I.curry2((x,y) => x+y)(1)(2)', 3)
  testEq('I.curry3((x,y,z) => x+y+z)(1)(2,3)', 6)
  testEq('I.curry4((a, b, c, d) => a+b+c+d).length', 4)
  testEq('I.curry4((a, b, c, d) => a+b+c+d)(1).length', 3)
  testEq('I.curry4((a, b, c, d) => a+b+c+d)(1,2).length', 2)
  testEq('I.curry4((a, b, c, d) => a+b+c+d)(1)(2, 3).length', 1)
  testEq('I.curry4((a, b, c, d) => a+b+c+d)(1,2,3,4)', 10)
  testEq('I.curry4((a, b, c, d) => a+b+c+d)(1,2,3)(4)', 10)
  testEq('I.curry4((a, b, c, d) => a+b+c+d)(1)(2,3,4)', 10)
})

describe("seq", () => {
  testEq('I.seq(11)', 11)
  testEq('I.seq(11, x => x + 1)', 12)
})

describe("seqPartial", () => {
  testEq('I.seqPartial(11)', 11)
  testEq('I.seqPartial(11, x => x+2)', 13)
  testEq('I.seqPartial(11, _ => undefined, x => x.wouldFail)', undefined)
})

describe("isObject", () => {
  testEq('I.isObject(null)', false)
  testEq('I.isObject({})', true)
  testEq('I.isObject([])', false)
})

describe("isArray", () => {
  testEq('I.isArray(null)', false)
  testEq('I.isArray({})', false)
  testEq('I.isArray([])', true)
})

export class Foo {
  constructor(v) {this.v = v}
  equals(other) {return this.v === other.v}
}

describe("identicalU", () => {
  testEq('I.identicalU(null, null)', true)
  testEq('I.identicalU(-0, +0)', false)
  testEq('I.identicalU(NaN, NaN)', true)
  testEq('I.identicalU({}, {})', false)
})

describe("acyclicEqualsU", () => {
  testEq('I.acyclicEqualsU(null, {})', false)
  testEq('I.acyclicEqualsU({a:1}, {a:1, b:2})', false)
  testEq('I.acyclicEqualsU([1,2], [1])', false)
  testEq('I.acyclicEqualsU([1,2], [1,3])', false)
  testEq('I.acyclicEqualsU({a: 1, b: [true]}, {b: [true], a: 1})', true)
  testEq('I.acyclicEqualsU({a: 1, b: [true]}, {b: [true]})', false)
  testEq('I.acyclicEqualsU([], {})', false)
  testEq('I.acyclicEqualsU(new Foo(1), new Foo(1))', true)
  testEq('I.acyclicEqualsU(new Foo(2), new Foo(1))', false)
})

describe("keys", () => {
  testEq('I.keys({})', [])
  testEq('I.keys({x: 1, y: 2})', ["x", "y"])
})

describe("values", () => {
  testEq('I.values({})', [])
  testEq('I.values({x: 1, y: 2})', [1, 2])
})

describe("unzipObj", () => {
  testEq('I.unzipObj({})', [[], []])
  testEq('I.unzipObj({x: 1, y: 2})', [["x", "y"], [1, 2]])
})

describe("zipObjPartialU", () => {
  testEq('I.zipObjPartialU([], [])', {})
  testEq('I.zipObjPartialU(["a", "b"], [1, 2])', {a: 1, b: 2})
  testEq('I.zipObjPartialU(["a", "b"], [undefined, 2])', {b: 2})
})

describe("mapPartialU", () => {
  testEq('I.mapPartialU(x => x < 0 ? -x : undefined, [1,-2,3,-4])', [2, 4])
})
