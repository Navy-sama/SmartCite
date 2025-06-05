module.exports = function (api) {
    api.cache(true);
    return {
      presets: [
        'babel-preset-expo',
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-typescript'
      ],
      plugins: [
        // Add any plugins you need here
        ['module-resolver', {
          root: ['./'],
          alias: {
            '@': './',
          },
        }],
      ],
      env: {
        test: {
          presets: [
            ['@babel/preset-env', { targets: { node: 'current' } }],
            '@babel/preset-typescript'
          ],
        },
      },
    };
  };