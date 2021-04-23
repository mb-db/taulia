export default class Logger {
  constructor(debugMode, additionalErrorHandling = null) {
    this.debugMode = debugMode;
    this.additionalErrorHandling = additionalErrorHandling;
  }

  debug(...rest) {
    return this.debugMode && console.debug(...rest); // eslint-disable-line no-console
  }

  log(...rest) {
    return this.debugMode && console.log(...rest); // eslint-disable-line no-console
  }

  info(...rest) {
    return this.debugMode && console.info(...rest); // eslint-disable-line no-console
  }

  warn(...rest) {
    return this.debugMode && console.warn(...rest); // eslint-disable-line no-console
  }

  error(...rest) {
    console.error(...rest); // eslint-disable-line no-console

    return (
      this.additionalErrorHandling && this.additionalErrorHandling(...rest)
    );
  }
}
