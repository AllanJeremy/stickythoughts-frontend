/** This file serves as an aggregator for all user API requests so we can import them with a single `import` statement  */
import createUser from './createUser'
import updateUser from './updateUser'

//* EXPORTS
export default { createUser, updateUser }
