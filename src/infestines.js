const ary1of2 = fn => function (x0, x1) {
  switch (arguments.length) {
    case 0:
    case 1: return fn(x0)
    default: return fn(x0)(x1)
  }
}

const ary2of2 = fn => function (x0, x1) {
  switch (arguments.length) {
    case 0:
    case 1: return x1 => fn(x0, x1)
    default: return fn(x0, x1)
  }
}

const ary1of3 = fn => function (x0, x1, x2) {
  switch (arguments.length) {
    case 0:
    case 1: return curryN(2, fn(x0))
    case 2: return curryN(2, fn(x0))(x1)
    default: return curryN(2, fn(x0))(x1, x2)
  }
}

const ary2of3 = fn => function (x0, x1, x2) {
  switch (arguments.length) {
    case 0:
    case 1: return ary1of2(x1 => fn(x0, x1))
    case 2: return fn(x0, x1)
    default: return fn(x0, x1)(x2)
  }
}

const ary3of3 = fn => function (x0, x1, x2) {
  switch (arguments.length) {
    case 0:
    case 1: return ary2of2((x1, x2) => fn(x0, x1, x2))
    case 2: return x2 => fn(x0, x1, x2)
    default: return fn(x0, x1, x2)
  }
}

const ary1of4 = fn => function (x0, x1, x2, x3) {
  switch (arguments.length) {
    case 0:
    case 1: return curryN(3, fn(x0))
    case 2: return curryN(3, fn(x0))(x1)
    case 3: return curryN(3, fn(x0))(x1, x2)
    default: return curryN(3, fn(x0))(x1, x2, x3)
  }
}

const ary2of4 = fn => function (x0, x1, x2, x3) {
  switch (arguments.length) {
    case 0:
    case 1: return ary1of3(x1 => fn(x0, x1))
    case 2: return curryN(2, fn(x0, x1))
    case 3: return curryN(2, fn(x0, x1))(x2)
    default: return curryN(2, fn(x0, x1))(x2, x3)
  }
}

const ary3of4 = fn => function (x0, x1, x2, x3) {
  switch (arguments.length) {
    case 0:
    case 1: return ary2of3((x1, x2) => fn(x0, x1, x2))
    case 2: return ary1of2(x2 => fn(x0, x1, x2))
    case 3: return fn(x0, x1, x2)
    default: return fn(x0, x1, x2)(x3)
  }
}

const ary4of4 = fn => function (x0, x1, x2, x3) {
  switch (arguments.length) {
    case 0:
    case 1: return ary3of3((x1, x2, x3) => fn(x0, x1, x2, x3))
    case 2: return ary2of2((x2, x3) => fn(x0, x1, x2, x3))
    case 3: return x3 => fn(x0, x1, x2, x3)
    default: return fn(x0, x1, x2, x3)
  }
}

const ary0of0 = fn => fn.length === 0 ? fn : () => fn()
const ary1of1 = fn => fn.length === 1 ? fn : x  => fn(x)

const C = [[ary0of0],
           [ary1of1, ary1of1],
           [ void 0, ary1of2, ary2of2],
           [ void 0, ary1of3, ary2of3, ary3of3],
           [ void 0, ary1of4, ary2of4, ary3of4, ary4of4]]

export const curryN = (n, f) => C[n][Math.min(n, f.length)](f)
export const arityN = (n, f) => C[n][n](f)
export const curry = f => arityN(f.length, f)

//

export const id = x => x
export const always = x => _ => x
export const applyU = (x2y, x) => x2y(x)
export const sndU = (_, y) => y

//

export const array0 = Object.freeze([])
export const object0 = Object.freeze({})

//

export const isDefined = x => x !== undefined

//

// The idea here is that any valid JSON object will be categorized correctly.
// Cases where there is no explicit attempt to create Array/Object lookalikes
// will also categorize correctly.

export const isArray = x => x ? x.constructor === Array : false

function hasObjectConstructor(x) {
  const c = x.constructor
  return c === Object ||
    typeof c !== "function" &&
    Object.getPrototypeOf(x).constructor === Object
}

export const isObject = x => x ? hasObjectConstructor(x) : false

//

export function pipe2U(fn1, fn2) {
  const n = fn1.length
  return n === 1
    ? x => fn2(fn1(x))
    : arityN(n, (...xs) => fn2(fn1(...xs)))
}

export const compose2U = (fn1, fn2) => pipe2U(fn2, fn1)

//

export function seq(x, ...fns) {
  for (let i=0, n=fns.length; i<n; ++i)
    x = fns[i](x)
  return x
}

export function seqPartial(x, ...fns) {
  for (let i=0, n=fns.length; isDefined(x) && i<n; ++i)
    x = fns[i](x)
  return x
}

//

export const identicalU = (a, b) =>
  a === b && (a !== 0 || 1 / a === 1 / b) || a !== a && b !== b

//

export function whereEqU(t, o) {
  for (const k in t) {
    const bk = o[k]
    if (!isDefined(bk) && !(k in o) || !acyclicEqualsU(t[k], bk))
      return false
  }
  return true
}

//

export function hasKeysOfU(t, o) {
  for (const k in t)
    if (!(k in o))
      return false
  return true
}

//

export const acyclicEqualsObject = (a, b) => whereEqU(a, b) && hasKeysOfU(b, a)

function acyclicEqualsArray(a, b) {
  const n = a.length
  if (n !== b.length)
    return false
  for (let i=0; i<n; ++i)
    if (!acyclicEqualsU(a[i], b[i]))
      return false
  return true
}

export function acyclicEqualsU(a, b) {
  if (identicalU(a, b))
    return true
  if (!a || !b)
    return false
  const c = a.constructor
  if (c !== b.constructor)
    return false
  switch (c) {
    case Array: return acyclicEqualsArray(a, b)
    case Object: return acyclicEqualsObject(a, b)
    default:
      if (typeof a.equals === "function")
        return a.equals(b)
      return false
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
    if (hasObjectConstructor(o)) {
      const ks=[]
      unzipObjIntoU(o, ks, 0)
      return ks
    } else {
      return Object.keys(o)
    }
  }
}

export function values(o) {
  if (o instanceof Object) {
    if (hasObjectConstructor(o)) {
      const vs=[]
      unzipObjIntoU(o, 0, vs)
      return vs
    } else {
      const xs = Object.keys(o), n = xs.length
      for (let i=0; i<n; ++i)
        xs[i] = o[xs[i]]
      return xs
    }
  }
}

//

export function assocPartialU(k, v, o) {
  const r = {}
  if (o instanceof Object) {
    if (!hasObjectConstructor(o))
      o = Object.assign({}, o)
    for (const l in o) {
      if (l !== k) {
        r[l] = o[l]
      } else {
        r[k] = v
        k = undefined
      }
    }
  }
  if (isDefined(k))
    r[k] = v
  return r
}

export function dissocPartialU(k, o) {
  let r
  if (o instanceof Object) {
    if (!hasObjectConstructor(o))
      o = Object.assign({}, o)
    for (const l in o) {
      if (l !== k) {
        if (!r)
          r = {}
        r[l] = o[l]
      } else {
        k = undefined
      }
    }
  }
  return r
}

//

export function inherit(Derived, Base, fns) {
  const F = function () {}
  F.prototype = Base.prototype
  const p = Derived.prototype = new F()
  p.constructor = Derived
  for (const k in fns)
    p[k] = fns[k]
}
