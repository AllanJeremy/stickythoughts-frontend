<template>
  <section>
    <h2 class="secondary--text">Make it yours</h2>
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
export default {
  name: 'CustomizationForm',
  props: {
    onUpdate: {
      type: Function,
      default: (customizations) => {},
    },
    title: {
      type: String,
      default: 'Make StickyThoughts yours',
    },
  },
  data() {
    return {
      selectedColor: {
        backgroundColor: '#FFF2CA',
        textColor: '#212121',
        dark: false,
        isActive: true,
      },
      colorSuggestions: [
        // Default - light yellow orange
        {
          backgroundColor: '#FFF2CA',
          textColor: '#212121',
          dark: false,
          isActive: true,
        },

        // Light purple
        {
          backgroundColor: '#F3EAFF',
          textColor: '#212121',
          dark: false,
          isActive: false,
        },

        // Light blue
        {
          backgroundColor: '#DAF8FF',
          textColor: '#212121',
          dark: false,
          isActive: false,
        },

        // Light red
        {
          backgroundColor: '#FFC2C2',
          textColor: '#212121',
          dark: false,
          isActive: false,
        },

        // Bluer blue - still light though
        {
          backgroundColor: '#B5C9FF',
          textColor: '#212121',
          dark: false,
          isActive: false,
        },

        // Light brown
        {
          backgroundColor: '#E2C9C9',
          textColor: '#212121',
          dark: false,
          isActive: false,
        },
      ],
    }
  },
  computed: {
    customizationsToSubmit() {
      const customizations = {
        color: {
          background: this.selectedColor.backgroundColor,
          text: this.selectedColor.textColor || '#212121',
        },
      }

      // TODO: Consider adding pattern customization

      return customizations
    },
  },
  watch: {
    customizationsToSubmit(customizations) {
      // Pass this information to on updated
      this.onUpdate(customizations)
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
}

.selectable-item {
  &:hover {
    cursor: pointer;
  }
}
</style>
