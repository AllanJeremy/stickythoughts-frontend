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
        v-model="otherCustomerTypeText"
        v-if="customerTypeOtherSelected"
        label="💭 What did we miss?"
        solo
        hide-details
        class="mt-4 mx-4"
      ></v-text-field>
    </v-fade-transition>

    <slot></slot>
  </section>
</template>

<script>
import _ from 'lodash'

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
      customerTypeSuggestions,
      otherCustomerTypeText: '',
      selectedCustomerTypes: defaultCustomerTypes,
    }
  },
  computed: {
    selectedCustomerTypeValues() {
      let customerTypeValues = this.selectedCustomerTypes.map(
        (customerType) => customerType.value
      )

      // 'Other' is selected and text has been provided ~ add it to the list of potential customer descriptions
      if (
        customerTypeValues.includes('other') &&
        !_.isEmpty(this.otherCustomerTypeText)
      ) {
        // Add the `other` value. We use 'other:' so that we can know which customer types are custom in the database
        const valueToAdd = `other: ${this.otherCustomerTypeText.toLowerCase()}`
        customerTypeValues = [...customerTypeValues, valueToAdd]
      }

      // Remove empty values from the existing customer type values ~ means we only get actual values
      customerTypeValues = customerTypeValues.filter(
        (value) => !_.isEmpty(value)
      )

      return customerTypeValues
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
