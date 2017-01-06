const aryFs = [
  [             f => f.length === 0 ? f : ( ) => f( )],
  Array(2).fill(f => f.length === 1 ? f :  x  => f(x))]

const varyFs = [
  [             f => f.length === 0 ? f : function ( ) {return f.apply(null, arguments)}],
  Array(2).fill(f => f.length === 1 ? f : function (_) {return f.apply(null, arguments)})]

export const curryN = (n, f) => getAry(aryFs, n)[Math.min(n, f.length)](f)
export const arityN = (n, f) => getAry(aryFs, n)[n](f)
export const curry = f => arityN(f.length, f)

export const vcurryN = (n, f) => getAry(varyFs, n)[Math.min(n, f.length)](f)
export const varityN = (n, f) => getAry(varyFs, n)[n](f)
export const vcurry = f => varityN(f.length, f)

//

function genAry(aryFs, n) {
  const range = (i0, i1) => Array(i1-i0).fill().map((_, i) => i+i0)
  const genParams = (i0, i1) => range(i0, i1).map(i => `x${i}`).join(",")
  const v = aryFs === varyFs ? "v" : ""
  for (let total = n; !aryFs[total]; --total) {
    aryFs[total] = Array(total+1).fill()
    for (let stage=1; stage<=total; ++stage) {
      const remains = total - stage
      const last = v
        ? `default:return ${
           remains
           ? (f => 1 < remains ? `curryN(${remains},${f})` : f)(
               `f(${genParams(0, stage)})`)
           : "f"}.apply(null,${
             remains
             ? `Array.prototype.slice.call(arguments,${stage})`
             : "arguments"})`
        : ""
      aryFs[total][stage] = eval(`(function ${v}ary${stage}of${total}(f){
return function ${v}curried${stage}of${total}(${genParams(0, total)}){
switch(arguments.length){
case 0:
${range(1, total+1)
  .map(n => {
    let f = `f(${genParams(0, stage)})`
    if (v && n < stage && !remains)
      f = `arguments.length===${stage-n}?${f}:f.apply(null,[${
            genParams(0, n)}].concat(Array.prototype.slice.call(arguments)))`
    if (n < stage)
      f = `function(${genParams(n, stage)}){return ${f}}`
    if (n < stage && (total-n !== 1 || stage-n !== 1))
      f = `${v}aryFs[${total-n}][${stage-n}](${f})`
    if (stage <= n && 1 < remains)
      f = `${v}curryN(${remains},${f})`
    if (stage < n)
      f = `${f}(${genParams(stage, n)})`
    return `${v || n<total ? `case ${n}` : "default"}:return ${f}`})
  .join("\n")}
${last}}}})`)
    }
  }
  return aryFs[n]
}

const getAry = (aryFs, n) => aryFs[n] || genAry(aryFs, n)

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
  arityN(fn1.length, (...xs) => fn2(fn1(...xs)))

export const pipe3 = (fn1, fn2, fn3) =>
  arityN(fn1.length, (...xs) => fn3(fn2(fn1(...xs))))

export const pipe4 = (fn1, fn2, fn3, fn4) =>
  arityN(fn1.length, (...xs) => fn4(fn3(fn2(fn1(...xs)))))

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
