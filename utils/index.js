const firstUpperCase = ([first, ...rest]) => first.toUpperCase() + rest.join('')

module.exports = {
  firstUpperCase
}