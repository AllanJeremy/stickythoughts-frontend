<template>
  <div>
    <h2 class="mb-2">{{ title }}</h2>
    <p v-if="categories.length < 2" class="font-weight-light">
      Add at least 2 categories to continue
    </p>

    <div class="mb-8 d-flex align-center">
      <v-text-field
        v-model="categoryToAdd"
        solo
        :label="
          categoryLimitReached ? 'Category limit reached' : 'Category name'
        "
        :flat="categoryLimitReached"
        :disabled="categoryLimitReached"
        :background-color="categoryLimitReached ? '#DDD' : ''"
        clearable
        :hint="
          categoryLimitReached
            ? `Maximum of ${MAX_CATEGORIES} categories reached`
            : ''
        "
        :persistent-hint="categoryLimitReached"
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
              :md="getCategoryCols(category.text) / 2"
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
                md="3"
              >
                <v-item>
                  <v-chip
                    text-color="secondary"
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

    <slot></slot>
  </div>
</template>

<script>
import _ from 'lodash'

import { categorySuggestions } from '@/data/categorySuggestions'

export default {
  name: 'CategoriesForm',
  props: {
    onUpdated: {
      type: Function,
      default: (categories) => {},
      required: true,
    },
    title: {
      type: String,
      default: "Let's get organized",
    },
    shouldPrepopulate: {
      type: Boolean,
      default: false,
    },
    userCategories: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      categoryToAdd: '',
      categories: [],
      categorySuggestions,
      MAX_CATEGORIES: 8,
    }
  },
  computed: {
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
    categoryLimitReached() {
      const limitReached = this.categoriesToSubmit.length >= this.MAX_CATEGORIES

      return limitReached
    },
  },
  watch: {
    categoryToAdd(value) {
      value = value || ''
      const valueFormatted = value.replace(/\s/g, ' ').toLowerCase()

      this.categoryToAdd = _.upperFirst(valueFormatted)
    },
    categoriesToSubmit(categories) {
      // Pass this information to on updated
      this.onUpdated(categories)
    },
  },
  created() {
    if (this.shouldPrepopulate) {
      this.userCategories.forEach((category) => {
        const categoryObj = { text: category }

        this.addSuggestedCategory(categoryObj)
      })
    }
  },
  methods: {
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

      this.categorySuggestions = this.categorySuggestions.map((suggestion) => {
        if (
          suggestion.text.toLowerCase() === categoryToRemove.text.toLowerCase()
        ) {
          suggestion.isActive = true
        }

        return suggestion
      })
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
</style>
