import { Quad } from 'n3'
import { iterableEquals } from './utils'

/**
 * @module SolidType
 */

interface SolidTypeOptions {
  otherQuads?: Quad[]
}

class SolidType {
  public forClass: string
  public instance: string
  public otherQuads: Quad[]

  constructor (forClass: string, instance: string, options: SolidTypeOptions = {}) {
    this.forClass = forClass
    this.instance = instance
	this.otherQuads = options.otherQuads ? [...options.otherQuads] : []
  }

  clone () {
    const options = SolidType._getOptions(this)
    return new SolidType(this.forClass, this.instance, options)
  }

  equals (other: SolidType) {
    return other instanceof SolidType &&
      iterableEquals(this.otherQuads, other.otherQuads) &&
      this.forClass === other.forClass &&
      this.instance === other.instance
  }

  static _getOptions (solidType: SolidType) {
    const options: SolidTypeOptions = {}
    options.otherQuads = solidType.otherQuads

    return options
  }
}

export default SolidType
