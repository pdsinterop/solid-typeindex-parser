import SolidType from '../src/SolidType'

const sampleTypeClasses = [
  'http://www.w3.org/2002/01/bookmark#Bookmark',
  'http://www.w3.org/2002/01/bookmark#Topic'
]
const sampleInstances = [
  '/public/bookmarks.ttl',
  '/public/bookmarks2.ttl'
]
const sampleInstanceContainers = [
  '/public/bookmarks/',
  '/public/bookmarks2/'
]

const instance  = sampleInstances[0]
const instanceContainer  = sampleInstanceContainers[0]
const typeClass = sampleTypeClasses[0]

describe('constructor', () => {
  test('can create new instance SolidType', () => {
    const solidType = new SolidType(typeClass, instance)
    // FIXME: Add checks
  })
  test('can create new instanceContainer SolidType', () => {
    const solidType = new SolidType(typeClass, undefined, instanceContainer)
    // FIXME: Add checks
  })
})

describe('equals', () => {
  test('returns true for equal instance SolidTypes', () => {
    const options = {
      otherQuads: [],
    }
    const first = new SolidType(typeClass, instance)
    const second = new SolidType(typeClass, instance)
    expect(first.equals(second)).toBe(true)
    expect(second.equals(first)).toBe(true)
  })
  test('returns false if the instance is different', () => {
    const first = new SolidType(typeClass, instance)
    const second = new SolidType(typeClass, sampleInstances[1])
    expect(first.equals(second)).toBe(false)
  })
  test('returns false if the class is different', () => {
    const first = new SolidType(typeClass, instance)
    const second = new SolidType(sampleTypeClasses[1], instance)
    expect(first.equals(second)).toBe(false)
  })
  test('returns false if otherQuads are not equal', () => {
    const first = new SolidType(typeClass, instance, undefined, { otherQuads: [] })
    const second = new SolidType(typeClass, instance, undefined, { otherQuads: [{}] })
    expect(first.equals(second)).toBe(false)
  })
})

describe('clone', () => {
  test('clone returns a new SolidType instance with equal values', () => {
    const solidType = new SolidType(typeClass, instance, undefined, { otherQuads: ['test'] })
    const clone = solidType.clone()
    expect(solidType.equals(clone)).toBe(true)
    expect(solidType === clone).toBe(false)
    expect(solidType.otherQuads === clone.otherQuads).toBe(false)
  })
})

describe('equals', () => {
  test('returns true for equal instanceContainer SolidTypes', () => {
    const options = {
      otherQuads: [],
    }
    const first = new SolidType(typeClass, undefined, instanceContainer)
    const second = new SolidType(typeClass, undefined, instanceContainer)
    expect(first.equals(second)).toBe(true)
    expect(second.equals(first)).toBe(true)
  })
  test('returns false if the instance is different', () => {
    const first = new SolidType(typeClass, undefined, instanceContainer)
    const second = new SolidType(typeClass, undefined, sampleInstanceContainers[1])
    expect(first.equals(second)).toBe(false)
  })
  test('returns false if the class is different', () => {
    const first = new SolidType(typeClass, undefined, instanceContainer)
    const second = new SolidType(sampleTypeClasses[1], undefined, instanceContainer)
    expect(first.equals(second)).toBe(false)
  })
  test('returns false if otherQuads are not equal', () => {
    const first = new SolidType(typeClass, undefined, instanceContainer, { otherQuads: [] })
    const second = new SolidType(typeClass, undefined, instanceContainer, { otherQuads: [{}] })
    expect(first.equals(second)).toBe(false)
  })
})

describe('clone', () => {
  test('clone returns a new SolidType with equal values', () => {
    const solidType = new SolidType(typeClass, undefined, instanceContainer, { otherQuads: ['test'] })
    const clone = solidType.clone()
    expect(solidType.equals(clone)).toBe(true)
    expect(solidType === clone).toBe(false)
    expect(solidType.otherQuads === clone.otherQuads).toBe(false)
  })
})

