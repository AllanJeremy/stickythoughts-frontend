<template>
  <v-card
    class="py-4"
    :color="cardBackgroundColor"
    height="100%"
    max-height="35rem"
    width="90vw"
    max-width="25rem"
  >
    <v-stepper v-model="currentStep" class="transparent shadow-none">
      <!-- Header -->
      <v-stepper-header style="height: 3.2rem">
        <v-stepper-step
          color="secondary"
          complete-icon="mdi-check"
          step="1"
          :complete="currentStep > 1"
        ></v-stepper-step>
        <v-divider></v-divider>

        <v-stepper-step
          color="secondary"
          complete-icon="mdi-check"
          step="2"
          :complete="currentStep > 2"
        ></v-stepper-step>

        <v-divider></v-divider>
        <v-stepper-step
          color="secondary"
          step="3"
          :complete="currentStep > 3"
        ></v-stepper-step>

        <v-divider></v-divider>
        <v-stepper-step
          color="secondary"
          step="4"
          :complete="currentStep > 4"
        ></v-stepper-step>
      </v-stepper-header>

      <!-- Steps -->
      <v-stepper-items>
        <!-- Step 1 - Customer feedback -->
        <v-stepper-content step="1">
          <CustomerTypeForm :on-updated="updateCustomerTypesData">
            <div class="mt-6 d-flex">
              <v-spacer></v-spacer>
              <v-btn
                class="white--text"
                color="teal"
                depressed
                :disabled="!btnSubmitCustomerTypesEnabled"
                :loading="btnSubmitCustomerTypesLoading"
                @click="submitCustomerTypes"
                >Next
              </v-btn>
            </div>
          </CustomerTypeForm>
        </v-stepper-content>

        <!-- Step 2 - Welcome & Name entry -->
        <v-stepper-content step="2">
          <EmptyContainer image-url="/celebrate-balloon.svg">
            <h1 class="text-2x mb-1">Sweet! You're in.</h1>
            <p class="font-weight-light">Let us help you set things up.</p>

            <p class="mt-6 mb-2 text-left font-weight-bold secondary--text">
              What should we call you?
            </p>

            <v-text-field
              v-model="fullName"
              name="fullName"
              solo
              hint="The default one came from your login"
              :disabled="userLoading"
              :loading="userLoading"
            ></v-text-field>

            <div class="d-flex flex-row justify-space-between">
              <v-btn color="secondary" outlined @click="goToStep(3)"
                >Skip</v-btn
              >
              <v-btn
                class="white--text"
                color="teal"
                depressed
                :disabled="!fullName.length"
                @click="submitName"
                >Next
              </v-btn>
            </div>
          </EmptyContainer>
        </v-stepper-content>

        <!-- Step 3 - Choose categories -->
        <v-stepper-content step="3">
          <CategoriesForm :on-updated="updateCategoriesData">
            <!-- Card actions - proceed to customization -->
            <div class="pt-8 d-flex">
              <v-btn color="secondary" outlined @click="goToStep(2)"
                >Back</v-btn
              >
              <v-spacer></v-spacer>
              <v-btn
                class="white--text"
                color="teal"
                depressed
                :disabled="categoriesData.length < 2"
                @click="submitCategories"
                >Next - Make it yours
              </v-btn>
            </div>
          </CategoriesForm>
        </v-stepper-content>

        <!-- Step 4 - Customize UI -->
        <v-stepper-content step="4">
          <CustomizationForm :on-updated="updateCustomization">
            <div class="pt-8 d-flex">
              <v-btn
                color="secondary"
                outlined
                :disabled="!btnCompleteOnboardingEnabled"
                @click="goToStep(3)"
              >
                Back
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                class="white--text"
                color="teal"
                depressed
                :disabled="!btnCompleteOnboardingEnabled"
                :loading="btnCompleteOnboardingLoading"
                @click="completeOnboarding"
                >Complete setup
              </v-btn>
            </div>
          </CustomizationForm>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-card>
</template>

<script>
import _ from 'lodash'
import { mapState } from 'vuex'

// Data
import { defaultColor } from '@/data/colorSuggestions'
import { defaultErrorMessage } from '@/data/messages/feedback'

// Api requests
import { marketInsightApi, userApi } from '@/apiRequests'

// Components
import CategoriesForm from '@/components/forms/CategoriesForm.vue'
import CustomerTypeForm from '@/components/forms/CustomerTypeForm.vue'
import CustomizationForm from '@/components/forms/CustomizationForm.vue'
import EmptyContainer from '@/components/EmptyContainer.vue'

// Mixins
import { NavMixin } from '@/mixins'

export default {
  components: {
    CategoriesForm,
    CustomerTypeForm,
    CustomizationForm,
    EmptyContainer,
  },
  mixins: [NavMixin],
  layout: 'onboarding',
  data() {
    return {
      // 👇🏾 Added in order of appearance/requirement, not alphabetical
      btnSubmitCustomerTypesLoading: false,
      btnCompleteOnboardingLoading: false,

      fullName: '',
      categoriesData: [],
      currentStep: 1, // ? First step - "no 💩 Sherlock!""
      userUpdateData: {},
      customerTypesData: null,
      customizationData: null,
      cardBackgroundColor: defaultColor.backgroundColor, // Reference `data/colorSuggestions.js` to understand object strucutre
    }
  },
  computed: {
    ...mapState('user', {
      userLoading: 'isLoading',
      userData: 'data',
    }),
    btnCompleteOnboardingEnabled() {
      const isEnabled = !this.btnCompleteOnboardingLoading

      return isEnabled
    },

    btnSubmitCustomerTypesEnabled() {
      // Only enable if the button is not loading and at least one customer type has been selected
      const isEnabled =
        !this.btnSubmitCustomerTypesLoading &&
        !_.isEmpty(this.customerTypesData)

      return isEnabled
    },
  },
  watch: {
    fullName(name) {
      const nameFormatted = name
        .toLowerCase()
        .replace(/\s/g, ' ')
        .split(' ')
        .map((str) => _.upperFirst(str))
        .join(' ')
        .trim()

      this.fullName = nameFormatted
    },

    userData(user) {
      //* Getting here means a user was found in the database
      this.fullName = user.name

      // Redirect user to record page if they are logged in and not new
      if (!_.isEmpty(user.dateJoined) && !user.isNew) {
        this.goTo('/journal/record')
      }
    },
  },
  methods: {
    // Categories update
    updateCategoriesData(categories) {
      this.categoriesData = categories
    },

    // Customer types update
    updateCustomerTypesData(customerTypes) {
      this.customerTypesData = customerTypes
    },

    // Customization update
    updateCustomization(customization) {
      this.cardBackgroundColor = customization.color.background
      this.customizationData = customization
    },

    goToStep(step) {
      this.currentStep = step
    },

    //* SUBMIT INFO FUNCTIONS - ACTIONS THAT MOVE TO THE NEXT STEP WHILE SAVING USER INPUT
    submitCustomerTypes() {
      // Set loading status
      this.btnSubmitCustomerTypesLoading = true

      // API request
      marketInsightApi
        .addCustomerTypes(this.userData.uid, this.customerTypesData)
        .then(() => {
          // TODO: Migrate this message to feedback messages data file
          this.$toast.success('Thanks! This helps us improve for you.')

          // Move to the next step in the onboarding process if successful
          this.goToStep(2)
        })
        .catch(() => {
          this.$toast.error(defaultErrorMessage)
        })
        .finally(() => {
          // Wait 1 second before stopping the loading ~ gives time for redirects to occur without interruption
          setTimeout(() => {
            this.btnSubmitCustomerTypesLoading = false
          }, 1000)
        })
    },
    submitName() {
      this.userUpdateData.name = this.fullName
      this.goToStep(3)
    },
    submitCategories() {
      this.userUpdateData.categories = this.categoriesData
      this.goToStep(4)
    },
    submitCustomizations() {
      this.userUpdateData.customization = this.customizationData
    },
    completeOnboarding() {
      // Implicitly submit customizations since they are the last thing someone does
      this.submitCustomizations()

      this.btnCompleteOnboardingLoading = true

      // Update the user
      userApi
        .updateUser(this.userData.uid, this.userUpdateData)
        .then(() => {
          // TODO: Migrate this message to feedback messages data file
          this.$toast.success(`That's it! Welcome onboard, ${this.fullName}`)

          this.goTo('/journal/record')
        })
        .catch((error) => {
          this.$toast.error(defaultErrorMessage)

          // eslint-disable-next-line no-console
          console.error('Error details:', error)
        })
        .finally(() => {
          // Wait 1 second before stopping the loading ~ gives time for redirects to occur without interruption
          setTimeout(() => {
            this.btnCompleteOnboardingLoading = false
          }, 1000)
        })
    },
  },
}
</script>

<style scoped>
.text-2x {
  font-size: 200%;
}

.v-stepper,
.v-stepper__header {
  box-shadow: none !important;
}
</style>
