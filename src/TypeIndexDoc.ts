import SolidType from './SolidType'
import { iterableEquals } from './utils'
import { Quad } from 'n3'

/**
 * @module TypeIndexDoc
 */

interface AddSolidTypeOptions {
  subjectId?: string
}

/**
 * @description Class for storing information of a type index file
 * @alias module:TypeIndexDoc
 */
class TypeIndexDoc {
  public solidTypes: Record<string, SolidType>
  public otherQuads: Quad[]
  public documentTypes: string[]
  public references: string[]

  constructor () {
    this.solidTypes = {}
    this.otherQuads = []
    this.documentTypes = []
    this.references = []
  }

  /**
   * @description Adds a new type.
   * If subjectId is specified and already exits the old one will be overwritten
   * @param {AddSolidTypeOptions} [options]
   * @returns {this}
   * @example
   * const solidType = new SolidType("http://www.w3.org/2002/01/bookmark#Bookmark", "/public/bookmarks.ttl")
   * doc.addType(solidType)
   */
  addType (firstVal: SolidType, { subjectId }: AddSolidTypeOptions = {}) {
    const solidType = firstVal
    subjectId = this._normalizedSubectId(subjectId || this._getNewSubjectId(solidType))
    this.solidTypes[subjectId] = solidType

    return this
  }

  hasType (solidType: SolidType) {
    return Object.values(this.solidTypes)
      .some(existingType => {
		return existingType.equals(solidType)
      })
  }

  /**
   * @description Get the type with this subject id
   */
  getTypeBySubjectId (subjectId: string): SolidType|undefined {
    return this.solidTypes[this._normalizedSubectId(subjectId)]
  }

  deleteType (solidType: SolidType) {
    const toDelete = solidType

    for (const subjectId of Object.keys(this.solidTypes)) {
      this.deleteBySubjectId(subjectId)
    }

    return this
  }

  deleteBySubjectId (subjectId: string) {
    if (this.solidTypes.hasOwnProperty(subjectId)) {
		delete this.solidTypes[subjectId]
    }

    return this
  }

  /**
   * @description add data which isn't an access restriction
   */
  addOther (...other: Quad[]) {
    this.otherQuads.push(...other)
    return this
  }

  equals (other: TypeIndexDoc) {
    return iterableEquals(this.otherQuads, other.otherQuads) &&
      Object.entries(this.solidTypes)
        .every(([subjectId, solidType]) => {
          const otherRule = other.getTypeBySubjectId(subjectId)
          return typeof otherRule !== 'undefined' && solidType.equals(otherRule)
        })
  }

  /**
   * @description Get an unused subject id
   * @param {string} [base] - The newly generated id will begin with this base id
   */
  _getNewSubjectId (solidType: SolidType, base = this._defaultSubjectIdForType(solidType)) {
    const digitMatches = base.match(/[\d]*$/) || ['0']
    let index = Number(digitMatches[0]) // Last positive number; 0 if not ending with number
    base = base.replace(/[\d]*$/, '')

    while (this._containsSubjectId(base + index)) {
      index++
    }
    return base + index
  }

  _containsSubjectId (subjectId: string) {
    return this.solidTypes.hasOwnProperty(this._normalizedSubectId(subjectId))
  }

  _normalizedSubectId (subjectId: string) {
    return subjectId.includes('#') ? subjectId.substr(subjectId.lastIndexOf('#')) : subjectId
  }

  _defaultSubjectIdForType (solidType: SolidType) {
    let id = '#'
    if (solidType.forClass) { id += solidType.forClass.split("#")[1] }
    return id + '-'
  }
}

export default TypeIndexDoc
