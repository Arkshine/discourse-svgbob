import { apiInitializer } from "discourse/lib/api";
import SvgbobEditor from "../components/modal/svgbob-editor";
import SvgbobDiagram from "../components/svgbob-diagram";
import svgbobExtension from "../lib/rich-editor-extension";

// prettier-ignore
const SAMPLE = [
  "*-------------*",
  "| hello world |",
  "*-------------*",
].join("\n");

function renderSvgbob(element, helper) {
  element.querySelectorAll("pre[data-code-wrap=svgbob]").forEach((pre) => {
    const content = pre.querySelector("code")?.innerText;
    if (!content) {
      return;
    }

    const wrapper = document.createElement("div");
    wrapper.classList.add("svgbob-wrapper");
    helper.renderGlimmer(wrapper, SvgbobDiagram, { content });
    pre.replaceWith(wrapper);
  });
}

export default apiInitializer("1.13.0", (api) => {
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
