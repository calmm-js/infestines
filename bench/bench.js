'use strict';

const I = require("../lib/infestines")
const R = require("ramda")

const addU = (x, y) => x + y
const addC = I.curry(addU)

const d1 = {x:[1],z:{},y:{z:[1,2,{a:[3]}]}}
const d2 = {x:[1],z:{},y:{z:[1,2,{a:[3]}]}}

const ks = ["a", "b", "c"]
const vs = [1, 2, 3]

const vs1000 = Array(1000).fill(1)

const inc = x => x + 1
const inc2I = I.pipe(inc, inc)
const inc2R = R.pipe(inc, inc)

const bs = [
  'inc2I(1)',
  'inc2R(1)',

  'I.pipe(inc, inc)(1)',
  'R.pipe(inc, inc)(1)',

  'I.whereEqU(d1, d2)',
  'R.whereEq(d1, d2)',

  'I.mapPartialU(inc, vs)',
  'R.map(inc, vs)',

  'I.mapPartialU(inc, vs1000)',
  'R.map(inc, vs1000)',

  'I.zipObjPartialU(ks, vs)',
  'R.zipObj(ks, vs)',

  'I.keys(d1)',
  'R.keys(d1)',

  'I.values(d1)',
  'R.values(d1)',

  'addU(1, 2)',
  'addC(1, 2)',
  'R.add(1, 2)',

  'I.seq(0, inc)',
  'I.seq(0, inc, inc)',
  'I.seq(0, inc, inc, inc)',
  'I.seq(0, inc, inc, inc, inc)',

  'I.identicalU(null, null)',
  'R.identical(null, null)',

  'I.acyclicEqualsU(d1, d2)',
  'R.equals(d1, d2)',
]

const s = new require("benchmark").Suite()
bs.forEach(b => s.add(b, eval("() => " + b)))
s.on('cycle', e => console.log(String(e.target))).run()
