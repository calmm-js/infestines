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
  I.isFunction(expr)
    ? I.seq(
        expr,
        I.toString,
        I.replace(/^\(\) => /, ''),
        I.replace(/\s+/g, ' '),
        I.replace(/;\s*}/g, ' }')
      )
    : expr
const runExpr = expr => (I.isFunction(expr) ? expr() : eval(`() => ${expr}`)())

const testEq = (expr, expect) =>
  it(`${showExpr(expr)} => ${show(expect)}`, async () => {
    const actual = await runExpr(expr)
    function check(actual) {
      if (!R.equals(actual, expect))
        throw Error(`Expected: ${show(expect)}, actual: ${show(actual)}`)
    }
    if (I.isThenable(actual)) actual.then(check, check)
    else check(actual)
  })

const expectFail = expr =>
  it(`${showExpr(expr)} => failure`, async () => {
    let actual
    try {
      actual = await runExpr(expr)
    } catch (_e) {
      return
    }
    throw new Error(`Expected: failure, actual: ${show(actual)}`)
  })

function forAll(fn, x, n, cb) {
  function rec(n, x) {
    if (0 === n) cb(x)
    for (let i = 0; i < n; ++i) rec(i, fn(i, n, x))
  }
  rec(n, x)
}

function forAllFns(n, cb) {
  const args = R.times(i => `x${i}`, n)
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

  testEq(() => I.curry(I.args)('a'), [])
  testEq(() => I.arityN(1, I.args)('a', 'b'), ['a'])
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

describe('prop', () => {
  testEq(() => I.prop('any', null), undefined)
  testEq(() => I.prop('any', undefined), undefined)
  testEq(() => I.prop('any', {any: 101}), 101)
  testEq(() => I.prop('length', ['a']), 1)
})

describe('id', () => {
  testEq(() => I.id.length, 1)
  testEq(() => I.id('anything'), 'anything')
})

describe('pipe and compose', () => {
  testEq(() => I.pipe2(R.inc, I.negate)(1), -2)
  testEq(() => I.compose2(R.inc, I.negate)(1), 0)
  testEq(() => I.pipe2((a, b) => a + b, I.subtractBy(-1))(1, 2), 4)
  testEq(() => I.pipe2((a, b) => a + b, x => x + 1).length, 2)
  testEq(() => I.compose2(I.add(1), I.add)(1, 2), 4)
  testEq(() => I.compose2(x => x + 1, (a, b) => a + b).length, 2)
})

describe('uncurried', () => {
  testEq(() => I.addU(1, 2), 3)
  testEq(() => I.multiplyU(2, 3), 6)

  testEq(() => I.greaterU(1, 2), false)
  testEq(() => I.greaterEqU(1, 2), false)
  testEq(() => I.lessU(1, 2), true)
  testEq(() => I.lessEqU(1, 2), true)
})

describe('sort', () => {
  testEq(
    () =>
      I.sort(I.ordering(I.ascBy(I.prop(0)), I.descBy(I.prop(1))), [
        [2, 3],
        [6, 1],
        [5, 4],
        [3, 1],
        [5, 5],
        [8, 9]
      ]),
    [[2, 3], [3, 1], [5, 5], [5, 4], [6, 1], [8, 9]]
  )
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

describe('identical', () => {
  testEq(() => I.identical(null, null), true)
  testEq(() => I.identical(-0, +0), false)
  testEq(() => I.identical(NaN, NaN), true)
  testEq(() => I.identical({}, {}), false)
})

describe('acyclicEquals', () => {
  testEq(() => I.acyclicEquals(null, {}), false)
  testEq(() => I.acyclicEquals({a: 1}, {a: 1, b: 2}), false)
  testEq(() => I.acyclicEquals([1, 2], [1]), false)
  testEq(() => I.acyclicEquals([1, 2], [1, 3]), false)
  testEq(() => I.acyclicEquals({a: 1, b: [true]}, {b: [true], a: 1}), true)
  testEq(() => I.acyclicEquals({a: 1, b: [true]}, {b: [true]}), false)
  testEq(() => I.acyclicEquals([], {}), false)
  testEq(() => I.acyclicEquals(new Foo(1), new Foo(1)), true)
  testEq(() => I.acyclicEquals(new Foo(2), new Foo(1)), false)
})

const XYZ = I.inherit(
  function XYZ(x, y, z) {
    this.x = x
    this.y = y
    this.z = z
  },
  Object,
  {
    sum() {
      return this.x + this.y + this.z
    }
  }
)

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

describe('unzipObjInto', () => {
  testEq(
    () => {
      const ks = [],
        vs = []
      I.unzipObjInto({x: 1, y: 2}, ks, vs)
      return [ks, vs]
    },
    [['x', 'y'], [1, 2]]
  )
  testEq(
    () => {
      const kvs = []
      I.unzipObjInto({x: 1, y: 2}, kvs, kvs)
      return kvs
    },
    ['x', 1, 'y', 2]
  )
})

describe('assocPartial', () => {
  testEq(() => I.assocPartial('x', 1, null), {x: 1})
  testEq(() => I.assocPartial('x', 1, undefined), {x: 1})
  testEq(() => I.assocPartial('x', 2, {x: 1}), {x: 2})
  testEq(() => I.assocPartial('x', 2, {z: 1}), {z: 1, x: 2})
  testEq(() => I.assocPartial('x', -1, new XYZ(3, 1, 4)), {x: -1, y: 1, z: 4})
})

describe('dissocPartial', () => {
  testEq(() => I.dissocPartial('x', null), undefined)
  testEq(() => I.dissocPartial('x', undefined), undefined)
  testEq(() => I.dissocPartial('x', {}), undefined)
  testEq(() => I.dissocPartial('x', {x: 1}), undefined)
  testEq(() => I.dissocPartial('x', {x: 1, y: 2}), {y: 2})
  testEq(() => I.dissocPartial('y', new XYZ(3, 1, 4)), {x: 3, z: 4})
})

describe('isDefined', () => {
  testEq(() => I.isDefined(undefined), false)
  testEq(() => I.isDefined(I.divide(0, 0)), true)
  testEq(() => I.isDefined(null), true)
  testEq(() => I.isDefined('anything except undefined'), true)
})

describe('isUndefined', () => {
  testEq(() => I.isUndefined(undefined), true)
  testEq(() => I.isUndefined(I.divideBy(0, 0)), false)
  testEq(() => I.isUndefined(null), false)
  testEq(() => I.isUndefined('anything except undefined'), false)
})

describe('isNil', () => {
  testEq(() => I.isNil(undefined), true)
  testEq(() => I.isNil(0 / 0), false)
  testEq(() => I.isNil(null), true)
  testEq(() => I.isNil('anything except null or undefined'), false)
})

describe('isBoolean', () => {
  testEq(() => I.isBoolean(true), true)
  testEq(() => I.isBoolean(I.not(true)), true)
  testEq(() => I.isBoolean(0 / 0), false)
  testEq(() => I.isBoolean(null), false)
  testEq(() => I.isBoolean('anything except null or undefined'), false)
})

describe('ignore', () => {
  testEq(() => I.ignore('anything'), undefined)
})

describe('scope', () => {
  testEq(() => I.scope((a = 3, b = 2) => I.multiply(a, b)), 6)
})

describe('always', () => {
  testEq(() => I.always.length, 2)
  testEq(() => I.always(2).length, 1)
  testEq(() => I.always(1)(0), 1)
})

describe('ap', () => {
  testEq(() => I.ap(I.subtract(1), 2), -1)
})

describe('apply', () => {
  testEq(() => I.apply(Math.min, [3, 1, 4]), 1)
})

describe('snd', () => {
  testEq(() => I.snd('a')('b'), 'b')
  testEq(() => I.sndU('a', 'b'), 'b')
})

describe('toString', () => {
  testEq(() => I.toString(null), 'null')
  testEq(() => I.toString(undefined), 'undefined')
  testEq(() => I.toString({}), '[object Object]')
  testEq(() => I.toString('a string'), 'a string')
})

describe('has', () => {
  testEq(() => I.has('constructor', {}), false)
  testEq(() => I.has('length', []), true)
  testEq(() => I.has('x', {x: 0}), true)
  testEq(() => I.has('y', {x: 0}), false)
})

describe('comparisons', () => {
  testEq(() => I.less(1, 2), true)
  testEq(() => I.less('a', 'a'), false)
  testEq(() => I.lessEq('b', 'a'), false)
  testEq(() => I.lessEq('b', 'b'), true)
  testEq(() => I.greater(1, 2), false)
  testEq(() => I.greater('2', '1'), true)
  testEq(() => I.greaterEq(1, 2), false)
  testEq(() => I.greaterEq(2, 2), true)
})

describe('curried methods', () => {
  testEq(() => I.replace(/a/g, 'b', 'abba'), 'bbbb')
  testEq(() => I.repeat(4, 'a'), 'aaaa')
  testEq(() => I.toLowerCase('AB'), 'ab')
  testEq(() => I.toUpperCase('ba'), 'BA')
  testEq(() => I.test(/ob/)('foobar'), true)
  testEq(() => I.filter(I.isNil)([1, null, 2]), [null])
  testEq(() => I.map(I.add(1))([2, 0]), [3, 1])
  testEq(() => I.join(', ')([1, 2]), '1, 2')
  testEq(() => I.reduceRight((s, x) => [s, x])(null)([1, 2, 3]), [
    [[null, 3], 2],
    1
  ])
  testEq(() => I.reduce((s, x) => [s, x])(null)([1, 2, 3]), [[[null, 1], 2], 3])
})

describe('inherit', () => {
  testEq(() => {
    function Base(foo) {
      this._foo = foo
    }
    I.inherit(
      Base,
      null,
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

describe('reject', () => {
  expectFail(() => I.reject(Error('bye')))
})

const traverse = ({map, of, ap}, f, o) => {
  let r = of(0)
  for (const k in o) r = ap(map(v => r => [k, v, r], f(o[k])), r)
  return map(kvs => {
    const r = I.isArray(o) ? [] : I.create(I.prototypeOf(o))
    while (kvs) {
      r[kvs[0]] = kvs[1]
      kvs = kvs[2]
    }
    return r
  }, r)
}

describe('IdentityAsync', () => {
  const IF = I.Functor(I.IdentityAsync.map)
  const IA = I.Applicative(IF.map, I.IdentityAsync.of, I.IdentityAsync.ap)

  testEq(() => traverse(IA, I.id, ['a', 'b']), ['a', 'b'])
  testEq(() => traverse(IA, I.id, {x: 'a', y: I.resolve('b')}), {
    x: 'a',
    y: 'b'
  })
  testEq(() => traverse(IA, I.id, [I.resolve('a'), 'b']), ['a', 'b'])
  testEq(() => traverse(IA, I.id, [I.resolve('a'), I.resolve('b')]), ['a', 'b'])
  testEq(() => I.IdentityAsync.chain(x => x + 2, 1), 3)
  testEq(() => I.IdentityAsync.chain(x => x + 2, I.resolve(1)), 3)
  testEq(() => I.IdentityAsync.chain(x => I.resolve(x + 2), I.resolve(1)), 3)
})

describe('fantasy interop', () => {
  class MaybeFunctor {
    ['fantasy-land/map'](f) {
      return new Some(f(this.value))
    }
  }
  class MaybeApplicative extends MaybeFunctor {
    static ['fantasy-land/of'](x) {
      return new Some(x)
    }
    ['fantasy-land/ap'](f) {
      return f instanceof Some ? new Some(f.value(this.value)) : new None()
    }
  }
  class MaybeMonad extends MaybeApplicative {
    ['fantasy-land/chain'](f) {
      return f(this.value)
    }
  }
  class None extends MaybeMonad {
    ['fantasy-land/map'](_f) {
      return this
    }
    ['fantasy-land/ap'](_f) {
      return this
    }
    ['fantasy-land/chain'](_f) {
      return this
    }
  }
  class Some extends MaybeMonad {
    constructor(value) {
      super()
      this.value = value
    }
  }
  testEq(
    () => I.fromFantasy(MaybeFunctor).map(x => ({x}), new Some(3)),
    new Some({x: 3})
  )
  testEq(
    () =>
      traverse(
        I.IdentityOrU(x => x instanceof Some, I.fromFantasy(MaybeApplicative)),
        I.id,
        [new Some(3), 1, new Some(4)]
      ),
    new Some([3, 1, 4])
  )
  testEq(
    () =>
      traverse(I.fromFantasy(MaybeApplicative), I.id, [
        new Some(3),
        new None(),
        new Some(4)
      ]),
    new None()
  )
  testEq(
    () =>
      traverse(I.fromFantasy(MaybeMonad), I.id, [
        new Some(3),
        new Some(1),
        new Some(4)
      ]),
    new Some([3, 1, 4])
  )
})

if (process.env.NODE_ENV !== 'production')
  describe('function names', () => {
    for (const k in I) {
      if (I.isFunction(I[k])) {
        testEq(() => I[k].name, k.replace(/U$/, ''))
      }
    }
  })
