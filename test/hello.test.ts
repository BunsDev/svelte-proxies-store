import { proxied } from '../src/index'

test('Check if proxy property is assigned correctly', () => {
    const defaultObj = { name: "John", age: 12 }

    const testProxy = proxied<{ name: string, age: number }>({})

    testProxy.emit(defaultObj)

    expect(testProxy.get("name")).toBe(defaultObj.name);
});

test('Check if proxy works with key: value pairs', () => {

    const testProxy = proxied<{ [key: string]: string }>({})

    testProxy.subscribe((value) => {
        console.log(value)
    })

    testProxy.emit({ "a": "a" })
    testProxy.emit({ "b": "b" })

    expect(testProxy.get("a")).toBe("a");
});

test('Update key: value pairs using existing values', () => {

    const testProxy = proxied<{ [key: string]: string }>({})


    testProxy.emit({ "a": "a" })
    testProxy.emit({ "b": testProxy.get("a") + "b" })

    expect(testProxy.get("b")).toBe("ab");
});

test('Check if emit works correctly', () => {
    const defaultObj = { name: "John", age: 12 }

    const testProxy = proxied({ defaultObject: defaultObj })

    testProxy.subscribe((value) => {
        console.log(value)
    })

    testProxy.emit({
        name: "Rainmound",
        age: 1
    })

    expect(testProxy.get("name")).toBe("Rainmound");
});