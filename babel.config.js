module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // Cette ligne active la syntaxe des décorateurs.
    // L'option { legacy: true } est requise par WatermelonDB.
    ['@babel/plugin-proposal-decorators', {legacy: true}],
  ],
};
