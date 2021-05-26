<template>
  <v-card
    class="py-4"
    color="rgb(255 242 202)"
    min-height="85vh"
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
        <v-stepper-step step="3" :complete="currentStep > 3"></v-stepper-step>
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
              <v-btn color="secondary" outlined>Skip</v-btn>
              <v-btn
                class="white--text"
                color="teal"
                depressed
                :disabled="!fullName.length"
                @click="goToStep(2)"
                >Next
              </v-btn>
            </div>
          </EmptyContainer>
        </v-stepper-content>

        <!-- Step 2 - Choose categories -->
        <v-stepper-content step="2">
          <h2>Let's get organized</h2>
          <p class="font-weight-light">Add at least 2 categories to continue</p>

          <div class="mb-8 d-flex align-center">
            <v-text-field
              v-model="categoryToAdd"
              solo
              label="Category name"
              :flat="categoryLimitReached"
              :disabled="categoryLimitReached"
              :background-color="categoryLimitReached ? '#DDD' : ''"
              clearable
              :placeholder="
                categoryLimitReached
                  ? `Maximum of ${MAX_CATEGORIES} categories reached`
                  : ''
              "
              hide-details
            ></v-text-field>

            <v-btn
              v-if="!categoryLimitReached"
              class="ml-4"
              color="teal"
              large
              outlined
              :disabled="!canAddCategory || categoryLimitReached"
              @click="addCategory"
              >Add</v-btn
            >
          </div>

          <section class="text-left mb-4">
            <div></div>
            <!-- Actual categories -->
            <v-fade-transition>
              <div v-if="categories.length" class="my-5">
                <h3 class="secondary--text mb-2">
                  My categories
                  <small class="font-weight-light">(8 max)</small>
                </h3>

                <v-row>
                  <v-col
                    v-for="(category, i) in categories"
                    :key="`cat-${i}`"
                    :cols="getCategoryCols(category.text)"
                    class="pb-0"
                  >
                    <v-slide-x-reverse-transition>
                      <v-chip
                        color="secondary"
                        text-color="white"
                        close
                        class="d-inline-block text-center chip--category"
                        @click:close="removeCategory(category)"
                        >{{ category.text }}</v-chip
                      >
                    </v-slide-x-reverse-transition>
                  </v-col>
                </v-row>
              </div>
            </v-fade-transition>

            <!-- Suggested category list -->
            <v-fade-transition>
              <div v-if="categorySuggestionsActive.length" class="pt-4">
                <h3 class="mb-3 secondary--text">Incase you need ideas</h3>

                <v-item-group multiple>
                  <v-row>
                    <v-col
                      v-for="(category, i) in categorySuggestionsActive"
                      :key="`suggested-cat-${i}`"
                      class="pb-0"
                      cols="6"
                    >
                      <v-item>
                        <v-chip
                          text-color="white"
                          class="d-inline-block text-center chip--category outline--dotted"
                          @click="addSuggestedCategory(category)"
                        >
                          <v-card-subtitle>{{ category.text }}</v-card-subtitle>
                        </v-chip>
                      </v-item>
                    </v-col>
                  </v-row>
                </v-item-group>
              </div>
            </v-fade-transition>
          </section>

          <!-- Card actions - proceed to customization -->
          <div class="pt-8 d-flex">
            <v-spacer></v-spacer>
            <v-btn
              class="white--text"
              color="teal"
              depressed
              :disabled="!categoriesComplete"
              >Next - Make it yours
            </v-btn>
          </div>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-card>
</template>

<script>
import _ from 'lodash'
import { mapState } from 'vuex'

import EmptyContainer from '@/components/EmptyContainer.vue'

export default {
  components: { EmptyContainer },
  layout: 'onboarding',
  data() {
    return {
      fullName: '',
      categoryToAdd: '',
      categories: [],
      categorySuggestions: [
        { text: 'Ideas', isSuggestion: true, isActive: true },
        { text: 'Business', isSuggestion: true, isActive: true },
        { text: 'Gratitude', isSuggestion: true, isActive: true },
        { text: 'Spirituality', isSuggestion: true, isActive: true },
      ],
      currentStep: 1,
      MAX_CATEGORIES: 8,
      userUpdateData: {},
    }
  },
  computed: {
    ...mapState('user', {
      userLoading: 'isLoading',
      userData: 'data',
    }),
    canAddCategory() {
      const canAdd =
        !_.isEmpty(this.categoryToAdd) && this.categoryToAdd.length >= 3

      return canAdd
    },
    categorySuggestionsActive() {
      const active = this.categorySuggestions.filter(
        (suggestion) => suggestion.isActive
      )

      return active
    },
    categoriesToSubmit() {
      const categories = this.categories.map((category) => category.text)

      return categories
    },
    categoriesComplete() {
      const isComplete = this.categoriesToSubmit.length >= 2

      return isComplete
    },
    categoryLimitReached() {
      const limitReached = this.categoriesToSubmit.length >= this.MAX_CATEGORIES

      return limitReached
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
    categoryToAdd(value) {
      value = value || ''
      const valueFormatted = value.replace(/\s/g, ' ').toLowerCase()

      this.categoryToAdd = _.upperFirst(valueFormatted)
    },
    userData(data) {
      // Do nothing if no user data was found from the database - using dateJoined to check if it is a db record
      if (_.isEmpty(data.name)) return

      //* Getting here means a user was found in the database
      this.fullName = data.name
    },
  },
  methods: {
    goToStep(step) {
      this.currentStep = step
    },
    /** Get the number of columns a category should occupy based on its length */
    getCategoryCols(categoryText) {
      const cols = categoryText.length > 12 ? '12' : '6'

      return cols
    },

    categoryIsDuplicate() {
      // TODO: Add implementation
    },
    addCategory() {
      const category = {
        text: this.categoryToAdd,
        isSuggestion: false,
      }

      this.categories = [...this.categories, category]

      // Clear the category input field
      this.categoryToAdd = ''
    },
    //
    addSuggestedCategory(category) {
      this.categories = [...this.categories, category]

      this.categorySuggestions = this.categorySuggestions.map(
        (categorySuggested) => {
          if (
            categorySuggested.text.toLowerCase() === category.text.toLowerCase()
          ) {
            categorySuggested.isActive = false
          }

          return categorySuggested
        }
      )
    },
    removeCategory(categoryToRemove) {
      // Remove from normal categories
      this.categories = this.categories.filter(
        (category) => category !== categoryToRemove
      )

      // Reactivate the category suggestion if it was a suggestion
      if (categoryToRemove.isSuggestion) {
        this.categorySuggestions = this.categorySuggestions.map(
          (suggestion) => {
            if (
              suggestion.text.toLowerCase() ===
              categoryToRemove.text.toLowerCase()
            ) {
              suggestion.isActive = true
            }

            return suggestion
          }
        )
      }
    },
  },
}
</script>

<style scoped>
.chip--category {
  width: 100%;
}
.outline--dotted {
  border: 1px dotted #8d8d8d;
}

.v-stepper,
.v-stepper__header {
  box-shadow: none !important;
}

.w-100 {
  width: 100%;
}
</style>
