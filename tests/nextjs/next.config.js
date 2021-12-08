const { resolve } = require('path');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: false,
});

module.exports = withBundleAnalyzer({
  webpack: (config) => {
    config.module.rules.push({
      test: /\.js/,
      include: resolve('./node_modules/@chakra-ui'),
      loader: resolve('../../src/index.js'),
      options: {
        ignoreComponents: ['Alert', 'Table', 'Tabs', 'Slider'],
        ignoreColors: [
          'facebook',
          'purple',
          'green',
          'pink',
          'linkedin',
          'facebook',
          'messenger',
          'whatsapp',
          'twitter',
          'telegram',
        ],
        ignoreBreakpoints: ['xl', '2xl'],
      },
    });

    return config;
  },
});
