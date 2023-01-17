# AsyncApiParser.js

 script for parsing JSON into [AsyncAPI](https://www.asyncapi.com/) model

Usage : ``Usage : node AsyncApiParser.js jsonString optionalMessageName'``

Example 1:
```js

const test = {
  "Monday": {
    "start": {},
    "cleaning": {},
    "stop": {
      "a": null,
      "b": undefined,
      "c": '',
      "d": {
        "e": true
      },
      "f": {
        "g": {"h": 123}
      },
      "i": [1, 2, 3],
      "j": ['1', '2', '3'],
      "k": [
        {prop1: 'a', prop2: 2, prop3: false},
        {prop1: 'b', prop2: 3, prop3: true}
      ],
      "l": [null, null],
      "m": [undefined, undefined],
      "n": [{}, {}],

    },
    "mode": "default"
  },
}
console.log(toAsyncApiModel(test))
```

```yaml

Message:
  name: Name
  title: Title
  summary: Message holds information about...
  contentType: application/json
  payload:
    type: object
    properties:
      Monday:
        type: object
        properties:
            start:
              type: object # Empty object
            cleaning:
              type: object # Empty object
            stop:
              type: object
              properties:
                  a:
                    type: unknown
                  b:
                    type: unknown
                  c:
                    type: string
                  d:
                    type: object
                    properties:
                        e:
                          type: boolean
                  f:
                    type: object
                    properties:
                        g:
                          type: object
                          properties:
                              h:
                                type: number
                  i:
                    type: array
                    items:
                      type: number
                  j:
                    type: array
                    items:
                      type: string
                  k:
                    type: array
                    items:
                      type: object
                          properties:
                            prop1:
                              type: string
                            prop2:
                              type: number
                            prop3:
                              type: boolean
                  l:
                    type: array
                    items:
                      type: object
                          properties:
                            unknown
                  m:
                    type: array
                    items:
                      type: unknown
                  n:
                    type: array
                    items:
                      type: object # Empty object
            mode:
              type: string

```

Example 2
``node AsyncApiParser.js '{"property1":false,"property2":false}' 'mqqt/path/message' ``

```yaml
MqqtPathMessage:
  name: MqqtPathMessage
  title: Mqqt Path Message
  summary: Message holds information about...
  contentType: application/json
  payload:
    type: object
    properties:
      property1:
        type: boolean
      property2:
        type: boolean
```
