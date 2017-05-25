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

## Contents

* [Reference](#reference)
  * [Currying](#currying)
    * [`I.arityN(n, (x1, ..., xm) => y) ~> x1 => ... => xn => y`](#I-arityN)
    * [`I.curry((x1, ..., xn) => y) ~> x1 => ... => xn => y`](#I-curry)
    * [`I.curryN(n, (x1, ..., xn) => y) ~> x1 => ... => xn => y`](#I-curryN)
  * [Function composition](#function-composition)
    * [`I.compose2U(b => c, (a1, ..., aN) => b) ~> a1 => ... aN => c`](#I-compose2U)
    * [`I.pipe2U((a1, ..., an) => b, b => c) ~> a1 => ... aN => c`](#I-pipe2U)
  * [Sequencing](#sequencing)
    * [`I.seq(value, ...fns) ~> value`](#I-seq)
    * [`I.seqPartial(maybeValue, ...fns) ~> maybeValue`](#I-seq)
  * [Basic combinators](#basic-combinators)
    * [`I.always(x) ~> _ => x`](#I-always)
    * [`I.applyU(x => y, x) ~> y`](#I-applyU)
    * [`I.id(x) ~> x`](#I-id)
    * [`I.sndU(_, x) ~> x`](#I-sndU)
  * [Constants](#constants)
    * [`I.array0 ~> []`](#I-array0)
    * [`I.object0 ~> {}`](#I-object0)
  * [Type predicates](#type-predicates)
    * [`I.isArray(any) ~> boolean`](#I-isArray)
    * [`I.isDefined(any) ~> boolean`](#I-isDefined)
    * [`I.isFunction(any) ~> boolean`](#I-isFunction)
    * [`I.isNumber(any) ~> boolean`](#I-isNumber)
    * [`I.isObject(any) ~> boolean`](#I-isObject)
    * [`I.isString(any) ~> boolean`](#I-isString)
  * [Equality](#equality)
    * [`I.acyclicEqualsU(any, any) ~> boolean`](#I-acyclicEqualsU)
    * [`I.hasKeysOfU(template, object)`](#I-hasKeysOfU)
    * [`I.identicalU(any, any) ~> boolean`](#I-identical)
    * [`I.whereEqU(template, object)`](#I-whereEqU)
  * [Objects](#objects)
    * [`I.assocPartialU(key, value, object) ~> object`](#I-assocPartialU)
    * [`I.dissocPartialU(key, object) ~> object|undefined`](#I-dissocPartialU)
    * [`I.hasU(propName, object) ~> boolean`](#I-hasU)
    * [`I.keys(object) ~> [...keys]`](#I-keys)
    * [`I.unzipObjIntoU(object, keys, values)`](#I-unzipObjIntoU)
    * [`I.values(object) ~> [...values]`](#I-values)
  * [OOP](#oop)
    * [`I.constructorOf(any) ~> Function|null|undefined`](#I-constructorOf)
    * [`I.inherit(Derived, Base, Methods) ~> Derived`](#I-inherit)

## Reference

#### Currying

##### <a id="I-arityN"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/#I-arityN) [`I.arityN(n, (x1, ..., xm) => y) ~> x1 => ... => xn => y`](#I-arityN)
##### <a id="I-curry"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/#I-curry) [`I.curry((x1, ..., xn) => y) ~> x1 => ... => xn => y`](#I-curry)
##### <a id="I-curryN"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/#I-curryN) [`I.curryN(n, (x1, ..., xn) => y) ~> x1 => ... => xn => y`](#I-curryN)

```js
I.curryN(2, x => {
  const x2 = x*x
  return y => x2 + y
})(2, 3)
// 7
```

#### Function composition

##### <a id="I-compose2U"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/#I-compose2U) [`I.compose2U(b => c, (a1, ..., aN) => b) ~> a1 => ... aN => c`](#I-compose2U)
##### <a id="I-pipe2U"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/#I-pipe2U) [`I.pipe2U((a1, ..., an) => b, b => c) ~> a1 => ... aN => c`](#I-pipe2U)

#### Sequencing

##### <a id="I-seq"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/#I-seq) [`I.seq(value, ...fns) ~> value`](#I-seq)
##### <a id="I-seqPartial"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/#I-seqPartial) [`I.seqPartial(maybeValue, ...fns) ~> maybeValue`](#I-seq)

#### Basic combinators

##### <a id="I-always"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/#I-always) [`I.always(x) ~> _ => x`](#I-always)
##### <a id="I-applyU"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/#I-applyU) [`I.applyU(x => y, x) ~> y`](#I-applyU)
##### <a id="I-id"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/#I-id) [`I.id(x) ~> x`](#I-id)
##### <a id="I-sndU"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/#I-sndU) [`I.sndU(_, x) ~> x`](#I-sndU)

#### Constants

##### <a id="I-array0"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/#I-array0) [`I.array0 ~> []`](#I-array0)
##### <a id="I-object0"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/#I-object0) [`I.object0 ~> {}`](#I-object0)

#### Type predicates

##### <a id="I-isArray"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/#I-isArray) [`I.isArray(any) ~> boolean`](#I-isArray)
##### <a id="I-isDefined"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/#I-isDefined) [`I.isDefined(any) ~> boolean`](#I-isDefined)
##### <a id="I-isFunction"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/#I-isFunction) [`I.isFunction(any) ~> boolean`](#I-isFunction)
##### <a id="I-isNumber"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/#I-isNumber) [`I.isNumber(any) ~> boolean`](#I-isNumber)
##### <a id="I-isObject"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/#I-isObject) [`I.isObject(any) ~> boolean`](#I-isObject)
##### <a id="I-isString"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/#I-isString) [`I.isString(any) ~> boolean`](#I-isString)

#### Equality

##### <a id="I-acyclicEqualsU"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/#I-acyclicEqualsU) [`I.acyclicEqualsU(any, any) ~> boolean`](#I-acyclicEqualsU)
##### <a id="I-hasKeysOfU"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/#I-hasKeysOfU) [`I.hasKeysOfU(template, object)`](#I-hasKeysOfU)
##### <a id="I-identicalU"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/#I-identicalU) [`I.identicalU(any, any) ~> boolean`](#I-identical)
##### <a id="I-whereEqU"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/#I-whereEqU) [`I.whereEqU(template, object)`](#I-whereEqU)

#### Objects

##### <a id="I-assocPartialU"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/#I-assocPartialU) [`I.assocPartialU(key, value, object) ~> object`](#I-assocPartialU)
##### <a id="I-dissocPartialU"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/#I-dissocPartialU) [`I.dissocPartialU(key, object) ~> object|undefined`](#I-dissocPartialU)
##### <a id="I-hasU"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/#I-hasU) [`I.hasU(propName, object) ~> boolean`](#I-hasU)
##### <a id="I-keys"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/#I-keys) [`I.keys(object) ~> [...keys]`](#I-keys)
##### <a id="I-unzipObjIntoU"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/#I-unzipObjIntoU) [`I.unzipObjIntoU(object, keys, values)`](#I-unzipObjIntoU)
##### <a id="I-values"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/#I-values) [`I.values(object) ~> [...values]`](#I-values)

#### OOP

##### <a id="I-constructorOf"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/#I-constructorOf) [`I.constructorOf(any) ~> Function|null|undefined`](#I-constructorOf)
##### <a id="I-inherit"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/#I-inherit) [`I.inherit(Derived, Base, Methods) ~> Derived`](#I-inherit)
