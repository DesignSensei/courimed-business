// babel.config.js

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            "@app": "./app",
            "@constants": "./app/constants",
            "@components": "./app/components",
            "@data": "./app/data",
            "@services": "./app/services",
            "@assets": "./assets",
            "@auth": "./app/(auth)",
            "@tabs": "./app/(tabs)",
          },
        },
      ],
    ],
  };
};
