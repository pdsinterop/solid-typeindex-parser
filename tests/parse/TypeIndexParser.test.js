import TypeIndexParser from '../../src/TypeIndexParser'
import samples from './samples'

describe('turtle -> TypeIndexDoc', () => {
  for (const sample of samples) {
    test(sample.description, async () => {
      const { typeIndexUrl, turtle } = sample
      const parser = new TypeIndexParser({ typeIndexUrl })
      const parsedDoc = await parser.turtleToTypeIndexDoc(turtle)
      const expectedDoc = sample.getTypeIndexDoc()

      expect(parsedDoc).toEqual(expectedDoc)
    })
  }
})

describe('TypeIndexDoc -> turtle -> TypeIndexDoc', () => {
  for (const sample of samples) {
    test(sample.description, async () => {
      const { typeIndexUrl } = sample
      const parser = new TypeIndexParser({ typeIndexUrl })
      const expectedDoc = sample.getTypeIndexDoc()
      const parsedTurtle = await parser.typeIndexDocToTurtle(expectedDoc)
      const parsedDoc = await parser.turtleToTypeIndexDoc(parsedTurtle)

      expect(parsedDoc).toEqual(expectedDoc)
    })
  }
})