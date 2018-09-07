import { on, fire } from 'delegated-events'

import Data from './dom/data'
import SelectorEngine from './dom/selectorEngine'
import Util from './util'

/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.1.3): alert.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const Alert = (() => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME                = 'alert'
  const VERSION             = '4.1.3'
  const DATA_KEY            = 'bs.alert'
  const EVENT_KEY           = `.${DATA_KEY}`

  const Selector = {
    DISMISS : '[data-dismiss="alert"]'
  }

  const InternalEvent = {
    CLICK_DATA_API : 'click'
  }

  const Event = {
    CLOSE          : `close${EVENT_KEY}`,
    CLOSED         : `closed${EVENT_KEY}`
  }

  const ClassName = {
    ALERT : 'alert',
    FADE  : 'fade',
    SHOW  : 'show'
  }

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Alert {
    constructor(element) {
      this._element = element
      if (this._element) {
        Data.setData(element, DATA_KEY, this)
      }
    }

    // Getters

    static get VERSION() {
      return VERSION
    }

    // Public

    close(element) {
      let rootElement = this._element
      if (element) {
        rootElement = this._getRootElement(element)
      }

      const customEvent = this._triggerCloseEvent(rootElement)

      if (!customEvent) {
        return
      }

      this._removeElement(rootElement)
    }

    dispose() {
      Data.removeData(this._element, DATA_KEY)
      this._element = null
    }

    // Private

    _getRootElement(element) {
      const selector = Util.getSelectorFromElement(element)
      let parent     = false

      if (selector) {
        parent = SelectorEngine.findOne(selector)
      }

      if (!parent) {
        parent = SelectorEngine.closest(element, `.${ClassName.ALERT}`)
      }

      return parent
    }

    _triggerCloseEvent(element) {
      return fire(element, Event.CLOSE)
    }

    _removeElement(element) {
      element.classList.remove(ClassName.SHOW)

      if (!element.classList.contains(ClassName.FADE)) {
        this._destroyElement(element)
        return
      }

      const transitionDuration = Util.getTransitionDurationFromElement(element)

      const onTransitionEnd = (event) => {
        this._destroyElement(element, event)
        element.removeEventListener(Util.TRANSITION_END, onTransitionEnd)
      }

      element.addEventListener(Util.TRANSITION_END, onTransitionEnd)
      Util.emulateTransitionEnd(element, transitionDuration)
    }

    _destroyElement(element) {
      if (element.parentNode) {
        element.parentNode.removeChild(element)
      }

      fire(element, Event.CLOSED)
    }

    // Static

    static _jQueryInterface(config) {
      return this.each(function () {
        let data = Data.getData(this, DATA_KEY)

        if (!data) {
          data = new Alert(this)
        }

        if (config === 'close') {
          data[config](this)
        }
      })
    }

    static _handleDismiss(alertInstance) {
      return function (event) {
        if (event) {
          event.preventDefault()
        }

        alertInstance.close(this)
      }
    }

    static _getInstance(element) {
      return Data.getData(element, DATA_KEY)
    }
  }

  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */
  on(InternalEvent.CLICK_DATA_API, Selector.DISMISS, Alert._handleDismiss(new Alert()))

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   * add .alert to jQuery only if jQuery is present
   */

  const $ = Util.jQuery
  if (typeof $ !== 'undefined') {
    const JQUERY_NO_CONFLICT  = $.fn[NAME]
    $.fn[NAME]                = Alert._jQueryInterface
    $.fn[NAME].Constructor    = Alert
    $.fn[NAME].noConflict     = () => {
      $.fn[NAME] = JQUERY_NO_CONFLICT
      return Alert._jQueryInterface
    }
  }

  return Alert
})()

export default Alert
