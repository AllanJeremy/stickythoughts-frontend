<template>
  <section>
    <h1 class="secondary--text">{{ title }}</h1>
    <p class="secondary--text font-weight-light">
      {{ subtitle }}
    </p>
    <p class="font-weight-light mb-0">What best describes you?</p>

    <v-row no-gutters>
      <v-col
        v-for="(customerType, i) in customerTypeSuggestions"
        :key="`customer-type-${i}`"
        cols="6"
        :class="`pb-0 pl-${(i % 2) * 3}`"
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
        v-model="otherCustomerTypeText"
        label="💭 What did we miss?"
        solo
        hide-details
        class="mt-4"
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
    subtitle: {
      type: String,
      default: "Let's get you up and running 💨",
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
    /** Filters out 'other' as a selection - instead opting to add the text value of the 'other' field */
    selectedCustomerTypeValues() {
      let customerTypeValues = this.selectedCustomerTypes

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
      customerTypeValues = customerTypeValues.filter((value) => {
        return !_.isEmpty(value) && value !== 'other'
      })

      return customerTypeValues
    },
    customerTypeOtherSelected() {
      const otherSelected = this.selectedCustomerTypes.includes('other')

      return otherSelected
    },
  },
  watch: {
    otherCustomerTypeText(text) {
      this.otherCustomerTypeText = _.upperFirst(text.toLowerCase())
    },
    selectedCustomerTypeValues(customerTypeValues) {
      this.onUpdated(customerTypeValues)
    },
  },
}
</script>
