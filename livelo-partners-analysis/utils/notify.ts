const notifier = require('node-notifier')

const notifySystem = (title: string, message: string) => notifier.notify({
  title: title,
  message: message,
  sound: false,
  wait: false
});

export default notifySystem
