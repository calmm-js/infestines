import * as I from '../dist/infestines.cjs'
import * as R from 'ramda'

function show(x) {
  switch (typeof x) {
    case 'string':
    case 'object':
      return JSON.stringify(x)
    default:
      return `${x}`
  }
}

const showExpr = expr =>
  R.is(Function, expr)
    ? expr
        .toString()
        .replace(/^\(\) => /, '')
        .replace(/\s+/g, ' ')
        .replace(/;\s*}/g, ' }')
    : expr
const runExpr = expr =>
  R.is(Function, expr) ? expr() : eval(`() => ${expr}`)()

const testEq = (expr, expect) =>
  it(`${showExpr(expr)} => ${show(expect)}`, () => {
    const actual = runExpr(expr)
    if (!I.acyclicEqualsU(actual, expect))
      throw new Error(`Expected: ${show(expect)}, actual: ${show(actual)}`)
  })

const expectFail = expr =>
  it(`${showExpr(expr)} => failure`, () => {
    try {
      const actual = runExpr(expr)
      throw new Error(`Expected: failure, actual: ${show(actual)}`)
    } catch (_e) {
      return
    }
  })

function forAll(fn, x, n, cb) {
  function rec(n, x) {
    if (0 === n) cb(x)
    for (let i = 0; i < n; ++i) rec(i, fn(i, n, x))
  }
  rec(n, x)
}

function forAllFns(n, cb) {
  const args = R.map(i => `x${i}`, R.range(0, n))
  forAll((i, m, body) => `(${args.slice(i, m)}) => ${body}`, `[${args}]`, n, cb)
}

function forAllApplys(fn, n, cb) {
  const vals = R.range(0, n)
  forAll((i, m, lhs) => `${lhs}(${vals.slice(n - m, n - i)})`, `(${fn})`, n, cb)
}

describe('currying', () => {
  for (let n = 2; n <= 4; ++n) {
    forAllFns(n, fn =>
      forAllApplys(`I.curryN(${n}, ${fn})`, n, expr => {
        testEq(expr, R.range(0, n))
      })
    )
  }

  testEq(() => I.curry(x => x + 1)(1), 2)
  testEq(() => I.curry((x, y) => x + y)(1)(2), 3)
  testEq(() => I.curry((x, y, z) => x + y + z)(1)(2, 3), 6)
  testEq(() => I.curry((a, b, c, d) => a + b + c + d).length, 4)
  testEq(() => I.curry((a, b, c, d) => a + b + c + d)(1).length, 3)
  testEq(() => I.curry((a, b, c, d) => a + b + c + d)(1, 2).length, 2)
  testEq(() => I.curry((a, b, c, d) => a + b + c + d)(1)(2, 3).length, 1)
  testEq(() => I.curry((a, b, c, d) => a + b + c + d)(1, 2, 3, 4), 10)
  testEq(() => I.curry((a, b, c, d) => a + b + c + d)(1, 2, 3)(4), 10)
  testEq(() => I.curry((a, b, c, d) => a + b + c + d)(1)(2, 3, 4), 10)

  expectFail(() => I.curry(() => {}))
  expectFail(() => I.curry((_a, _b, _c, _d, _e) => {}))
})

describe('curry', () => {
  testEq(
    () => {
      const foobar = I.curry(function foobar(x, y) {
        return x + y
      })
      return [foobar.name, foobar(1).name]
    },
    ['foobar', 'foobar']
  )
})

describe('arity', () => {
  testEq(() => I.arityN(0, _x => 101)(), 101)
  testEq(() => I.arityN(1, (_x, _y) => 42)(), 42)
})

describe('id', () => {
  testEq(() => I.id.length, 1)
  testEq(() => I.id('anything'), 'anything')
})

describe('pipe and compose', () => {
  testEq(() => I.pipe2U(R.inc, R.negate)(1), -2)
  testEq(() => I.compose2U(R.inc, R.negate)(1), 0)
  testEq(() => I.pipe2U((a, b) => a + b, x => x + 1)(1, 2), 4)
  testEq(() => I.pipe2U((a, b) => a + b, x => x + 1).length, 2)
  testEq(() => I.compose2U(x => x + 1, (a, b) => a + b)(1, 2), 4)
  testEq(() => I.compose2U(x => x + 1, (a, b) => a + b).length, 2)
})

describe('seq', () => {
  testEq(() => I.seq(11), 11)
  testEq(() => I.seq(11, x => x + 1), 12)
})

describe('seqPartial', () => {
  testEq(() => I.seqPartial(11), 11)
  testEq(() => I.seqPartial(11, x => x + 2), 13)
  testEq(() => I.seqPartial(11, _ => undefined, x => x.wouldFail), undefined)
})

describe('array0', () => {
  testEq(() => I.array0, [])
})

describe('object0', () => {
  testEq(() => I.object0, {})
})

describe('isObject', () => {
  testEq(() => I.isObject(null), false)
  testEq(() => I.isObject({}), true)
  testEq(() => I.isObject([]), false)
  testEq(() => I.isObject({constructor: 'haha'}), true)
  testEq(() => I.isObject({constructor: Array}), true)
})

describe('isArray', () => {
  testEq(() => I.isArray(null), false)
  testEq(() => I.isArray({}), false)
  testEq(() => I.isArray([]), true)
  testEq(() => I.isArray({constructor: Array}), false)
})

describe('isNumber', () => {
  testEq(() => I.isNumber(null), false)
  testEq(() => I.isNumber({}), false)
  testEq(() => I.isNumber(101), true)
})

describe('isString', () => {
  testEq(() => I.isString(null), false)
  testEq(() => I.isString({}), false)
  testEq(() => I.isString('42'), true)
})

export class Foo {
  constructor(v) {
    this.v = v
  }
  equals(other) {
    return this.v === other.v
  }
}

describe('identicalU', () => {
  testEq(() => I.identicalU(null, null), true)
  testEq(() => I.identicalU(-0, +0), false)
  testEq(() => I.identicalU(NaN, NaN), true)
  testEq(() => I.identicalU({}, {}), false)
})

describe('acyclicEqualsU', () => {
  testEq(() => I.acyclicEqualsU(null, {}), false)
  testEq(() => I.acyclicEqualsU({a: 1}, {a: 1, b: 2}), false)
  testEq(() => I.acyclicEqualsU([1, 2], [1]), false)
  testEq(() => I.acyclicEqualsU([1, 2], [1, 3]), false)
  testEq(() => I.acyclicEqualsU({a: 1, b: [true]}, {b: [true], a: 1}), true)
  testEq(() => I.acyclicEqualsU({a: 1, b: [true]}, {b: [true]}), false)
  testEq(() => I.acyclicEqualsU([], {}), false)
  testEq(() => I.acyclicEqualsU(new Foo(1), new Foo(1)), true)
  testEq(() => I.acyclicEqualsU(new Foo(2), new Foo(1)), false)
})

function XYZ(x, y, z) {
  this.x = x
  this.y = y
  this.z = z
}
XYZ.prototype.sum = function() {
  return this.x + this.y + this.z
}

describe('keys', () => {
  testEq(() => I.keys(null), undefined)
  testEq(() => I.keys({}), [])
  testEq(() => I.keys({x: 1, y: 2}), ['x', 'y'])
  testEq(() => I.keys(new XYZ(3, 1, 4)), ['x', 'y', 'z'])
})

describe('values', () => {
  testEq(() => I.values(0), undefined)
  testEq(() => I.values({}), [])
  testEq(() => I.values({x: 1, y: 2}), [1, 2])
  testEq(() => I.values(new XYZ(3, 1, 4)), [3, 1, 4])
})

describe('unzipObjIntoU', () => {
  testEq(
    () => {
      const ks = [],
        vs = []
      I.unzipObjIntoU({x: 1, y: 2}, ks, vs)
      return [ks, vs]
    },
    [['x', 'y'], [1, 2]]
  )
  testEq(
    () => {
      const kvs = []
      I.unzipObjIntoU({x: 1, y: 2}, kvs, kvs)
      return kvs
    },
    ['x', 1, 'y', 2]
  )
})

describe('assocPartialU', () => {
  testEq(() => I.assocPartialU('x', 1, null), {x: 1})
  testEq(() => I.assocPartialU('x', 1, undefined), {x: 1})
  testEq(() => I.assocPartialU('x', 2, {x: 1}), {x: 2})
  testEq(() => I.assocPartialU('x', 2, {z: 1}), {z: 1, x: 2})
  testEq(() => I.assocPartialU('x', -1, new XYZ(3, 1, 4)), {x: -1, y: 1, z: 4})
})

describe('dissocPartialU', () => {
  testEq(() => I.dissocPartialU('x', null), undefined)
  testEq(() => I.dissocPartialU('x', undefined), undefined)
  testEq(() => I.dissocPartialU('x', {}), undefined)
  testEq(() => I.dissocPartialU('x', {x: 1}), undefined)
  testEq(() => I.dissocPartialU('x', {x: 1, y: 2}), {y: 2})
  testEq(() => I.dissocPartialU('y', new XYZ(3, 1, 4)), {x: 3, z: 4})
})

describe('isDefined', () => {
  testEq(() => I.isDefined(undefined), false)
  testEq(() => I.isDefined(0 / 0), true)
  testEq(() => I.isDefined(null), true)
  testEq(() => I.isDefined('anything except undefined'), true)
})

describe('always', () => {
  testEq(() => I.always.length, 1)
  testEq(() => I.always(2).length, 1)
  testEq(() => I.always(1)(0), 1)
})

describe('applyU', () => {
  testEq(() => I.applyU(x => x + 1, 2), 3)
})

describe('sndU', () => {
  testEq(() => I.sndU('a', 'b'), 'b')
})

describe('hasU', () => {
  testEq(() => I.hasU('constructor', {}), false)
  testEq(() => I.hasU('length', []), true)
  testEq(() => I.hasU('x', {x: 0}), true)
  testEq(() => I.hasU('y', {x: 0}), false)
})

describe('inherit', () => {
  testEq(() => {
    function Base(foo) {
      this._foo = foo
    }
    I.inherit(
      Base,
      Object,
      {
        Foo() {
          return this.Bar() + this._foo
        }
      },
      {
        bar: 11
      }
    )
    function Derived(foo) {
      Base.call(this, foo)
    }
    I.inherit(Derived, Base, {
      Bar() {
        return 10 + Base.bar
      }
    })
    return new Derived(5).Foo()
  }, 26)
})

if (process.env.NODE_ENV !== 'production')
  describe('function names', () => {
    for (const k in I) {
      if (I.isFunction(I[k])) {
        testEq(() => I[k].name, k.replace(/U$/, ''))
      }
    }
  })
