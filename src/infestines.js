const AP = 'ap'
const CHAIN = 'chain'
const MAP = 'map'
const OF = 'of'

const FANTASY_LAND_SLASH = 'fantasy-land/'
const FANTASY_LAND_SLASH_OF = FANTASY_LAND_SLASH + OF
const FANTASY_LAND_SLASH_MAP = FANTASY_LAND_SLASH + MAP
const FANTASY_LAND_SLASH_AP = FANTASY_LAND_SLASH + AP
const FANTASY_LAND_SLASH_CHAIN = FANTASY_LAND_SLASH + CHAIN

const LENGTH = 'length'
const THEN = 'then'
const NAME = 'name'
const CONSTRUCTOR = 'constructor'
const PROTOTYPE = 'prototype'

//

export const id = x => x

//

function _defineNameU(fn, value) {
  return Object.defineProperty(fn, NAME, {value, configurable: true})
}

export const defineNameU = (() => {
  try {
    return _defineNameU(_defineNameU, 'defineName')
  } catch (_) {
    return (fn, _) => fn
  }
})()

//

const setName = process.env.NODE_ENV === 'production' ? x => x : defineNameU

const copyName =
  process.env.NODE_ENV === 'production'
    ? f => f
    : (to, from) => defineNameU(to, from[NAME])

const withName =
  process.env.NODE_ENV === 'production'
    ? id
    : ary => fn => copyName(ary(fn), fn)

//

const ary1of2 = withName(
  fn =>
    function(x0, x1) {
      const fnx0 = fn(x0)
      return arguments[LENGTH] < 2 ? fnx0 : fnx0(x1)
    }
)

const ary2of2 = withName(
  fn =>
    function(x0, x1) {
      return arguments[LENGTH] < 2 ? copyName(x1 => fn(x0, x1), fn) : fn(x0, x1)
    }
)

const ary1of3 = withName(
  fn =>
    function(x0, x1, x2) {
      const fnx0 = curryNU(2, fn(x0))
      const n = arguments[LENGTH]
      return n < 3 ? (n < 2 ? fnx0 : fnx0(x1)) : fnx0(x1, x2)
    }
)

const ary2of3 = withName(
  fn =>
    function(x0, x1, x2) {
      const n = arguments[LENGTH]
      if (n < 2) return ary1of2(copyName(x1 => fn(x0, x1), fn))
      const fnx0x1 = fn(x0, x1)
      return n < 3 ? fnx0x1 : fnx0x1(x2)
    }
)

const ary3of3 = withName(
  fn =>
    function(x0, x1, x2) {
      const n = arguments[LENGTH]
      return n < 3
        ? n < 2
          ? ary2of2(copyName((x1, x2) => fn(x0, x1, x2), fn))
          : copyName(x2 => fn(x0, x1, x2), fn)
        : fn(x0, x1, x2)
    }
)

const ary1of4 = withName(
  fn =>
    function(x0, x1, x2, x3) {
      const fnx0 = curryNU(3, fn(x0))
      const n = arguments[LENGTH]
      return n < 3
        ? n < 2
          ? fnx0
          : fnx0(x1)
        : n < 4
          ? fnx0(x1, x2)
          : fnx0(x1, x2, x3)
    }
)

const ary2of4 = withName(
  fn =>
    function(x0, x1, x2, x3) {
      const n = arguments[LENGTH]
      if (n < 2) return ary1of3(copyName(x1 => fn(x0, x1), fn))
      const fnx0x1 = curryNU(2, fn(x0, x1))
      return n < 4 ? (n < 3 ? fnx0x1 : fnx0x1(x2)) : fnx0x1(x2, x3)
    }
)

const ary3of4 = withName(
  fn =>
    function(x0, x1, x2, x3) {
      const n = arguments[LENGTH]
      return n < 3
        ? n < 2
          ? ary2of3(copyName((x1, x2) => fn(x0, x1, x2), fn))
          : ary1of2(copyName(x2 => fn(x0, x1, x2), fn))
        : n < 4
          ? fn(x0, x1, x2)
          : fn(x0, x1, x2)(x3)
    }
)

const ary4of4 = withName(
  fn =>
    function(x0, x1, x2, x3) {
      const n = arguments[LENGTH]
      return n < 3
        ? n < 2
          ? ary3of3(copyName((x1, x2, x3) => fn(x0, x1, x2, x3), fn))
          : ary2of2(copyName((x2, x3) => fn(x0, x1, x2, x3), fn))
        : n < 4
          ? copyName(x3 => fn(x0, x1, x2, x3), fn)
          : fn(x0, x1, x2, x3)
    }
)

//

const ary0of0 = fn => copyName(() => fn(), fn)
const ary1of1 = fn => copyName(x => fn(x), fn)

const C = [
  [ary0of0],
  [void 0, ary1of1],
  [void 0, ary1of2, ary2of2],
  [void 0, ary1of3, ary2of3, ary3of3],
  [void 0, ary1of4, ary2of4, ary3of4, ary4of4]
]

export const curryNU = function curryN(n, f) {
  return C[n][Math.min(n, f[LENGTH])](f)
}

export const curryN = ary2of2(curryNU)

export const arityNU = function arityN(n, f) {
  return C[n][n](f)
}

export const arityN = ary2of2(arityNU)

export const curry = f => arityN(f[LENGTH], f)

//

export const prop = ary1of2(function prop(p) {
  return setName(x => (null != x ? x[p] : void 0), p)
})

export const length = prop(LENGTH)

//

export const defineName = ary2of2(defineNameU)

//

export const create = Object.create

export const assign = Object.assign

export const toObject = x => assign({}, x)

export const toProtoless = o => assign(create(null), o)

//

export const ignore = _ => {}

export const scope = fn => fn()

export const always = ary1of2(function always(x) {
  return function always(_) {
    return x
  }
})

export const apU = function ap(x2y, x) {
  return x2y(x)
}

export const ap = ary2of2(apU)

export const apply = ary1of2(function apply(xs2y) {
  return xs => xs2y.apply(null, xs)
})

export function args() {
  let n = arguments[LENGTH]
  const xs = Array(n)
  while (n--) xs[n] = arguments[n]
  return xs
}

export const sndU = function snd(_, y) {
  return y
}

export const snd = ary1of2(function snd() {
  return id
})

//

export const freeze = x => x && Object.freeze(x)

const freezeInDev = process.env.NODE_ENV === 'production' ? id : freeze

export const array0 = freeze([])
export const object0 = freeze({})
export const protoless0 = freeze(toProtoless(object0))

//

export const isDefined = x => void 0 !== x
export const isUndefined = x => void 0 === x

//

const hasOwnProperty = Object[PROTOTYPE].hasOwnProperty

export const hasU = function has(p, x) {
  return hasOwnProperty.call(x, p)
}

export const has = ary2of2(hasU)

//

export const prototypeOf = x => (null == x ? x : Object.getPrototypeOf(x))

export const constructorOf = x =>
  null == x ? x : (hasU(CONSTRUCTOR, x) ? prototypeOf(x) : x)[CONSTRUCTOR]

//

export const isNil = x => null == x
export const isBoolean = x => !!x === x
export const isFunction = x => typeof x === 'function'
export const isString = x => typeof x === 'string'
export const isNumber = x => typeof x === 'number'

export const isInteger = Number.isInteger

export const isArray = Array.isArray

const object = prototypeOf({})
export const isObject = x =>
  null != x &&
  typeof x === 'object' &&
  (hasU(CONSTRUCTOR, x) ? prototypeOf(x) === object : x[CONSTRUCTOR] === Object)

//

export const isInstanceOfU = function isInstanceOf(C, x) {
  return x instanceof C
}

export const isInstanceOf = ary2of2(isInstanceOfU)

//

const rightSemiOp = ary2of2(function rightSemiOp(one, bop) {
  return function(_) {
    let n = arguments[LENGTH]
    let r = one(arguments[--n])
    while (n) r = bop(r, arguments[--n])
    return r
  }
})

//

const oU = function o(f, g) {
  return x => f(g(x))
}

export const o = ary2of2(oU)

export const pipe2U = function pipe2(fn1, fn2) {
  const n = fn1[LENGTH]
  return n === 1 ? oU(fn2, fn1) : arityN(n, (...xs) => fn2(fn1(...xs)))
}

export const pipe2 = ary2of2(pipe2U)

export const compose2U = function compose2(fn1, fn2) {
  return pipe2U(fn2, fn1)
}

export const compose2 = ary2of2(compose2U)

//

export function seq(x, ...fns) {
  for (let i = 0, n = fns[LENGTH]; i < n; ++i) x = fns[i](x)
  return x
}

export function seqPartial(x, ...fns) {
  for (let i = 0, n = fns[LENGTH]; isDefined(x) && i < n; ++i) x = fns[i](x)
  return x
}

//

export const identicalU = function identical(a, b) {
  return (a === b && (a !== 0 || 1 / a === 1 / b)) || (a !== a && b !== b)
}

export const identical = ary2of2(identicalU)

//

export const whereEqU = function whereEq(t, o) {
  for (const k in t) {
    const bk = o[k]
    if ((!isDefined(bk) && !hasU(k, o)) || !acyclicEqualsU(t[k], bk))
      return false
  }
  return true
}

export const whereEq = ary2of2(whereEqU)

//

export const hasKeysOfU = function hasKeysOf(t, o) {
  for (const k in t) if (!hasU(k, o)) return false
  return true
}

export const hasKeysOf = ary2of2(hasKeysOfU)

//

const acyclicEqualsObjectU = (a, b) => whereEqU(a, b) && hasKeysOfU(b, a)

function acyclicEqualsArrayU(a, b) {
  const n = a[LENGTH]
  if (n !== b[LENGTH]) return false
  for (let i = 0; i < n; ++i) if (!acyclicEqualsU(a[i], b[i])) return false
  return true
}

export const acyclicEqualsU = function acyclicEquals(a, b) {
  if (identicalU(a, b)) return true
  if (!a || !b) return false
  const c = constructorOf(a)
  if (c !== constructorOf(b)) return false
  switch (c) {
    case Array:
      return acyclicEqualsArrayU(a, b)
    case Object:
      return acyclicEqualsObjectU(a, b)
    default:
      return isFunction(a.equals) && a.equals(b)
  }
}

export const acyclicEquals = ary2of2(acyclicEqualsU)

//

export const unzipObjIntoU = function unzipObjInto(o, ks, vs) {
  for (const k in o) {
    if (ks) ks.push(k)
    if (vs) vs.push(o[k])
  }
}

export const unzipObjInto = ary3of3(unzipObjIntoU)

export function keys(o) {
  if (isInstanceOfU(Object, o)) {
    if (isObject(o)) {
      const ks = []
      unzipObjIntoU(o, ks, 0)
      return ks
    } else {
      return Object.keys(o)
    }
  }
}

export function values(o) {
  if (isInstanceOfU(Object, o)) {
    if (isObject(o)) {
      const vs = []
      unzipObjIntoU(o, 0, vs)
      return vs
    } else {
      const xs = Object.keys(o)
      const n = xs[LENGTH]
      for (let i = 0; i < n; ++i) xs[i] = o[xs[i]]
      return xs
    }
  }
}

//

export const assocPartialU = function assocPartial(k, v, o) {
  const r = {}
  if (o instanceof Object) {
    if (!isObject(o)) o = toObject(o)
    for (const l in o) {
      if (l !== k) {
        r[l] = o[l]
      } else {
        r[k] = v
        k = void 0
      }
    }
  }
  if (isDefined(k)) r[k] = v
  return r
}

export const assocPartial = ary3of3(assocPartialU)

export const dissocPartialU = function dissocPartial(k, o) {
  let r
  if (o instanceof Object) {
    if (!isObject(o)) o = toObject(o)
    for (const l in o) {
      if (l !== k) {
        if (!r) r = {}
        r[l] = o[l]
      } else {
        k = void 0
      }
    }
  }
  return r
}

export const dissocPartial = ary2of2(dissocPartialU)

//

export const inherit = (Derived, Base, protos, statics) =>
  (assign((Derived[PROTOTYPE] = create(Base && Base[PROTOTYPE])), protos)[
    CONSTRUCTOR
  ] = assign(Derived, statics))

//

export function Functor(map) {
  if (!isInstanceOfU(Functor, this)) return freezeInDev(new Functor(map))
  this[MAP] = map
}

export const Applicative = inherit(function Applicative(map, of, ap) {
  if (!isInstanceOfU(Applicative, this))
    return freezeInDev(new Applicative(map, of, ap))
  Functor.call(this, map)
  this[OF] = of
  this[AP] = ap
}, Functor)

export const Monad = inherit(function Monad(map, of, ap, chain) {
  if (!isInstanceOfU(Monad, this))
    return freezeInDev(new Monad(map, of, ap, chain))
  Applicative.call(this, map, of, ap)
  this[CHAIN] = chain
}, Applicative)

//

export const Identity = Monad(apU, id, apU, apU)

export const IdentityOrU = function IdentityOr(isOther, other) {
  const map = other[MAP]
  const ap = other[AP]
  const of = other[OF]
  const mapEither = (xy, xM) => (isOther(xM) ? map(xy, xM) : xy(xM))
  const apEither = (xyM, xM) =>
    isOther(xyM)
      ? isOther(xM)
        ? ap(xyM, xM)
        : map(xy => xy(xM), xyM)
      : mapEither(xyM, xM)
  const chain = other[CHAIN]
  if (chain) {
    const toOther = x => (isOther(x) ? x : of(x))
    return Monad(mapEither, id, apEither, function chainEither(xyM, xM) {
      return isOther(xM) ? chain(x => toOther(xyM(x)), xM) : xyM(xM)
    })
  } else {
    return Applicative(mapEither, id, apEither)
  }
}

export const IdentityOr = ary2of2(IdentityOrU)

//

export const isThenable = xP => null != xP && isFunction(xP[THEN])

const thenU = function then(xyP, xP) {
  return xP[THEN](xyP)
}

export const resolve = x => Promise.resolve(x)

export const reject = x => Promise.reject(x)

export const Async = Monad(
  thenU,
  resolve,
  function apAsync(xyP, xP) {
    return thenU(xy => thenU(xy, xP), xyP)
  },
  thenU
)

export const IdentityAsync = IdentityOrU(isThenable, Async)

//

const fantasyBop = m => setName((f, x) => x[m](f), m)
const fantasyMap = fantasyBop(FANTASY_LAND_SLASH_MAP)
const fantasyAp = fantasyBop(FANTASY_LAND_SLASH_AP)
const fantasyChain = fantasyBop(FANTASY_LAND_SLASH_CHAIN)

export const FantasyFunctor = Functor(fantasyMap)

export const fromFantasyApplicative = Type =>
  Applicative(fantasyMap, Type[FANTASY_LAND_SLASH_OF], fantasyAp)
export const fromFantasyMonad = Type =>
  Monad(fantasyMap, Type[FANTASY_LAND_SLASH_OF], fantasyAp, fantasyChain)

export const fromFantasy = Type =>
  Type[PROTOTYPE][FANTASY_LAND_SLASH_CHAIN]
    ? fromFantasyMonad(Type)
    : Type[FANTASY_LAND_SLASH_OF]
      ? fromFantasyApplicative(Type)
      : FantasyFunctor

//

export const addU = function add(x, y) {
  return x + y
}
export const add = ary1of2(function add(x) {
  return function add(y) {
    return x + y
  }
})

export const divide = ary1of2(function divide(x) {
  return function divide(y) {
    return x / y
  }
})

export const multiplyU = function multiply(x, y) {
  return x * y
}
export const multiply = ary1of2(function multiply(x) {
  return function multiply(y) {
    return x * y
  }
})

export const subtract = ary1of2(function subtract(x) {
  return function subtract(y) {
    return x - y
  }
})

//

export const subtractBy = ary1of2(function subtractBy(d) {
  return function subtractBy(n) {
    return n - d
  }
})

export const divideBy = ary1of2(function divideBy(d) {
  return function divideBy(n) {
    return n / d
  }
})

//

export const negate = x => -x
export const not = x => !x

//

export const greaterU = function greater(x, y) {
  return x > y
}
export const greater = ary1of2(function greater(x) {
  return function greater(y) {
    return x > y
  }
})

export const greaterEqU = function greaterEq(x, y) {
  return x >= y
}
export const greaterEq = ary1of2(function greaterEq(x) {
  return function greaterEq(y) {
    return x >= y
  }
})

export const lessU = function less(x, y) {
  return x < y
}
export const less = ary1of2(function less(x) {
  return function less(y) {
    return x < y
  }
})

export const lessEqU = function lessEq(x, y) {
  return x <= y
}
export const lessEq = ary1of2(function lessEq(x) {
  return function lessEq(y) {
    return x <= y
  }
})

//

export const test = ary2of2(function test(re, s) {
  return isString(s) && re.test(s)
})

//

export const toString = setName(add(''), 'toString')

//

const dispatch1 = n => setName(t => t[n](), n)
const dispatch2 = n => ary1of2(setName(x0 => t => t[n](x0), n))
const dispatch3 = n => ary2of3(setName((x0, x1) => t => t[n](x0, x1), n))

//

export const filter = dispatch2('filter')
export const forEach = dispatch2('forEach')
export const join = dispatch2('join')
export const map = dispatch2(MAP)
export const reduce = dispatch3('reduce')
export const reduceRight = dispatch3('reduceRight')
export const repeat = dispatch2('repeat')
export const replace = dispatch3('replace')
export const reverse = dispatch1('reverse')
export const then = dispatch2(THEN)
export const toLowerCase = dispatch1('toLowerCase')
export const toUpperCase = dispatch1('toUpperCase')

//

export const ascBy = keyOf => (l, r) => {
  l = keyOf(l)
  r = keyOf(r)
  return l < r ? -1 : r < l ? 1 : 0
}

export const descBy = keyOf => (l, r) => {
  l = keyOf(l)
  r = keyOf(r)
  return l < r ? 1 : r < l ? -1 : 0
}

const orOrderU = function orOrder(secondary, primary) {
  return (l, r) => {
    const result = primary(l, r)
    return result !== 0 ? result : secondary(l, r)
  }
}

export const orOrder = ary2of2(orOrderU)

export const ordering = setName(rightSemiOp(id, orOrderU), 'ordering')

//

const sortU = function sort(order, xs) {
  return Array[PROTOTYPE].slice.call(xs, 0).sort(order)
}

export const sort = ary2of2(sortU)
