[ [GitHub](https://github.com/polytypic/infestines) | [Try Infestines!](https://polytypic.github.io/infestines/)  ]

This is a minimalistic library of basic utilities, such as currying, for writing
more interesting high performance FP libraries.  **This library is not intended
to be used for application programming.** Primitives that are too specialized to
be used as a basis for nearly optimal implementations of higher level operations
are not provided.

[![npm version](https://badge.fury.io/js/infestines.svg)](http://badge.fury.io/js/infestines) [![Build Status](https://travis-ci.org/polytypic/infestines.svg?branch=master)](https://travis-ci.org/polytypic/infestines) [![Code Coverage](https://img.shields.io/codecov/c/github/polytypic/infestines/master.svg)](https://codecov.io/github/polytypic/infestines?branch=master) [![](https://david-dm.org/polytypic/infestines.svg)](https://david-dm.org/polytypic/infestines) [![](https://david-dm.org/polytypic/infestines/dev-status.svg)](https://david-dm.org/polytypic/infestines?type=dev)

You can [try Infestines](https://polytypic.github.io/infestines/) in your
browser:

```js
I.curryN(2, x => {
  const x2 = x*x
  return y => x2 + y
})(2, 3)
// 7
```
