<template>
  <v-card
    class="py-4"
    :color="cardBackgroundColor"
    height="85vh"
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
          step="2"
          :complete="currentStep > 2"
        ></v-stepper-step>

        <v-divider></v-divider>
        <v-stepper-step
          color="secondary"
          step="3"
          :complete="currentStep > 3"
        ></v-stepper-step>
      </v-stepper-header>

      <!-- Steps -->
      <v-stepper-items>
        <!-- Step 1 - Welcome & Name entry -->
        <v-stepper-content step="1">
          <EmptyContainer image-url="/celebrate-balloon.svg">
            <h1>Sweet! You're in.</h1>
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
              <v-btn color="secondary" outlined @click="goToStep(2)"
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

        <!-- Step 2 - Choose categories -->
        <v-stepper-content step="2">
          <CategoriesForm :on-updated="updateCategoriesData">
            <!-- Card actions - proceed to customization -->
            <div class="pt-8 d-flex">
              <v-btn color="secondary" outlined @click="goToStep(1)"
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

        <!-- Step 3 - Customize UI -->
        <v-stepper-content step="3">
          <CustomizationForm :on-updated="updateCustomization">
            <div class="pt-8 d-flex">
              <v-btn
                color="secondary"
                outlined
                :disabled="!btnCompleteOnboardingEnabled"
                @click="goToStep(2)"
              >
                Back
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                class="white--text"
                color="teal"
                depressed
                :disabled="!btnCompleteOnboardingEnabled"
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

// Api requests
import { userApi } from '@/apiRequests'

// Components
import CategoriesForm from '@/components/forms/CategoriesForm.vue'
import CustomizationForm from '@/components/forms/CustomizationForm.vue'
import EmptyContainer from '@/components/EmptyContainer.vue'

export default {
  components: { CategoriesForm, CustomizationForm, EmptyContainer },
  layout: 'onboarding',
  data() {
    return {
      btnCompleteOnboardingEnabled: true, // Button is enabled by default
      fullName: '',
      categoriesData: [],
      currentStep: 3, // ? First step - "no 💩 Sherlock!""
      userUpdateData: {},
      customizationData: null,
      cardBackgroundColor: defaultColor.backgroundColor, // Reference `data/colorSuggestions.js` to understand object strucutre
    }
  },
  computed: {
    ...mapState('user', {
      userLoading: 'isLoading',
      userData: 'data',
    }),
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

    userData(data) {
      // Do nothing if no user data was found from the database - using dateJoined to check if it is a db record
      if (_.isEmpty(data.name)) return

      //* Getting here means a user was found in the database
      this.fullName = data.name
    },
  },
  methods: {
    updateCategoriesData(categories) {
      this.categoriesData = categories
    },
    updateCustomization(customization) {
      this.cardBackgroundColor = customization.color.background
      this.customizationData = customization
    },

    goToStep(step) {
      this.currentStep = step
    },

    //* SUBMIT INFO FUNCTIONS - ACTIONS THAT MOVE TO THE NEXT STEP WHILE SAVING USER INPUT
    submitName() {
      this.userUpdateData.name = this.fullName
      this.goToStep(2)
    },
    submitCategories() {
      this.userUpdateData.categories = this.categoriesData
      this.goToStep(3)
    },
    submitCustomizations() {
      this.userUpdateData.customization = this.customizationData
    },
    completeOnboarding() {
      // Implicitly submit customizations since they are the last thing someone does
      this.submitCustomizations()

      this.btnCompleteOnboardingEnabled = false

      // Update the user
      userApi
        .updateUser(this.userData.uid, this.userUpdateData)
        .then(() => {
          this.$toast.success(`That's it! Welcome onboard, ${this.fullName}`)

          this.goTo('/journal/record')
        })
        .catch(() => {
          this.$toast.error(
            'Aww, shucks! Looks like we messed up. Please try again :(. Sorry.'
          )

          // Incase something went wrong, we re-enable the complete onboarding button so that they can try again
          this.btnCompleteOnboardingEnabled = true
        })

      // Automatically re-enable the complete setup button after 3.5 seconds if it hasn't yet been re-enabled
      setTimeout(() => {
        this.btnCompleteOnboardingEnabled = true
      }, 3500)
    },
  },
}
</script>

<style scoped>
.v-stepper,
.v-stepper__header {
  box-shadow: none !important;
}
</style>
