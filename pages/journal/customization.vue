<template>
  <section>
    <CustomizationForm
      :on-updated="updateCustomizationData"
      :should-prepopulate="true"
      :user-customization="userData.customization"
    >
      <v-card-actions class="mt-8">
        <v-spacer></v-spacer>
        <v-btn
          class="white--text"
          color="teal"
          :loading="btnUpdateCustomizationLoading"
          :disabled="btnUpdateCustomizationLoading"
          @click="updateUserCustomization"
        >
          Update customization
        </v-btn>
      </v-card-actions>
    </CustomizationForm>
  </section>
</template>

<script>
import { mapState } from 'vuex'

// Data
import { defaultErrorMessage } from '@/data/messages/feedback'

// API requests
import { userApi } from '@/apiRequests'

// Components
import CustomizationForm from '@/components/forms/CustomizationForm.vue'

export default {
  components: { CustomizationForm },
  layout: 'app',
  data() {
    return {
      customization: {},
      btnUpdateCustomizationLoading: false,
    }
  },
  computed: {
    ...mapState('user', { userData: 'data' }),
  },
  methods: {
    updateCustomizationData(customization) {
      this.customization = customization

      this.$store.dispatch('user/updateUserCustomization', customization)
    },
    updateUserCustomization() {
      const updateData = {
        customization: this.customization,
      }

      this.btnUpdateCustomizationLoading = true

      userApi
        .updateUser(this.userData.uid, updateData)
        .then(() => {
          this.$toast.success('Successfully updated customization')
        })
        .catch(() => {
          this.$toast.error(defaultErrorMessage)
        })
        .finally(() => {
          this.btnUpdateCustomizationLoading = false
        })
    },
  },
}
</script>
