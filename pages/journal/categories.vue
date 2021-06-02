<template>
  <section>
    <CategoriesForm
      :on-updated="updateCategoryData"
      :should-prepopulate="true"
      :user-categories="userData.categories"
    >
      <v-card-actions class="mt-8">
        <v-spacer></v-spacer>
        <v-btn
          class="white--text"
          color="teal"
          :loading="btnUpdateCategoriesLoading"
          :disabled="categories.length < 2 || btnUpdateCategoriesLoading"
          @click="updateUserCategories"
        >
          Update categories
        </v-btn>
      </v-card-actions>
    </CategoriesForm>
  </section>
</template>

<script>
import { mapState } from 'vuex'

// Data
import { defaultErrorMessage } from '@/data/messages/feedback'

// API requests
import { userApi } from '@/apiRequests'

// Components
import CategoriesForm from '@/components/forms/CategoriesForm.vue'

export default {
  components: { CategoriesForm },
  layout: 'app',
  data() {
    return {
      categories: [],
      btnUpdateCategoriesLoading: false,
    }
  },
  head() {
    return {
      title: 'My Categories',
    }
  },
  computed: {
    ...mapState('user', { userData: 'data' }),
  },
  methods: {
    updateCategoryData(categoriesSelected) {
      this.categories = categoriesSelected
    },
    updateUserCategories() {
      const updateData = {
        categories: this.categories,
      }

      this.btnUpdateCategoriesLoading = true

      userApi
        .updateUser(this.userData.uid, updateData)
        .then(() => {
          this.$toast.success('Successfully updated categories')
        })
        .catch(() => {
          this.$toast.error(defaultErrorMessage)
        })
        .finally(() => {
          this.btnUpdateCategoriesLoading = false
        })
    },
  },
}
</script>
