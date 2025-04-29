const promptElement = document.querySelector('#prompt');

if (promptElement === null)
  throw new Error('Could not find element with id #prompt');

const generateButton = document.querySelector('#generate-prompt');

if (generateButton === null) throw new Error('Could not find generate button');

const elementCell = document.querySelector('#element-name');

if (elementCell === null) throw new Error('Could not find element cell');
const attributeCell = document.querySelector('#attribute-name');

if (attributeCell === null) throw new Error('Could not find attribute cell');

const cssCell = document.querySelector('#css-name');

if (cssCell === null) throw new Error('Could not find css cell');

function filterElements(elObj) {
  return Object.fromEntries(
    Object.entries(elObj).filter(
      ([_, elProps]) => !elProps.deprecated && !elProps.experimental
    )
  );
}

function filterAttributes(attrObj) {
  return Object.entries(attrObj)
    .filter(
      ([_, attrProps]) => !attrProps.deprecated && !attrProps.experimental
    )
    .map(([name]) => name);
}

async function main() {
  const htmlResponse = await fetch('./html-elements.json');

  const cssResponse = await fetch('./css-properties.json');

  const htmlData = await htmlResponse.json();

  const cssProperties = await cssResponse.json();

  const htmlElementData = filterElements(htmlData);

  const globalAttributes = filterAttributes(htmlElementData['*'].attributes);

  const elementNames = Object.keys(htmlElementData).filter(
    (name) => name !== '*'
  );

  function generatePrompt() {
    const elementName =
      elementNames[Math.floor(Math.random() * elementNames.length)];

    const localAttributes = filterAttributes(htmlData[elementName].attributes);

    const allAttributes = globalAttributes.concat(localAttributes);

    const attributeName =
      allAttributes[Math.floor(Math.random() * allAttributes.length)];

    const cssPropName =
      cssProperties[Math.floor(Math.random() * cssProperties.length)];

    elementCell.textContent = elementName;
    attributeCell.textContent = attributeName;
    cssCell.textContent = cssPropName;
  }

  generateButton.addEventListener('click', () => {
    try {
      generatePrompt();
    } catch {
      generatePrompt();
    }
  });
}

main();
