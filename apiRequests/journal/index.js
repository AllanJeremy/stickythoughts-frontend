/* 
    This file is simply meant to be an aggregator of all journal api requests
    This file does not implement any logic of its own and simply serves the purpose of importing functions and exporting them out together so that they can be loaded from one file.
*/
import createJournal from './createJournal'
import updateJournal from './updateJournal'
import deleteJournal from './deleteJournal'

//* EXPORTS
export default { createJournal, updateJournal, deleteJournal }
