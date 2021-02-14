import TypeIndexDoc from '../../src/TypeIndexDoc'
import SolidType from '../../src/SolidType'

/**
 * @typedef Sample
 * @property {string} description
 * @property {string} turtle
 * @property {string} typeIndexUrl
 * @property {function(): TypeIndexDoc} getTypeIndexDoc
 */

/** @type {Sample[]} */
const samples = [
  {
    description: 'Example public type index document',
    turtle: `
    @prefix : <#>.
    @prefix solid: <http://www.w3.org/ns/solid/terms#>.
    @prefix schem: <http://schema.org/>.
    @prefix terms: <http://purl.org/dc/terms/>.
    @prefix bookm: <http://www.w3.org/2002/01/bookmark#>.
    
    <>
        a solid:ListedDocument, solid:TypeIndex;
        terms:references :bookmarks.
    :bookmarks
        a solid:TypeRegistration;
        solid:forClass bookm:Bookmark;
        solid:instance </public/bookmarks.ttl>.
    `,
    typeIndexUrl: 'https://alice.databox.me/settings/publicTypeIndex.ttl',
    getTypeIndexDoc () {
      const doc = new TypeIndexDoc()
      doc.documentTypes.push('http://www.w3.org/ns/solid/terms#ListedDocument')
      doc.documentTypes.push('http://www.w3.org/ns/solid/terms#TypeIndex')
      doc.references.push(`${this.typeIndexUrl}#bookmarks`)

      const solidType = new SolidType('http://www.w3.org/2002/01/bookmark#Bookmark', '/public/bookmarks.ttl')
      doc.addType(solidType, { subjectId: `${this.typeIndexUrl}#bookmarks` })
      return doc
    }
  },
  {
    description: 'Example private type index document',
    turtle: `
    @prefix : <#>.
    @prefix solid: <http://www.w3.org/ns/solid/terms#>.
    @prefix schem: <http://schema.org/>.
    @prefix terms: <http://purl.org/dc/terms/>.
    @prefix bookm: <http://www.w3.org/2002/01/bookmark#>.
    
    <>
        a solid:UnlistedDocument, solid:TypeIndex;
        terms:references :private.
    :private
        a solid:TypeRegistration;
        solid:forClass bookm:Bookmark;
        solid:instance </private/bookmarks.ttl>.
    `,
    typeIndexUrl: 'https://alice.databox.me/settings/privateTypeIndex.ttl',
    getTypeIndexDoc () {
      const doc = new TypeIndexDoc()
      doc.documentTypes.push('http://www.w3.org/ns/solid/terms#UnlistedDocument')
      doc.documentTypes.push('http://www.w3.org/ns/solid/terms#TypeIndex')
      doc.references.push(`${this.typeIndexUrl}#private`)

      const solidType = new SolidType('http://www.w3.org/2002/01/bookmark#Bookmark', '/private/bookmarks.ttl')
      doc.addType(solidType, { subjectId: `${this.typeIndexUrl}#private` })
      return doc
    }
  }
]

export default samples
