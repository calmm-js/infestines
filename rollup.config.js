import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'

export default {
  plugins: [
    process.env.NODE_ENV &&
      replace({'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)}),
    babel(),
    process.env.NODE_ENV === 'production' &&
      uglify({
        compress: {
          hoist_funs: true,
          passes: 3,
          pure_getters: true,
          pure_funcs: ['require']
        }
      })
  ].filter(x => x)
}
