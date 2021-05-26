/** An object representing the default color */
const defaultColor = {
  backgroundColor: '#FFF2CA',
  textColor: '#212121',
  dark: false,
  isActive: true,
}

/** An array of objects representing color suggestions */
// ? Don't forget to update the active state of the default color chosen in this array when you update the default color
const colorSuggestions = [
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
]

//* EXPORTS
export { defaultColor, colorSuggestions }
