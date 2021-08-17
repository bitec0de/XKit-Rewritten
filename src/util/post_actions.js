import { getIconPath } from './control_buttons.js';
import { onGlassContainerMutated } from './mutations.js';
import { keyToCss } from './css_map.js';

const glassSelector = '[role="dialog"][aria-modal="true"]';

const excludeClass = 'xkit-post-actions-done';

const fakePostActions = Object.assign(document.createElement('div'), { className: 'xkit-post-actions' });
const postOptions = {};

/**
 * Create and register a button to add to the new post form
 *
 * @param {string} id - Unique identifier for this post option
 * @param {object} options - Construction options for this post option
 * @param {string} options.iconClass - RemixIcon class to construct the button with
 * @param {Function} options.onclick - Click handler function for this button
 */
export const registerPostOption = async function (id, { iconClass, onclick }) {
  const postOptionLabel = Object.assign(document.createElement('label'), { className: 'xkit-post-option' });
  const postOptionButton = document.createElement('button');

  postOptionButton.addEventListener('click', onclick);
  postOptionLabel.appendChild(postOptionButton);

  const postOptionSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const postOptionPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');

  postOptionSvg.setAttribute('viewBox', '0 0 25 25');
  postOptionSvg.setAttribute('width', '24');
  postOptionSvg.setAttribute('height', '24');
  postOptionButton.appendChild(postOptionSvg);

  const iconPath = await getIconPath(iconClass);
  postOptionPath.setAttribute('d', iconPath);
  postOptionSvg.appendChild(postOptionPath);

  postOptions[id] = postOptionLabel;

  $(`.${excludeClass}`).removeClass(excludeClass);
  onGlassContainerMutated.trigger();
};

export const unregisterPostAction = id => {
  postOptions[id].parentNode?.removeChild(postOptions[id]);
  delete postOptions[id];
};

(async () => {
  const postActionsSelector = await keyToCss('postActions');
  const postFormButtonSelector = await keyToCss('postFormButton');

  onGlassContainerMutated.addListener(() => {
    const glass = document.querySelector(glassSelector);

    const postFormButton = glass?.querySelector(postFormButtonSelector);
    if (!postFormButton || postFormButton.classList.contains(excludeClass)) { return; }
    postFormButton.classList.add(excludeClass);

    const postActions = glass.querySelector(postActionsSelector);
    if (!postActions) {
      fakePostActions.textContent = '';
      postFormButton.parentNode.insertBefore(fakePostActions, postFormButton);
    }

    Object.keys(postOptions).sort().reverse().forEach(id => {
      const postOption = postOptions[id];
      const target = postActions || fakePostActions;
      if (!target.contains(postOption)) { target.prepend(postOption); }
    });
  });
})();
