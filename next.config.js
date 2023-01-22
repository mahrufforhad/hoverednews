/** @type {import('next').NextConfig} */
const webpack = require('webpack');
const withPWA = require('next-pwa');

const nextConfig = withPWA({
  reactStrictMode: true,
  pwa:{
    dest: 'public',
    register: true,
    skipWaiting: true
  },
  images: {
      domains: ['firebasestorage.googleapis.com', 'cdn.weatherapi.com', 'ui-avatars.com'],
  },
  webpack: (config, { webpack }) => {
    config.plugins.push(
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery",
      })
    );
  
    return config;
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  }
})

module.exports = nextConfig
