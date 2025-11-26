// fallback shim if any left-over import exists
declare module 'react-native-worklets/plugin' {
  const plugin: any;
  export = plugin;
}