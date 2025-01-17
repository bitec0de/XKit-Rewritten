import { keyToCss } from '../../util/css_map.js';
import { buildStyle } from '../../util/interface.js';

const styleElement = buildStyle(`
${keyToCss('tags')}${keyToCss('collapsed')} {
  max-height: none;
}
${keyToCss('seeAll')} {
  display: none;
}
`);

export const main = async function () {
  document.head.append(styleElement);
};

export const clean = async function () {
  styleElement.remove();
};
