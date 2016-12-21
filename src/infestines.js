export const curry2 = fn => function (x1, x2) {
  switch (arguments.length) {
    case 1:  return x2 => fn(x1, x2)
    default: return       fn(x1, x2)
  }
}

export const curry3 = fn => function (x1, x2, x3) {
  switch (arguments.length) {
    case 1:  return curry2((x2, x3) => fn(x1, x2, x3))
    case 2:  return             x3  => fn(x1, x2, x3)
    default: return                    fn(x1, x2, x3)
  }
}

export const curry4 = fn => function (x1, x2, x3, x4) {
  switch (arguments.length) {
    case 1:  return curry3((x2, x3, x4) => fn(x1, x2, x3, x4))
    case 2:  return curry2(    (x3, x4) => fn(x1, x2, x3, x4))
    case 3:  return                 x4  => fn(x1, x2, x3, x4)
    default: return                        fn(x1, x2, x3, x4)
  }
}

export function curryN(n, fn) {
  switch (n) {
    case 0: return () => fn()
    case 1: return x1 => fn(x1)
    case 2: return curry2(fn)
    case 3: return curry3(fn)
    case 4: return curry4(fn)
    default: throw new Error(`curryN(${n}, ...) unsupported`)
  }
}

export const curry = fn => curryN(fn.length, fn)

//

export const id = x => x
export const always = x => _ => x
export const applyU = (x2y, x) => x2y(x)
export const sndU = (_, y) => y

//

export const assert = process.env.NODE_ENV === "production" ? id : (x,p,m) => {
  if (p(x))
    return x
  throw new Error(m)
}

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

export function isObject(x) {
  if (!x)
    return false
  const c = x.constructor
  return c === Object ||
    typeof c !== "function" &&
    Object.getPrototypeOf(x).constructor === Object
}

//

export const pipe2 = (fn1, fn2) =>
  curryN(fn1.length, (...xs) => fn2(fn1(...xs)))

export const pipe3 = (fn1, fn2, fn3) =>
  curryN(fn1.length, (...xs) => fn3(fn2(fn1(...xs))))

export const pipe4 = (fn1, fn2, fn3, fn4) =>
  curryN(fn1.length, (...xs) => fn4(fn3(fn2(fn1(...xs)))))

export function pipe() {
  switch (arguments.length) {
    case 0: return id
    case 1: return arguments[0]
    case 2: return pipe2.apply(this, arguments)
    case 3: return pipe3.apply(this, arguments)
    case 4: return pipe4.apply(this, arguments)
    default: throw new Error(`pipe with ${arguments.length} fns unsupported`)
  }
}

//

export function seq(x, ...fns) {
  let r = x
  for (let i=0, n=fns.length; i<n; ++i)
    r = fns[i](r)
  return r
}

export function seqPartial(x, ...fns) {
  let r = x
  for (let i=0, n=fns.length; isDefined(r) && i<n; ++i)
    r = fns[i](r)
  return r
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

export function keys(o) {const ks=[]; unzipObjIntoU(o, ks, 0); return ks}
export function values(o) {const vs=[]; unzipObjIntoU(o, 0, vs); return vs}

//

export function assocPartialU(k, v, o) {
  const r = {}
  if (isObject(o))
    for (const l in o)
      if (l !== k)
        r[l] = o[l]
      else {
        r[k] = v
        k = undefined
      }
  if (isDefined(k))
    r[k] = v
  return r
}

export function dissocPartialU(k, o) {
  let r
  if (isObject(o))
    for (const l in o)
      if (l !== k) {
        if (!r)
          r = {}
        r[l] = o[l]
      } else
        k = undefined
  return r
}
