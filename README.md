# <a id="infestines"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#infestines) [Infestines](#infestines) &middot; [![GitHub stars](https://img.shields.io/github/stars/polytypic/infestines.svg?style=social)](https://github.com/polytypic/infestines) [![npm](https://img.shields.io/npm/dm/infestines.svg)](https://www.npmjs.com/package/infestines)

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

## <a id="contents"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#contents) [Contents](#contents)

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
    * [`I.isInstanceOfU(Type, any) ~> boolean`](#I-isInstanceOfU)
    * [`I.isNumber(any) ~> boolean`](#I-isNumber)
    * [`I.isObject(any) ~> boolean`](#I-isObject)
    * [`I.isString(any) ~> boolean`](#I-isString)
    * [`I.isThenable(any) ~> boolean`](#I-isThenable)
  * [Equality](#equality)
    * [`I.acyclicEqualsU(any, any) ~> boolean`](#I-acyclicEqualsU)
    * [`I.hasKeysOfU(template, object)`](#I-hasKeysOfU)
    * [`I.identicalU(any, any) ~> boolean`](#I-identicalU)
    * [`I.whereEqU(template, object)`](#I-whereEqU)
  * [Objects](#objects)
    * [`I.assocPartialU(key, value, object) ~> object`](#I-assocPartialU)
    * [`I.dissocPartialU(key, object) ~> object|undefined`](#I-dissocPartialU)
    * [`I.hasU(propName, object) ~> boolean`](#I-hasU)
    * [`I.keys(object) ~> [...keys]`](#I-keys)
    * [`I.toObject(object) ~> object`](#I-toObject)
    * [`I.unzipObjIntoU(object, keys, values)`](#I-unzipObjIntoU)
    * [`I.values(object) ~> [...values]`](#I-values)
  * [OOP](#oop)
    * [`I.inherit(Derived, Base, Methods, Statics) ~> Derived`](#I-inherit)
  * [Meta](#meta)
    * [`I.constructorOf(any) ~> Function|null|undefined`](#I-constructorOf)
    * [`I.create(proto[, properties]) ~> object`](#I-create)
    * [`I.freeze(any) ~> any`](#I-freeze)
    * [`I.defineNameU(function, string) ~> function`](#I-defineNameU)
    * [`I.prototypeOf(any) ~> object|null|undefined`](#I-prototypeOf)
  * [Imperative](#imperative)
    * [`I.assign(to, ...from) ~> to`](#I-assign)
  * [Promises](#promises)
    * [`I.resolve(any) ~> promise`](#I-resolve)
  * [Algebras](#algebras)
    * [Algebra constructors](#algebra-constructors)
      * [`I.Functor(map) ~> functor`](#I-Functor)
      * [`I.Applicative(map, of, ap) ~> applicative`](#I-Applicative)
      * [`I.Monad(map, of, ap, chain) ~> monad`](#I-Monad)
    * [Fantasy land](#fantasy-land)
      * [`I.FantasyFunctor ~> functor`](#I-FantasyFunctor)
      * [`I.fromFantasyApplictive(Type) ~> applicative`](#I-fromFantasyApplicative)
      * [`I.fromFantasyMonad(Type) ~> monad`](#I-fromFantasyMonad)
      * [`I.fromFantasy(Type) ~> functor|applicative|monad`](#I-fromFantasy)
    * [Base algebras](#base-algebras)
      * [`I.Async ~> monadish`](#I-Async)
      * [`I.Identity ~> monad`](#I-Identity)
      * [`I.IdentityAsync ~> monadish`](#I-IdentityAsync)
    * [Algebra combinators](#algebra-combinators)
      * [`I.IdentityOrU(predicate, monad) ~> monad`](#I-IdentityOrU)

## <a id="reference"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#reference) [Reference](#reference)

#### <a id="currying"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#currying) [Currying](#currying)

##### <a id="I-arityN"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-arityN) [`I.arityN(n, (x1, ..., xm) => y) ~> x1 => ... => xn => y`](#I-arityN)
##### <a id="I-curry"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-curry) [`I.curry((x1, ..., xn) => y) ~> x1 => ... => xn => y`](#I-curry)
##### <a id="I-curryN"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-curryN) [`I.curryN(n, (x1, ..., xn) => y) ~> x1 => ... => xn => y`](#I-curryN)

```js
I.curryN(2, x => {
  const x2 = x*x
  return y => x2 + y
})(2, 3)
// 7
```

#### <a id="function-composition"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#function-composition) [Function composition](#function-composition)

##### <a id="I-compose2U"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-compose2U) [`I.compose2U(b => c, (a1, ..., aN) => b) ~> a1 => ... aN => c`](#I-compose2U)
##### <a id="I-pipe2U"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-pipe2U) [`I.pipe2U((a1, ..., an) => b, b => c) ~> a1 => ... aN => c`](#I-pipe2U)

#### <a id="sequencing"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#sequencing) [Sequencing](#sequencing)

##### <a id="I-seq"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-seq) [`I.seq(value, ...fns) ~> value`](#I-seq)
##### <a id="I-seqPartial"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-seqPartial) [`I.seqPartial(maybeValue, ...fns) ~> maybeValue`](#I-seq)

#### <a id="basic-combinators"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#basic-combinators) [Basic combinators](#basic-combinators)

##### <a id="I-always"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-always) [`I.always(x) ~> _ => x`](#I-always)
##### <a id="I-applyU"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-applyU) [`I.applyU(x => y, x) ~> y`](#I-applyU)
##### <a id="I-id"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-id) [`I.id(x) ~> x`](#I-id)
##### <a id="I-sndU"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-sndU) [`I.sndU(_, x) ~> x`](#I-sndU)

#### <a id="constants"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#constants) [Constants](#constants)

##### <a id="I-array0"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-array0) [`I.array0 ~> []`](#I-array0)

`I.array0` is an
empty
[frozen](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) array
`[]`.

##### <a id="I-object0"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-object0) [`I.object0 ~> {}`](#I-object0)

`I.object0` is an
empty
[frozen](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze) object
`{}`.

#### <a id="type-predicates"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#type-predicates) [Type predicates](#type-predicates)

##### <a id="I-isArray"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-isArray) [`I.isArray(any) ~> boolean`](#I-isArray)
##### <a id="I-isDefined"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-isDefined) [`I.isDefined(any) ~> boolean`](#I-isDefined)
##### <a id="I-isFunction"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-isFunction) [`I.isFunction(any) ~> boolean`](#I-isFunction)
##### <a id="I-isInstanceOfU"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-isInstanceOfU) [`I.isInstanceOfU(Type, any) ~> boolean`](#I-isInstanceOfU)
##### <a id="I-isNumber"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-isNumber) [`I.isNumber(any) ~> boolean`](#I-isNumber)
##### <a id="I-isObject"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-isObject) [`I.isObject(any) ~> boolean`](#I-isObject)
##### <a id="I-isString"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-isString) [`I.isString(any) ~> boolean`](#I-isString)
##### <a id="I-isThenable"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-isThenable) [`I.isThenable(any) ~> boolean`](#I-isThenable)

#### <a id="equality"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#equality) [Equality](#equality)

##### <a id="I-acyclicEqualsU"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-acyclicEqualsU) [`I.acyclicEqualsU(any, any) ~> boolean`](#I-acyclicEqualsU)
##### <a id="I-hasKeysOfU"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-hasKeysOfU) [`I.hasKeysOfU(template, object)`](#I-hasKeysOfU)
##### <a id="I-identicalU"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-identicalU) [`I.identicalU(any, any) ~> boolean`](#I-identicalU)
##### <a id="I-whereEqU"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-whereEqU) [`I.whereEqU(template, object)`](#I-whereEqU)

#### <a id="objects"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#objects) [Objects](#objects)

##### <a id="I-assocPartialU"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-assocPartialU) [`I.assocPartialU(key, value, object) ~> object`](#I-assocPartialU)
##### <a id="I-dissocPartialU"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-dissocPartialU) [`I.dissocPartialU(key, object) ~> object|undefined`](#I-dissocPartialU)
##### <a id="I-hasU"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-hasU) [`I.hasU(propName, object) ~> boolean`](#I-hasU)
##### <a id="I-keys"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-keys) [`I.keys(object) ~> [...keys]`](#I-keys)
##### <a id="I-toObject"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-toObject) [`I.toObject(object) ~> object`](#I-toObject)
##### <a id="I-unzipObjIntoU"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-unzipObjIntoU) [`I.unzipObjIntoU(object, keys, values)`](#I-unzipObjIntoU)
##### <a id="I-values"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-values) [`I.values(object) ~> [...values]`](#I-values)

#### <a id="oop"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#oop) [OOP](#oop)

##### <a id="I-inherit"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-inherit) [`I.inherit(Derived, Base, Methods, Statics) ~> Derived`](#I-inherit)

#### <a id="meta"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#meta) [Meta](#meta)

##### <a id="I-constructorOf"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-constructorOf) [`I.constructorOf(any) ~> Function|null|undefined`](#I-constructorOf)
##### <a id="I-create"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-create) [`I.create(proto[, properties]) ~> object`](#I-create)
##### <a id="I-freeze"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-freeze) [`I.freeze(any) ~> any`](#I-freeze)
##### <a id="I-defineNameU"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-defineNameU) [`I.defineNameU(function, string) ~> function`](#I-defineNameU)
##### <a id="I-prototypeOf"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-prototypeOf) [`I.prototypeOf(any) ~> object|null|undefined`](#I-prototypeOf)

#### <a id="imperative"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#imperative) [Imperative](#imperative)

##### <a id="I-assign"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-assign) [`I.assign(to, ...from) ~> to`](#I-assign)

#### <a id="promises"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#promises) [Promises](#promises)
##### <a id="I-resolve"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-resolve) [`I.resolve(any) ~> promise`](#I-resolve)

#### <a id="algebras"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#algebras) [Algebras](#algebras)

##### <a id="algebra-constructors"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#algebra-constructors) [Algebra constructors](#algebra-constructors)
###### <a id="I-Functor"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-Functor) [`I.Functor(map) ~> functor`](#I-Functor)
###### <a id="I-Applicative"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-Applicative) [`I.Applicative(map, of, ap) ~> applicative`](#I-Applicative)
###### <a id="I-Monad"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-Monad) [`I.Monad(map, of, ap, chain) ~> monad`](#I-Monad)

##### <a id="fantasy-land"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#fantasy-land) [Fantasy land](#fantasy-land)
###### <a id="I-FantasyFunctor"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-FantasyFunctor) [`I.FantasyFunctor ~> functor`](#I-FantasyFunctor)
###### <a id="I-fromFantasyApplicative"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-fromFantasyApplicative) [`I.fromFantasyApplictive(Type) ~> applicative`](#I-fromFantasyApplicative)
###### <a id="I-fromFantasyMonad"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-fromFantasyMonad) [`I.fromFantasyMonad(Type) ~> monad`](#I-fromFantasyMonad)
###### <a id="I-fromFantasy"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-fromFantasy) [`I.fromFantasy(Type) ~> functor|applicative|monad`](#I-fromFantasy)

##### <a id="base-algebras"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#base-algebras) [Base algebras](#base-algebras)
###### <a id="I-Async"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-Async) [`I.Async ~> monadish`](#I-Async)
###### <a id="I-Identity"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-Identity) [`I.Identity ~> monad`](#I-Identity)
###### <a id="I-IdentityAsync"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-IdentityAsync) [`I.IdentityAsync ~> monadish`](#I-IdentityAsync)

##### <a id="algebra-combinators"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#algebra-combinators) [Algebra combinators](#algebra-combinators)
###### <a id="I-IdentityOrU"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-IdentityOrU) [`I.IdentityOrU(predicate, monad) ~> monad`](#I-IdentityOrU)
