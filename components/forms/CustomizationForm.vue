<template>
  <section>
    <h2 class="secondary--text">{{ title }}</h2>
    <p class="font-weight-light">
      Pick a color that best represents you
      <br />
      <small>Don't worry, you can always change this later</small>
    </p>

    <v-card id="bg-color-selection-card" class="pa-6">
      <v-row>
        <v-col
          v-for="(color, i) in colorSuggestions"
          :key="`color-${i}`"
          class="d-flex justify-center align-center"
          cols="4"
        >
          <div :class="color.isActive ? 'ring' : ''">
            <v-card
              class="selectable-item d-flex flex-row justify-center align-center round"
              :color="color.backgroundColor"
              height="60"
              width="60"
              @click="selectColor(i)"
            >
            </v-card>
          </div>
        </v-col>
      </v-row>
    </v-card>

    <slot></slot>
  </section>
</template>

<script>
import { defaultColor, colorSuggestions } from '@/data/colorSuggestions'

export default {
  name: 'CustomizationForm',
  props: {
    onUpdated: {
      type: Function,
      default: (customization) => {},
    },
    title: {
      type: String,
      default: 'Make it yours',
    },
  },
  data() {
    return {
      selectedColor: defaultColor,
      colorSuggestions,
    }
  },
  computed: {
    customizationToSubmit() {
      const customization = {
        color: {
          background: this.selectedColor.backgroundColor,
          text: this.selectedColor.textColor || '#212121',
        },
      }

      // TODO: Consider adding pattern customization

      return customization
    },
  },
  watch: {
    customizationToSubmit(customization) {
      // Pass this information to on updated
      this.onUpdated(customization)
    },
  },
  methods: {
    selectColor(colorSuggestionIndex) {
      this.colorSuggestions = this.colorSuggestions.map((color, index) => {
        // Make the currently selected color active
        color.isActive = index === colorSuggestionIndex

        return color
      })

      this.selectedColor = this.colorSuggestions[colorSuggestionIndex]
    },
  },
}
</script>

<style lang="scss" scoped>
#bg-color-selection-card {
  background-image: url('/idea-bulb-hazy-background.jpg');
  background-size: cover;
  background-repeat: no-repeat;
}

.round {
  border-radius: 100% !important;
}

.ring {
  padding: 6px;
  border-radius: 100% !important;
  border: 4px solid rgba(255, 255, 255, 0.35);
  transition: border-width 0.25s;
}

.selectable-item {
  &:hover {
    cursor: pointer;
  }
}
</style>
