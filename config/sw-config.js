module.exports = {
  cache: {
    cacheId: "VinFin",
    runtimeCaching: [{
      handler: "fastest",
      urlPattern: "\/$"
    }],
    staticFileGlobs: ['dist/**/*']
  },
  manifest: {
    background: "#FFFFFF",
    title: "VinFin",
    short_name: "PWA",
    theme_color: "#FFFFFF"
  }
};
