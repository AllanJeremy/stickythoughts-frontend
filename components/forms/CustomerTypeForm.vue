<template>
  <section>
    <h1 class="secondary--text">{{ title }}</h1>
    <p class="secondary--text font-weight-light">
      Let's get started setting up your account
    </p>
    <p class="font-weight-light mb-0">Which of these best describes you?</p>

    <v-row no-gutters>
      <v-col
        v-for="(customerType, i) in customerTypeSuggestions"
        :key="`customer-type-${i}`"
        cols="6"
        class="pb-0 pl-4"
      >
        <v-checkbox
          v-model="selectedCustomerTypes"
          :label="customerType.text"
          :value="customerType.value"
          color="teal"
          hide-details
        ></v-checkbox>
      </v-col>
    </v-row>

    <v-fade-transition>
      <v-text-field
        v-if="customerTypeOtherSelected"
        label="💭 What did we miss?"
        solo
        hide-details
        class="mt-6 mx-4"
      ></v-text-field>
    </v-fade-transition>

    <p class="secondary--text mt-6 text-center">
      <small>Thanks! This helps us improve for you.</small>
    </p>

    <slot></slot>
  </section>
</template>

<script>
import {
  defaultCustomerTypes,
  customerTypeSuggestions,
} from '@/data/customerTypeSuggestions'

export default {
  name: 'CustomerTypeForm',
  props: {
    title: {
      type: String,
      default: 'Glad to have you here!',
    },
    onUpdated: {
      type: Function,
      default: (customerTypes) => {},
    },
  },
  data() {
    return {
      selectedCustomerTypes: defaultCustomerTypes,
      customerTypeSuggestions,
    }
  },
  computed: {
    selectedCustomerTypeValues() {
      const values = this.selectedCustomerTypes.map(
        (customerType) => customerType.value
      )

      return values
    },
    customerTypeOtherSelected() {
      const otherSelected = this.selectedCustomerTypeValues.includes('other')

      return otherSelected
    },
  },
  watch: {
    selectedCustomerTypeValues(customerTypeValues) {
      this.onUpdated(customerTypeValues)
    },
  },
}
</script>
