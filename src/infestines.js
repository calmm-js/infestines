export const id = x => x

//

export const defineNameU = (() => {
  const _defineNameU = (fn, value) => Object.defineProperty(fn, 'name', {value})
  try {
    return _defineNameU(_defineNameU, _defineNameU.name.slice(1))
  } catch (_) {
    return (fn, _) => fn
  }
})()

const copyName =
  process.env.NODE_ENV === 'production'
    ? f => f
    : (to, from) => defineNameU(to, from.name)

const withName =
  process.env.NODE_ENV === 'production'
    ? id
    : ary => fn => copyName(ary(fn), fn)

const ary1of2 = withName(
  fn =>
    function(x0, x1) {
      return arguments.length < 2 ? fn(x0) : fn(x0)(x1)
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
      switch (arguments.length) {
        case 0:
        case 1:
          return curryN(2, fn(x0))
        case 2:
          return curryN(2, fn(x0))(x1)
        default:
          return curryN(2, fn(x0))(x1, x2)
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
      switch (arguments.length) {
        case 0:
        case 1:
          return curryN(3, fn(x0))
        case 2:
          return curryN(3, fn(x0))(x1)
        case 3:
          return curryN(3, fn(x0))(x1, x2)
        default:
          return curryN(3, fn(x0))(x1, x2, x3)
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

export const curryN = (n, f) => C[n][Math.min(n, f.length)](f)
export const arityN = (n, f) => C[n][n](f)
export const curry = f => arityN(f.length, f)

//

export const assign = Object.assign

export const toObject = x => assign({}, x)

//

export const always = x => _ => x
export const applyU = (x2y, x) => x2y(x)
export const sndU = (_, y) => y

//

export const freeze = x => x && Object.freeze(x)

export const array0 = freeze([])
export const object0 = freeze({})

//

export const isDefined = x => void 0 !== x

//

export const hasU = (p, x) => Object.prototype.hasOwnProperty.call(x, p)

//

export const prototypeOf = x => (null == x ? x : Object.getPrototypeOf(x))

export const constructorOf = x =>
  null == x ? x : (hasU('constructor', x) ? prototypeOf(x) : x).constructor

//

export const isFunction = x => typeof x === 'function'
export const isString = x => typeof x === 'string'
export const isNumber = x => typeof x === 'number'

export const isArray = Array.isArray

const object = prototypeOf({})
export const isObject = x =>
  null != x &&
  typeof x === 'object' &&
  (hasU('constructor', x)
    ? prototypeOf(x) === object
    : x.constructor === Object)

//

export function pipe2U(fn1, fn2) {
  const n = fn1.length
  return n === 1 ? x => fn2(fn1(x)) : arityN(n, (...xs) => fn2(fn1(...xs)))
}

export const compose2U = (fn1, fn2) => pipe2U(fn2, fn1)

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

export const identicalU = (a, b) =>
  (a === b && (a !== 0 || 1 / a === 1 / b)) || (a !== a && b !== b)

//

export function whereEqU(t, o) {
  for (const k in t) {
    const bk = o[k]
    if ((!isDefined(bk) && !hasU(k, o)) || !acyclicEqualsU(t[k], bk))
      return false
  }
  return true
}

//

export function hasKeysOfU(t, o) {
  for (const k in t) if (!hasU(k, o)) return false
  return true
}

//

export const acyclicEqualsObject = (a, b) => whereEqU(a, b) && hasKeysOfU(b, a)

function acyclicEqualsArray(a, b) {
  const n = a.length
  if (n !== b.length) return false
  for (let i = 0; i < n; ++i) if (!acyclicEqualsU(a[i], b[i])) return false
  return true
}

export function acyclicEqualsU(a, b) {
  if (identicalU(a, b)) return true
  if (!a || !b) return false
  const c = constructorOf(a)
  if (c !== constructorOf(b)) return false
  switch (c) {
    case Array:
      return acyclicEqualsArray(a, b)
    case Object:
      return acyclicEqualsObject(a, b)
    default:
      return isFunction(a.equals) && a.equals(b)
  }
}

//

export function unzipObjIntoU(o, ks, vs) {
  for (const k in o) {
    if (ks) ks.push(k)
    if (vs) vs.push(o[k])
  }
}

export function keys(o) {
  if (o instanceof Object) {
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
  if (o instanceof Object) {
    if (isObject(o)) {
      const vs = []
      unzipObjIntoU(o, 0, vs)
      return vs
    } else {
      const xs = Object.keys(o),
        n = xs.length
      for (let i = 0; i < n; ++i) xs[i] = o[xs[i]]
      return xs
    }
  }
}

//

export function assocPartialU(k, v, o) {
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

export function dissocPartialU(k, o) {
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

//

export const inherit = (Derived, Base, protos, statics) =>
  (assign(
    (Derived.prototype = Object.create(Base.prototype)),
    protos
  ).constructor = assign(Derived, statics))
