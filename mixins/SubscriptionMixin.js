import _ from 'lodash'
import { getLinkWithQueryParams } from '../helpers/redirect'

export default {
  methods: {
    redirectToSubscribe(
      onSuccessRedirectLink = 'https://stickythoughts.app/journal'
    ) {
      // No point redirecting if there is no plan provided ~ we won't know what to subscribe to
      if (_.isEmpty(this.$route.query.plan)) {
        return
      }

      const redirectLinkWithParams = getLinkWithQueryParams(
        `/billing/subscribe?redirect=${onSuccessRedirectLink}`,
        this.$route
      )

      window.location.href = redirectLinkWithParams
    },
  },
}
