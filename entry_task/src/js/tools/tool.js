export default {
  throttle (fn, waitTime) {
    let flag

    return function () {
      if (flag) return
      flag = true

      const timer = setTimeout(() => {
        fn()
        clearTimeout(timer)
        flag = false
      }, waitTime * 1000)
    }
  },
  getScrollTop () {
    return window.scrollY || document.body.scrollTop
  },
  formatDate (date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    return `${this.$addZero(year, 2)}/${this.$addZero(month, 2)}/${this.$addZero(day, 2)}`
  },
  $addZero (v, size) {
    for (let i = 0, len = size - (v + '').length; i < len; i++) {
      v = '0' + v
    };
    return v + ''
  }
}
