/* 
    This file is simply meant to be an aggregator for all mixins
    This file does not implement any logic of its own and simply serves the purpose of importing functions and exporting them out together so that they can be loaded from one file.
*/
import AudioPlayerMixin from './AudioPlayerMixin'
import FormatMixin from './FormatMixin'
import NavMixin from './NavMixin'
import UploadMixin from './UploadMixin'

// * EXPORTS
export { AudioPlayerMixin, FormatMixin, NavMixin, UploadMixin }
