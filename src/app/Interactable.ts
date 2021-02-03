// Needed for all mixins
type Constructor<T = {}> = new (...args: any[]) => T

type key = {
  /** https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values */
  value: string,
  onPress?: () => void,
  onRelease?: () => void,
  _keyDownListener: (event: KeyboardEvent) => void,
  _keyUpListener: (event: KeyboardEvent) => void,
  unsubscribe: VoidFunction
}

/**
 * Makes a Game Object interatable (keyboard/mouse events)
 */
export function Interactable<T extends Constructor>(Base: T) {
  return class extends Base {
    // store the key instances
    private keyMap: Map<string, key>

    constructor(...args: any[]) {
      super(...args)
    }

    /**
     * retrieve the states of an keyboard key
     * @mixes Interactable
     * @param value [keyvalues](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values)
     */
    protected key(value: string): key {
      if (!this.keyMap)
        this.keyMap = new Map()

      if (!this.keyMap.has(value)) {
        const key: key = {
          value,
          unsubscribe: () => { },
          _keyUpListener: () => { },
          _keyDownListener: () => { },
        }
        const downHandler = function (event: KeyboardEvent) {
          if (event.key === key.value) {
            if (this.onPress) this.onPress()
            event.preventDefault()
          }
        }
        const upHandler = function (event: KeyboardEvent) {
          if (event.key === key.value) {
            if (this.onRelease) this.onRelease()
            event.preventDefault()
          }
        }
        key._keyUpListener = upHandler.bind(key)
        key._keyDownListener = downHandler.bind(key)

        key.unsubscribe = () => {
          if (key.onRelease) key.onRelease()
          this.keyMap.delete(key.value)
          window.removeEventListener('keydown', key._keyDownListener)
          window.removeEventListener('keyup', key._keyUpListener)
        }

        window.addEventListener('keydown', key._keyDownListener, false)
        window.addEventListener('keyup', key._keyUpListener, false)

        this.keyMap.set(value, key)

        return key
      }
      else {
        return this.keyMap.get(value)
      }
    }
  }
}