import babel from "rollup-plugin-babel"

const main = "infestines"

export default {
  entry: `src/${main}.js`,
  plugins: [ babel() ],
  moduleName: "I",
  targets: [
    { dest: `dist/${main}.js`,     format: "umd" },
    { dest: `dist/${main}.cjs.js`, format: "cjs" },
    { dest: `dist/${main}.es.js`,  format: "es"  }
  ]
}
