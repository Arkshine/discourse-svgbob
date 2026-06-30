import { apiInitializer } from "discourse/lib/api";
import SvgbobEditor from "../components/modal/svgbob-editor";
import SvgbobInline from "../components/svgbob-inline";
import svgbobExtension from "../lib/rich-editor-extension";

const SAMPLE = "*-------------*\n| hello world |\n*-------------*";

function renderSvgbob(element, helper) {
  element.querySelectorAll("pre[data-code-wrap=svgbob]").forEach((pre) => {
    const content = pre.querySelector("code")?.innerText;
    if (!content) {
      return;
    }

    const wrapper = document.createElement("div");
    wrapper.classList.add("svgbob-wrapper");
    helper.renderGlimmer(wrapper, SvgbobInline, { content });
    pre.replaceWith(wrapper);
  });
}

export default apiInitializer((api) => {
  api.registerRichEditorExtension(svgbobExtension);

  const modal = api.container.lookup("service:modal");

  api.addComposerToolbarPopupMenuOption({
    icon: "diagram-project",
    label: themePrefix("insert_svgbob_sample"),
    action: (toolbarEvent) => {
      modal.show(SvgbobEditor, {
        model: {
          initialText: SAMPLE,
          onApply: (text) =>
            toolbarEvent.addText(`\n\`\`\`svgbob\n${text}\n\`\`\`\n`),
        },
      });
    },
  });

  if (api.decorateChatMessage) {
    api.decorateChatMessage((element, helper) => renderSvgbob(element, helper));
  }

  api.decorateCookedElement((elem, helper) => renderSvgbob(elem, helper), {
    id: "discourse-svgbob",
  });
});
