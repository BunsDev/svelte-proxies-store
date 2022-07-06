function noop() { }

const defaultHandler = {
  get: function (internal: any, property: any) {
    return Reflect.get(internal, property)
  }
}

type SubscriberType<T> = [(value: T) => void, () => void]

const subscriberQueue: SubscriberType<any>[] = []

interface ProxiedProps<T extends object = {}> {
  defaultObject?: T,
  handler?: typeof defaultHandler
}

function proxied<T extends object = {}>({ defaultObject, handler = defaultHandler }: ProxiedProps<T>) {
  let active = false

  const internal: T | {} = defaultObject || {}

  const proxy = new Proxy(internal, handler)

  const subscribers: SubscriberType<T>[] = []

  function get(property: PropertyKey) {
    return Reflect.get(internal, property)
  }

  function assign(object: T) {
    Object.assign(internal, object)
  }

  function deleteProperty(property: PropertyKey) {
    Reflect.deleteProperty(internal, property)
  }

  function deleteAll() {
    for (const property of Object.getOwnPropertyNames(internal)) {
      Reflect.deleteProperty(internal, property)
    }
  }

  function emit(object?: T) {
    if (object) assign(object)

    if (active) {
      // store is active
      const runQueue = !subscriberQueue.length

      for (let i = 0; i < subscribers.length; i += 1) {
        const s = subscribers[i]
        s[1]()
        subscriberQueue.push(s, proxy)
      }

      if (runQueue) {
        for (let i = 0; i < subscriberQueue.length; i += 2) {
          subscriberQueue[i][0](subscriberQueue[i + 1])
        }
        subscriberQueue.length = 0
      }
    }
  }

  function subscribe(run: (value: T) => void, invalidate = noop) {
    const subscriber = [run, invalidate] as SubscriberType<T>

    subscribers.push(subscriber)

    if (subscribers.length === 1) {
      active = true
    }

    run(proxy)

    return () => {
      const index = subscribers.indexOf(subscriber)
      if (index !== -1) {
        subscribers.splice(index, 1)
      }
      if (subscribers.length === 0) {
        active = false
      }
    }
  }

  return {
    get,
    assign,
    delete: deleteProperty,
    deleteAll,
    deleteProperty,
    emit,
    subscribe
  }
}

export { proxied }
