function parseToAsyncApiModel(obj, lvl = 0) {
  let objString = '';
  const s = '  '.repeat(lvl)

  if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean') {
    return (objString + `${s}${typeof obj}`);
  }
  if (typeof obj === 'undefined' || obj == null) {
    return (objString + `${s}unknown`);
  }

  let lastKey = Object.keys(obj).pop();

  for (const key in obj) {
    const value = obj[key];

    if (Array.isArray(value)) {
      const head = Array.from(value)[0];
      if (typeof head == 'object') {
        objString += `${s}${key}:\n${s}  type: array\n${s}  items:\n${s}    type: object\n${s}        properties:\n${parseToAsyncApiModel(head, lvl + 5)}`;
      } else {
        objString += `${s}${key}:\n${s}  type: array\n${s}  items:\n${s}    type: ${parseToAsyncApiModel(head, 0)}`;
      }
    } else if (typeof value === 'object' && !!value) {
      const isEmptyObject = (Object.keys(value).length === 0)
      objString += `${s}${key}:\n${s}  type: object`;
      objString += (!isEmptyObject) ? `\n${s}  properties:\n${parseToAsyncApiModel(value, lvl + 3)}`
                                    : ` # Empty object`
    } else {
      objString += `${s}${key}:\n${s}  type: ${parseToAsyncApiModel(value, 0)}`;
    }

    if (key !== lastKey) {
      objString += '\n';
    }
  }
  return objString;
}

function toAsyncApiModel(obj, lvl, topic = null) {
  const camelize = (str) => {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  }

  let messageTitle = 'Message';
  let name = 'Name';
  let title = 'Title';
  if (!!topic) {
    messageTitle = topic.split(/[/_]/i).filter(f => !!f && f.length > 0)
      .map(f => camelize(f)).map(f => f[0].toUpperCase() + f.substring(1)).join("");
    name = messageTitle;
    title = messageTitle.replace(/([a-z])([A-Z])/g, '$1 $2');
  }
  const s = '  '.repeat(lvl)
  return `${s}${messageTitle}:\n${s}  name: ${name}\n${s}  title: ${title}\n` +
    `${s}  summary: Message holds information about...\n${s}  contentType: application/json\n` +
    `${s}  payload:\n${s}    type: object\n${s}    properties:\n${s}` + parseToAsyncApiModel(obj, lvl + 3);
}


const args = process.argv;
try {
  if (args.length > 2) {
    console.log(`Input args: `, args.slice(2));
    console.log(toAsyncApiModel(JSON.parse(args[2]), 0, args[3]))
  } else {
    throw new Error('Incorrect number of input args')
  }
} catch (ex) {
  console.warn(`Usage : node AsyncAPIUtils.js jsonString optionalMessageName`)
  console.warn(`Ex    : node AsyncAPIUtils.js '{"PortalGesperrt":false,"PortalIstOben":false}'`)
  console.warn(`Ex    : node AsyncAPIUtils.js '{"PortalGesperrt":false,"PortalIstOben":false}' 'ProxyTrayMotionInnerState'\n`)
  console.error(ex)
}
