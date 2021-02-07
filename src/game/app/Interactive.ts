/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
type Constructor<T = {}> = new (...args: any[]) => T

export type key = {
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
export function Interactive<T extends Constructor>(Base: T): T {
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
    protected onKey(value: string): key {
      if (!this.keyMap)
        this.keyMap = new Map()

      if (!this.keyMap.has(value)) {
        const k: key = {
          value,
          unsubscribe: void Function,
          _keyUpListener: void Function,
          _keyDownListener: void Function,
        }
        const downHandler = function (event: KeyboardEvent) {
          if (event.key === k.value) {
            if (this.onPress) this.onPress()
            event.preventDefault()
          }
        }
        const upHandler = function (event: KeyboardEvent) {
          if (event.key === k.value) {
            if (this.onRelease) this.onRelease()
            event.preventDefault()
          }
        }
        k._keyUpListener = upHandler.bind(k)
        k._keyDownListener = downHandler.bind(k)

        k.unsubscribe = () => {
          if (k.onRelease) k.onRelease()
          this.keyMap.delete(k.value)
          window.removeEventListener('keydown', k._keyDownListener)
          window.removeEventListener('keyup', k._keyUpListener)
        }

        window.addEventListener('keydown', k._keyDownListener, false)
        window.addEventListener('keyup', k._keyUpListener, false)

        this.keyMap.set(value, k)

        return k
      }
      else {
        return this.keyMap.get(value)
      }
    }
  }
}