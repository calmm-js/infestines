import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import {uglify} from 'rollup-plugin-uglify'

const build = ({NODE_ENV, format, suffix}) => ({
  input: 'src/infestines.js',
  output: {
    name: 'I',
    format,
    file: `dist/infestines.${suffix}`
  },
  plugins: [
    NODE_ENV && replace({'process.env.NODE_ENV': JSON.stringify(NODE_ENV)}),
    babel(),
    NODE_ENV === 'production' &&
      uglify({
        compress: {
          hoist_funs: true,
          passes: 3,
          pure_getters: true,
          pure_funcs: ['require']
        }
      })
  ].filter(x => x)
})

export default [
  build({format: 'cjs', suffix: 'cjs.js'}),
  build({format: 'es', suffix: 'es.js'}),
  build({format: 'umd', suffix: 'js', NODE_ENV: 'dev'}),
  build({format: 'umd', suffix: 'min.js', NODE_ENV: 'production'})
]
