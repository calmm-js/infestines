# <a id="infestines"></a> Infestines &middot; [![GitHub stars](https://img.shields.io/github/stars/polytypic/infestines.svg?style=social)](https://github.com/polytypic/infestines) [![npm](https://img.shields.io/npm/dm/infestines.svg)](https://www.npmjs.com/package/infestines)

This is a minimalistic library of basic utilities, such as currying, for writing
more interesting high performance FP libraries.  **This library is not intended
to be used for application programming.** Primitives that are too specialized to
be used as a basis for nearly optimal implementations of higher level operations
are not provided.

[![npm version](https://badge.fury.io/js/infestines.svg)](http://badge.fury.io/js/infestines)
[![Bower version](https://badge.fury.io/bo/infestines.svg)](https://badge.fury.io/bo/infestines)
[![Build Status](https://travis-ci.org/polytypic/infestines.svg?branch=master)](https://travis-ci.org/polytypic/infestines)
[![Code Coverage](https://img.shields.io/codecov/c/github/polytypic/infestines/master.svg)](https://codecov.io/github/polytypic/infestines?branch=master)
[![](https://david-dm.org/polytypic/infestines.svg)](https://david-dm.org/polytypic/infestines) [![](https://david-dm.org/polytypic/infestines/dev-status.svg)](https://david-dm.org/polytypic/infestines?type=dev)

You can [try Infestines](https://polytypic.github.io/infestines/) in your
browser:

```js
I.curryN(2, x => {
  const x2 = x*x
  return y => x2 + y
})(2, 3)
// 7
```

## Contents

* Reference
  * Currying
    * [`I.arityN(n, (x1, ..., xm) => y) ~> x1 => ... => xn => y`](#I-arityN)
    * [`I.curry((x1, ..., xn) => y) ~> x1 => ... => xn => y`](#I-curry)
    * [`I.curryN(n, (x1, ..., xn) => y) ~> x1 => ... => xn => y`](#I-curryN)
  * Function composition
    * [`I.compose2U(b => c, (a1, ..., aN) => b) ~> a1 => ... aN => c`](#I-compose2U)
    * [`I.pipe2U((a1, ..., an) => b, b => c) ~> a1 => ... aN => c`](#I-pipe2U)
  * Sequencing
    * [`I.seq(value, ...fns) ~> value`](#I-seq)
    * [`I.seqPartial(maybeValue, ...fns) ~> maybeValue`](#I-seq)
  * Basic combinators
    * [`I.always(x) ~> _ => x`](#I-always)
    * [`I.applyU(x => y, x) ~> y`](#I-applyU)
    * [`I.id(x) ~> x`](#I-id)
    * [`I.sndU(_, x) ~> x`](#I-sndU)
  * Constants
    * [`I.array0 ~> []`](#I-array0)
    * [`I.object0 ~> {}`](#I-object0)
  * Type predicates
    * [`I.isArray(any) ~> boolean`](#I-isArray)
    * [`I.isDefined(any) ~> boolean`](#I-isDefined)
    * [`I.isFunction(any) ~> boolean`](#I-isFunction)
    * [`I.isNumber(any) ~> boolean`](#I-isNumber)
    * [`I.isObject(any) ~> boolean`](#I-isObject)
    * [`I.isString(any) ~> boolean`](#I-isString)
  * Equality
    * [`I.acyclicEqualsU(any, any) ~> boolean`](#I-acyclicEqualsU)
    * [`I.hasKeysOfU(template, object)`](#I-hasKeysOfU)
    * [`I.identicalU(any, any) ~> boolean`](#I-identical)
    * [`I.whereEqU(template, object)`](#I-whereEqU)
  * Objects
    * [`I.assocPartialU(key, value, object) ~> object`](#I-assocPartialU)
    * [`I.constructorOf(any) ~> Function|null|undefined`](#I-constructorOf)
    * [`I.dissocPartialU(key, object) ~> object|undefined`](#I-dissocPartialU)
    * [`I.hasU(propName, object) ~> boolean`](#I-hasU)
    * [`I.inherit(Derived, Base, Methods) ~> Derived`](#I-inherit)
    * [`I.keys(object) ~> [...keys]`](#I-keys)
    * [`I.unzipObjIntoU(object, keys, values)`](#I-unzipObjIntoU)
    * [`I.values(object) ~> [...values]`](#I-values)
