/* 
    This file is simply meant to be an aggregator for all mixins
    This file does not implement any logic of its own and simply serves the purpose of importing functions and exporting them out together so that they can be loaded from one file.
*/
import AudioPlayerMixin from './AudioPlayerMixin'
import AuthMixin from './AuthMixin'
import Analytics from './Analytics'
import FormatMixin from './FormatMixin'
import JournalMixin from './JournalMixin'
import NavMixin from './NavMixin'
import ShareMixin from './ShareMixin'
import SubscriptionMixin from './SubscriptionMixin'
import UploadMixin from './UploadMixin'

// * EXPORTS
export {
  Analytics,
  AuthMixin,
  AudioPlayerMixin,
  FormatMixin,
  JournalMixin,
  NavMixin,
  ShareMixin,
  SubscriptionMixin,
  UploadMixin,
}
