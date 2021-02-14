import TypeIndexDoc from '../src/TypeIndexDoc'
import SolidType from '../src/SolidType'

const sampleTypeClasses = [
  'http://www.w3.org/2002/01/bookmark#Bookmark',
  'http://www.w3.org/2002/01/bookmark#Topic'
]

const sampleInstances = [
  '/public/bookmarks.ttl',
  '/public/bookmarks2.ttl'
]

const sampleTypes = [
  new SolidType(sampleTypeClasses[0], sampleInstances[0]),
  new SolidType(sampleTypeClasses[0], sampleInstances[1]),
  new SolidType(sampleTypeClasses[1], sampleInstances[0])
]

const instance  = sampleInstances[0]
const typeClass = sampleTypeClasses[0]
const sampleType = sampleTypes[0]

/** @type {TypeIndexDoc} */
let doc

beforeEach(() => { doc = new TypeIndexDoc() })

describe('addType', () => {
  test('can add type by passing SolidType instance', () => {
    doc.addType(sampleTypes[0])
    doc.addType(sampleTypes[1], { subjectId: '#my-id' })
    expect(doc.hasType(sampleTypes[0])).toBe(true)
    expect(doc.hasType(sampleTypes[1])).toBe(true)
  })
  test('overwrites existing subjectId if specified', () => {
    doc.addType(sampleTypes[0], { subjectId: '#my-id' })
    doc.addType(sampleTypes[1], { subjectId: '#my-id' })
    expect(doc.hasType(sampleTypes[0])).toBe(false)
    expect(doc.hasType(sampleTypes[1])).toBe(true)
  })
})

describe('hasType', () => {
  test('returns true if the same type has been added', () => {
    doc.addType(sampleTypes[0])
    expect(doc.hasType(sampleTypes[0])).toBe(true)
  })
})

describe('getTypeBySubjectId', () => {
  test('returns type with this id if existing', () => {
    doc.addType(sampleType, { subjectId: '#my-id' })
    expect(doc.getTypeBySubjectId('#my-id').equals(sampleType)).toBe(true)
  })
  test('returns undefined if no type with that id exists', () => {
    expect(doc.getTypeBySubjectId('#inexistent')).toBe(undefined)
  })
})

describe('deleteBySubjectId', () => {
  test('deletes completely if no type is specified', () => {
    doc.addType(sampleTypes[0], { subjectId: '#my-id' })
    doc.deleteBySubjectId('#my-id')
    expect(Object.keys(doc.solidTypes)).toHaveLength(0)
  })
  test('deletes completely if clone of type is passed', () => {
    doc.addType(sampleTypes[0], { subjectId: '#my-id' })
    doc.deleteBySubjectId('#my-id', sampleTypes[0].clone())
    expect(Object.keys(doc.solidTypes)).toHaveLength(0)
  })
  test('does not modify doc if not found', () => {
    doc.addType(sampleTypes[0], { subjectId: '#my-id' })
    doc.deleteBySubjectId('#not-my-id')
    expect(doc.hasType(sampleTypes[0])).toBe(true)
  })
})

describe('deleteType', () => {
  test('deletes type from the doc', () => {
    doc.addType(sampleTypes[0])
    doc.deleteType(sampleTypes[0])
    expect(doc.hasType(sampleTypes[0])).toBe(false)
  })
})

describe('equals', () => {
  test('returns true for docs which have been added the same rules', () => {
    const otherDoc = new TypeIndexDoc()
    doc.addType(sampleTypes[0])
      .addType(sampleTypes[1])
    otherDoc.addType(sampleTypes[0])
      .addType(sampleTypes[1])

    expect(doc.equals(otherDoc)).toBe(true)
  })
  test('returns false for docs which have been added different rules', () => {
    const otherDoc = new TypeIndexDoc()
    doc.addType(sampleTypes[0])
      .addType(sampleTypes[1])
    otherDoc.addType(sampleTypes[2])

    expect(doc.equals(otherDoc)).toBe(false)
  })
  test('returns false if otherQuads are not the same', () => {
    const otherDoc = new TypeIndexDoc()
    doc.addOther('test')
    expect(doc.equals(otherDoc)).toBe(false)
  })
})

describe('addOther', () => {
  test('adds quad to otherQuads', () => {
    const quads = [1, 2, 3, 4]
    doc.addOther(...quads)
    expect(doc.otherQuads).toEqual(quads)
  })
})

describe('chainable methods', () => {
  test('can chain methods which support it', () => {
    doc.addType(sampleTypes[0], { subjectId: '#public' })
      .deleteBySubjectId('#public')
    expect(Object.keys(doc.solidTypes)).toHaveLength(0)
  })
})

