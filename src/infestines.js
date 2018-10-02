const AP = 'ap'
const CHAIN = 'chain'
const MAP = 'map'
const OF = 'of'

const FANTASY_LAND_SLASH = 'fantasy-land/'
const FANTASY_LAND_SLASH_OF = FANTASY_LAND_SLASH + OF
const FANTASY_LAND_SLASH_MAP = FANTASY_LAND_SLASH + MAP
const FANTASY_LAND_SLASH_AP = FANTASY_LAND_SLASH + AP
const FANTASY_LAND_SLASH_CHAIN = FANTASY_LAND_SLASH + CHAIN

const CONSTRUCTOR = 'constructor'
const PROTOTYPE = 'prototype'

//

export const id = x => x

//

function _defineNameU(fn, value) {
  return Object.defineProperty(fn, 'name', {value, configurable: true})
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
    : (to, from) => defineNameU(to, from.name)

const withName =
  process.env.NODE_ENV === 'production'
    ? id
    : ary => fn => copyName(ary(fn), fn)

//

const ary1of2 = withName(
  fn =>
    function(x0, x1) {
      const fnx0 = fn(x0)
      return arguments.length < 2 ? fnx0 : fnx0(x1)
    }
)

const ary2of2 = withName(
  fn =>
    function(x0, x1) {
      return arguments.length < 2 ? copyName(x1 => fn(x0, x1), fn) : fn(x0, x1)
    }
)

const ary1of3 = withName(
  fn =>
    function(x0, x1, x2) {
      const fnx0 = curryN(2, fn(x0))
      switch (arguments.length) {
        case 0:
        case 1:
          return fnx0
        case 2:
          return fnx0(x1)
        default:
          return fnx0(x1, x2)
      }
    }
)

const ary2of3 = withName(
  fn =>
    function(x0, x1, x2) {
      switch (arguments.length) {
        case 0:
        case 1:
          return ary1of2(copyName(x1 => fn(x0, x1), fn))
        case 2:
          return fn(x0, x1)
        default:
          return fn(x0, x1)(x2)
      }
    }
)

const ary3of3 = withName(
  fn =>
    function(x0, x1, x2) {
      switch (arguments.length) {
        case 0:
        case 1:
          return ary2of2(copyName((x1, x2) => fn(x0, x1, x2), fn))
        case 2:
          return copyName(x2 => fn(x0, x1, x2), fn)
        default:
          return fn(x0, x1, x2)
      }
    }
)

const ary1of4 = withName(
  fn =>
    function(x0, x1, x2, x3) {
      const fnx0 = curryN(3, fn(x0))
      switch (arguments.length) {
        case 0:
        case 1:
          return fnx0
        case 2:
          return fnx0(x1)
        case 3:
          return fnx0(x1, x2)
        default:
          return fnx0(x1, x2, x3)
      }
    }
)

const ary2of4 = withName(
  fn =>
    function(x0, x1, x2, x3) {
      switch (arguments.length) {
        case 0:
        case 1:
          return ary1of3(copyName(x1 => fn(x0, x1), fn))
        case 2:
          return curryN(2, fn(x0, x1))
        case 3:
          return curryN(2, fn(x0, x1))(x2)
        default:
          return curryN(2, fn(x0, x1))(x2, x3)
      }
    }
)

const ary3of4 = withName(
  fn =>
    function(x0, x1, x2, x3) {
      switch (arguments.length) {
        case 0:
        case 1:
          return ary2of3(copyName((x1, x2) => fn(x0, x1, x2), fn))
        case 2:
          return ary1of2(copyName(x2 => fn(x0, x1, x2), fn))
        case 3:
          return fn(x0, x1, x2)
        default:
          return fn(x0, x1, x2)(x3)
      }
    }
)

const ary4of4 = withName(
  fn =>
    function(x0, x1, x2, x3) {
      switch (arguments.length) {
        case 0:
        case 1:
          return ary3of3(copyName((x1, x2, x3) => fn(x0, x1, x2, x3), fn))
        case 2:
          return ary2of2(copyName((x2, x3) => fn(x0, x1, x2, x3), fn))
        case 3:
          return copyName(x3 => fn(x0, x1, x2, x3), fn)
        default:
          return fn(x0, x1, x2, x3)
      }
    }
)

const ary0of0 = fn => (fn.length === 0 ? fn : copyName(() => fn(), fn))
const ary1of1 = fn => (fn.length === 1 ? fn : copyName(x => fn(x), fn))

const C = [
  [ary0of0],
  [ary1of1, ary1of1],
  [void 0, ary1of2, ary2of2],
  [void 0, ary1of3, ary2of3, ary3of3],
  [void 0, ary1of4, ary2of4, ary3of4, ary4of4]
]

export const curryNU = function curryN(n, f) {
  return C[n][Math.min(n, f.length)](f)
}

export const curryN = ary2of2(curryNU)

export const arityNU = function arityN(n, f) {
  return C[n][n](f)
}

export const arityN = ary2of2(arityNU)

export const curry = f => arityN(f.length, f)

//

export const defineName = ary2of2(defineNameU)

//

export const create = Object.create

export const assign = Object.assign

export const toObject = x => assign({}, x)

//

export const always = ary1of2(function always(x) {
  return function always(_) {
    return x
  }
})

export const applyU = function apply(x2y, x) {
  return x2y(x)
}

export const apply = ary2of2(applyU)

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

//

export const isDefined = x => void 0 !== x

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

export const isFunction = x => typeof x === 'function'
export const isString = x => typeof x === 'string'
export const isNumber = x => typeof x === 'number'

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

export const pipe2U = function pipe2(fn1, fn2) {
  const n = fn1.length
  return n === 1 ? x => fn2(fn1(x)) : arityN(n, (...xs) => fn2(fn1(...xs)))
}

export const pipe2 = ary2of2(pipe2U)

export const compose2U = function compose2(fn1, fn2) {
  return pipe2U(fn2, fn1)
}

export const compose2 = ary2of2(compose2U)

//

export function seq(x, ...fns) {
  for (let i = 0, n = fns.length; i < n; ++i) x = fns[i](x)
  return x
}

export function seqPartial(x, ...fns) {
  for (let i = 0, n = fns.length; isDefined(x) && i < n; ++i) x = fns[i](x)
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
  const n = a.length
  if (n !== b.length) return false
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
      const n = xs.length
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

export const Identity = Monad(applyU, id, applyU, applyU)

export const IdentityOrU = function IdentityOr(isOther, other) {
  const map = other[MAP]
  const ap = other[AP]
  const of = other[OF]
  const chain = other[CHAIN]
  const mapEither = (xy, xM) => (isOther(xM) ? map(xy, xM) : xy(xM))
  const toOther = x => (isOther(x) ? x : of(x))
  return Monad(
    mapEither,
    id,
    function apEither(xyM, xM) {
      return isOther(xyM)
        ? isOther(xM)
          ? ap(xyM, xM)
          : map(xy => xy(xM), xyM)
        : mapEither(xyM, xM)
    },
    function chainEither(xyM, xM) {
      return isOther(xM) ? chain(x => toOther(xyM(x)), xM) : xyM(xM)
    }
  )
}

export const IdentityOr = ary2of2(IdentityOrU)

//

export const isThenable = xP => null != xP && isFunction(xP.then)

const thenU = function then(xyP, xP) {
  return xP.then(xyP)
}

export const resolve = x => Promise.resolve(x)

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
  Type.prototype[FANTASY_LAND_SLASH_CHAIN]
    ? fromFantasyMonad(Type)
    : Type[FANTASY_LAND_SLASH_OF]
      ? fromFantasyApplicative(Type)
      : FantasyFunctor
