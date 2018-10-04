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
    * [`I.compose2(b => c, (a1, ..., aN) => b) ~> a1 => ... aN => c`](#I-compose2)
    * [`I.pipe2((a1, ..., an) => b, b => c) ~> a1 => ... aN => c`](#I-pipe2)
  * [Sequencing](#sequencing)
    * [`I.seq(value, ...fns) ~> value`](#I-seq)
    * [`I.seqPartial(maybeValue, ...fns) ~> maybeValue`](#I-seq)
  * [Basic combinators](#basic-combinators)
    * [`I.always(x, _) ~> x`](#I-always)
    * [`I.apply(x => y, x) ~> y`](#I-apply)
    * [`I.id(x) ~> x`](#I-id)
    * [`I.snd(_, x) ~> x`](#I-snd)
  * [Constants](#constants)
    * [`I.array0 ~> []`](#I-array0)
    * [`I.object0 ~> {}`](#I-object0)
  * [Type predicates](#type-predicates)
    * [`I.isArray(any) ~> boolean`](#I-isArray)
    * [`I.isDefined(any) ~> boolean`](#I-isDefined)
    * [`I.isFunction(any) ~> boolean`](#I-isFunction)
    * [`I.isInstanceOf(Type, any) ~> boolean`](#I-isInstanceOf)
    * [`I.isNumber(any) ~> boolean`](#I-isNumber)
    * [`I.isObject(any) ~> boolean`](#I-isObject)
    * [`I.isString(any) ~> boolean`](#I-isString)
    * [`I.isThenable(any) ~> boolean`](#I-isThenable)
  * [Equality](#equality)
    * [`I.acyclicEquals(any, any) ~> boolean`](#I-acyclicEquals)
    * [`I.hasKeysOf(template, object)`](#I-hasKeysOf)
    * [`I.identical(any, any) ~> boolean`](#I-identical)
    * [`I.whereEq(template, object)`](#I-whereEq)
  * [Objects](#objects)
    * [`I.assocPartial(key, value, object) ~> object`](#I-assocPartial)
    * [`I.dissocPartial(key, object) ~> object|undefined`](#I-dissocPartial)
    * [`I.has(propName, object) ~> boolean`](#I-has)
    * [`I.keys(object) ~> [...keys]`](#I-keys)
    * [`I.toObject(object) ~> object`](#I-toObject)
    * [`I.unzipObjInto(object, keys, values)`](#I-unzipObjInto)
    * [`I.values(object) ~> [...values]`](#I-values)
  * [OOP](#oop)
    * [`I.inherit(Derived, Base, Methods, Statics) ~> Derived`](#I-inherit)
  * [Meta](#meta)
    * [`I.constructorOf(any) ~> Function|null|undefined`](#I-constructorOf)
    * [`I.create(proto[, properties]) ~> object`](#I-create)
    * [`I.freeze(any) ~> any`](#I-freeze)
    * [`I.defineName(function, string) ~> function`](#I-defineName)
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
      * [`I.IdentityOr(predicate, applicative|monad) ~> applicative|monad`](#I-IdentityOr)

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

##### <a id="I-compose2"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-compose2) [`I.compose2(b => c, (a1, ..., aN) => b) ~> a1 => ... aN => c`](#I-compose2)
##### <a id="I-pipe2"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-pipe2) [`I.pipe2((a1, ..., an) => b, b => c) ~> a1 => ... aN => c`](#I-pipe2)

#### <a id="sequencing"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#sequencing) [Sequencing](#sequencing)

##### <a id="I-seq"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-seq) [`I.seq(value, ...fns) ~> value`](#I-seq)
##### <a id="I-seqPartial"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-seqPartial) [`I.seqPartial(maybeValue, ...fns) ~> maybeValue`](#I-seq)

#### <a id="basic-combinators"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#basic-combinators) [Basic combinators](#basic-combinators)

##### <a id="I-always"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-always) [`I.always(x, _) ~> x`](#I-always)
##### <a id="I-apply"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-apply) [`I.apply(x => y, x) ~> y`](#I-apply)
##### <a id="I-id"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-id) [`I.id(x) ~> x`](#I-id)
##### <a id="I-snd"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-snd) [`I.snd(_, x) ~> x`](#I-snd)

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
##### <a id="I-isInstanceOf"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-isInstanceOf) [`I.isInstanceOf(Type, any) ~> boolean`](#I-isInstanceOf)
##### <a id="I-isNumber"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-isNumber) [`I.isNumber(any) ~> boolean`](#I-isNumber)
##### <a id="I-isObject"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-isObject) [`I.isObject(any) ~> boolean`](#I-isObject)
##### <a id="I-isString"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-isString) [`I.isString(any) ~> boolean`](#I-isString)
##### <a id="I-isThenable"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-isThenable) [`I.isThenable(any) ~> boolean`](#I-isThenable)

#### <a id="equality"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#equality) [Equality](#equality)

##### <a id="I-acyclicEquals"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-acyclicEquals) [`I.acyclicEquals(any, any) ~> boolean`](#I-acyclicEquals)
##### <a id="I-hasKeysOf"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-hasKeysOf) [`I.hasKeysOf(template, object)`](#I-hasKeysOf)
##### <a id="I-identical"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-identical) [`I.identical(any, any) ~> boolean`](#I-identical)
##### <a id="I-whereEq"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-whereEq) [`I.whereEq(template, object)`](#I-whereEq)

#### <a id="objects"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#objects) [Objects](#objects)

##### <a id="I-assocPartial"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-assocPartial) [`I.assocPartial(key, value, object) ~> object`](#I-assocPartial)
##### <a id="I-dissocPartial"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-dissocPartial) [`I.dissocPartial(key, object) ~> object|undefined`](#I-dissocPartial)
##### <a id="I-has"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-has) [`I.has(propName, object) ~> boolean`](#I-has)
##### <a id="I-keys"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-keys) [`I.keys(object) ~> [...keys]`](#I-keys)
##### <a id="I-toObject"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-toObject) [`I.toObject(object) ~> object`](#I-toObject)
##### <a id="I-unzipObjInto"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-unzipObjInto) [`I.unzipObjInto(object, keys, values)`](#I-unzipObjInto)
##### <a id="I-values"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-values) [`I.values(object) ~> [...values]`](#I-values)

#### <a id="oop"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#oop) [OOP](#oop)

##### <a id="I-inherit"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-inherit) [`I.inherit(Derived, Base, Methods, Statics) ~> Derived`](#I-inherit)

#### <a id="meta"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#meta) [Meta](#meta)

##### <a id="I-constructorOf"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-constructorOf) [`I.constructorOf(any) ~> Function|null|undefined`](#I-constructorOf)
##### <a id="I-create"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-create) [`I.create(proto[, properties]) ~> object`](#I-create)
##### <a id="I-freeze"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-freeze) [`I.freeze(any) ~> any`](#I-freeze)
##### <a id="I-defineName"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-defineName) [`I.defineName(function, string) ~> function`](#I-defineName)
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
###### <a id="I-IdentityOr"></a> [≡](#contents) [▶](https://polytypic.github.io/infestines/index.html#I-IdentityOr) [`I.IdentityOr(predicate, applicative|monad) ~> applicative|monad`](#I-IdentityOr)
