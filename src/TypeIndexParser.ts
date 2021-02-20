import * as N3 from 'n3'
import TypeIndexDoc from './TypeIndexDoc'
import prefixes from './prefixes'
import SolidType from './SolidType'
import { parseTurtle, makeRelativeIfPossible } from './utils'

/**
 * @module TypeIndexParser
 */

interface TypeIndexParserOptions {
  typeIndexUrl: string
}

const predicates = {
  forClass: `${prefixes.solid}forClass`,
  instance: `${prefixes.solid}instance`,
  instanceContainer: `${prefixes.solid}instanceContainer`,
  references: `${prefixes.terms}references`,
  type: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'
}

const types = {
  typeRegistration: `${prefixes.solid}TypeRegistration`,
  typeIndex: `${prefixes.solid}TypeIndex`,
  listedDocument: `${prefixes.solid}ListedDocument`,
  unlistedDocument: `${prefixes.solid}UnlistedDocument`
}

class TypeIndexParser {
  private readonly parser: N3.N3Parser
  private readonly typeIndexUrl: string

  constructor ({ typeIndexUrl }: TypeIndexParserOptions) {
    this.parser = new N3.Parser({ baseIRI: typeIndexUrl })
    this.typeIndexUrl = typeIndexUrl
  }

  async turtleToTypeIndexDoc (typeIndexTurtle: string) {
    const data = await parseTurtle(this.parser, typeIndexTurtle)
    const doc = new TypeIndexDoc()

    for (const [subjectId, quads] of Object.entries(data)) {
      if (this._isSolidType(quads)) {
        const SolidType = this._quadsToSolidType(quads)
        doc.addType(SolidType, { subjectId })
      } else {
        for (const quad of quads) {
          this._addDocProperty(doc, quad)
        }
      }
    }

    return doc
  }

  _addDocProperty(doc: TypeIndexDoc, quad: N3.Quad) {
    const { predicate, object: { value } } = quad

    switch (predicate.id) {
      case predicates.type:
        doc.documentTypes.push(value)
        break
      case predicates.references:
        doc.references.push(value)
        break
      default:
        doc.addOther(quad)
        break
    }
  }

  _quadsToSolidType (quads: N3.Quad[]) {
	  // FIXME: class and instance should be read from the quads;
    const solidType = new SolidType("")

    for (const quad of quads) {
      if (Object.values(predicates).includes(quad.predicate.id)) {
        this._addQuadToSolidType(solidType, quad)
      } else {
        solidType.otherQuads.push(quad)
      }
    }
    return solidType
  }

  _isSolidType (quads: N3.Quad[]) {
    const requiredPredicates = [
      [predicates.forClass],
      [predicates.instance, predicates.instanceContainer]
    ]
    return requiredPredicates.every(p => quads.some(({ predicate }) => p.includes(predicate.id)))
  }

  _addQuadToSolidType (solidType: SolidType, quad: N3.Quad) {
    const { predicate, object: { value } } = quad

    switch (predicate.id) {
      case predicates.forClass:
    		solidType.forClass = value
        break

      case predicates.instance:
        solidType.instance = makeRelativeIfPossible(this.typeIndexUrl, value)
        break

      case predicates.instanceContainer:
        solidType.instanceContainer = makeRelativeIfPossible(this.typeIndexUrl, value)
        break

      case predicates.type:
        // intentionally left blank.
        break;

      default:
        throw new Error('Unexpected predicate: ' + predicate.id)
    }
  }

  typeIndexDocToTurtle (doc: TypeIndexDoc): Promise<string> {
    const writer = new N3.Writer({ prefixes })
    const { DataFactory: { quad, namedNode } } = N3

    /** @type {N3.Quad[]} */
    const quads = []
    for (const [subjectId, solidType] of Object.entries(doc.solidTypes)) {
      const solidTypeQuads = this._solidTypeToQuads(subjectId, solidType)
      quads.push(...solidTypeQuads)
    }

    for (const documentType of doc.documentTypes) {
      quads.push(quad(
        namedNode(this.typeIndexUrl),
        namedNode(predicates.type),
        namedNode(documentType)
      ))
    }

    for (const reference of doc.references) {
      quads.push(quad(
        namedNode(this.typeIndexUrl),
        namedNode(predicates.references),
        namedNode(reference)
      ))
    }

    quads.push(...doc.otherQuads)
    writer.addQuads(quads)

    return new Promise<string>((resolve, reject) => {
      writer.end((error, result) => {
        if (error) {
          return reject(error)
        }
        return resolve(result)
      })
    })
  }

  _solidTypeToQuads (subjectId: string, solidType: SolidType) {
    const { DataFactory: { quad, namedNode } } = N3
    const quads = []
    const relative = (url: string) => makeRelativeIfPossible(this.typeIndexUrl, url)

    quads.push(quad(
      namedNode(subjectId),
      namedNode(predicates.type),
      namedNode(types.typeRegistration)
    ))

    // class
    if (solidType.forClass) {
      quads.push(quad(
        namedNode(subjectId),
        namedNode(predicates.forClass),
        namedNode(relative(solidType.forClass))
      ))
    }

    // instance
    if (solidType.instance) {
      quads.push(quad(
        namedNode(subjectId),
        namedNode(predicates.instance),
        namedNode(relative(solidType.instance))
      ))
    }
  
    // instanceContainer
    if (solidType.instanceContainer) {
      quads.push(quad(
        namedNode(subjectId),
        namedNode(predicates.instanceContainer),
        namedNode(relative(solidType.instanceContainer))
      ))
    }
    quads.push(...solidType.otherQuads)

    return quads
  }
}

export default TypeIndexParser
