module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
    "postcss-preset-env": {
      browsers: "last 2 versions",
    },
    cssnano: process.env.NODE_ENV === "production" ? {} : false,
  },
};
