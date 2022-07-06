import { proxied } from '../src/index'

test('Check if proxy property is assigned correctly', () => {
    const defaultObj = { name: "John", age: 12 }

    const testProxy = proxied<{ name: string, age: number }>({})

    testProxy.emit(defaultObj)

    expect(testProxy.get("name")).toBe(defaultObj.name);
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