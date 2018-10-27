# Changelog

## 0.5.0

Renamed `apply` as `ap` and introduced a new function named `apply`.

## 0.4.0

Generalized `keys`, `values`, `assocPartialU` and `dissocPartialU` to allow
objects with constructor other than `Object`.

## 0.3.0

Removed `pipe`, `pipe2`, `pipe3`, `pipe4` and added just `pipe2U` and
`compose2U` instead.

Changed the semantics of `curryN` to support staged functions.  Previously
`curryN(n, fn)` changed the arity of the given function `fn` to `n`.  Now the
`n` signifies the total number of arguments and the function is allowed to be
staged.

Added `arityN(n, fn)` to set the arity of a given function `fn` to `n` and also
to curry the function.

Removed `assert`.  It is better to explicitly compare against
`process.env.NODE_ENV` in libraries, because this allows minifiers to eliminate
the assertions.

## 0.2.0

Removed

* `mapPartialU`
* `zipObjPartialU`
* `unzipObj`

because their functionality turned out to be be too specialized.
