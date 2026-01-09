// app/constants/Images.ts

export const Images = {
  branding: {
    logo: {
      black: require("../../assets/images/courimed-logo-black.png"),
      brown: require("../../assets/images/courimed-logo-brown.png"),
      mix: require("../../assets/images/courimed-logo-mix.png"),
      orange: require("../../assets/images/courimed-logo-orange.png"),
      white: require("../../assets/images/courimed-logo-white.png"),
    },
    icon: {
      black: require("../../assets/images/courimed-icon-black.png"),
      brown: require("../../assets/images/courimed-icon-brown.png"),
      mix: require("../../assets/images/courimed-icon-mix.png"),
      orange: require("../../assets/images/courimed-icon-orange.png"),
      white: require("../../assets/images/courimed-icon-white.png"),
    },
  },

  system: {
    adaptiveIcon: require("../../assets/adaptive-icon.png"),
  },
} as const;

export default Images;
