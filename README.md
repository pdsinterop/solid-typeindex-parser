# Solid Type Index Parser

A js library for working with typeindex files. It allows you to parse the turtle representation, update entries and finally convert it back to turtle. *It does not cover fetching typeindex files.*

## Basic example
This example demonstrates how to parse a turtle string into an TypeIndexDoc object, then add a type entry and parse it back to turtle.

```javascript
const SolidTypeIndexParser = require('SolicTypeIndexParser')

const webId = 'https://pod.example.org/profile/card#me'
const typeIndexUrl = 'https://pod.example.org/settings/privateTypesIndex.ttl'
const turtle = `
@prefix : <#>.
@prefix solid: <http://www.w3.org/ns/solid/terms#>.
@prefix schem: <http://schema.org/>.
@prefix terms: <http://purl.org/dc/terms/>.

<> a solid:ListedDocument, solid:TypeIndex.`

const { TypeIndexParser } = SolidTypeIndexParser

async function main() {
  // Parse the turtle to an TypeIndexDoc object which we can modify
  const parser = new TypeIndexParser({ typeIndexUrl })
  const doc = await parser.turtleToTypeIndexDoc(turtle)

  // Give the type to the type index
  const type = {
      name : "poddit",
      class : "<http://www.w3.org/2002/01/bookmark#Bookmark>",
      instance : "</public/poddit.ttl>"
  }
  doc.addType(type)

  // Parse it back to turtle so we can store it in the pod
  const newTurtle = await parser.typeIndexDocToTurtle(doc)
  console.log(newTurtle)
}
main()
```

Output turtle
```text/turtle
@prefix : <#>.
@prefix solid: <http://www.w3.org/ns/solid/terms#>.
@prefix schem: <http://schema.org/>.
@prefix terms: <http://purl.org/dc/terms/>.

<>
    a solid:ListedDocument, solid:TypeIndex;
    terms:references :poddit.

:poddit
    a solid:TypeRegistration;
    solid:forClass <http://www.w3.org/2002/01/bookmark#Bookmark>;
    solid:instance </public/poddit.ttl>.
```
