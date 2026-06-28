import { apiInitializer } from "discourse/lib/api";
import SvgbobDiagram from "../components/svgbob-diagram";

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
  // this is a hack as applySurround expects a top level
  // composer key, not possible from a theme
  window.I18n.translations[window.I18n.locale].js.composer.svgbob_sample = `
    *-------------*
    | hello world |
    *-------------*
  `;

  api.addComposerToolbarPopupMenuOption({
    icon: "diagram-project",
    label: themePrefix("insert_svgbob_sample"),
    action: (toolbarEvent) => {
      toolbarEvent.applySurround("\n```svgbob\n", "\n```\n", "svgbob_sample", {
        multiline: false,
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
