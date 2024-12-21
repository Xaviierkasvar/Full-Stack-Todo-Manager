const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Mantener la configuración existente de sourceExts
config.resolver.sourceExts = ['js', 'json', 'ts', 'tsx'];

// Añadir la configuración de assets
config.resolver.assetExts.push('png');

module.exports = config;