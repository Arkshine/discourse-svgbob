import { later } from "@ember/runloop";
import { apiInitializer } from "discourse/lib/api";
import { cookSvgBob, stripStyle } from "../lib/renderer";

async function applySvgbob(element, key = "composer") {
  let svgbobs = element.querySelectorAll("pre[data-code-wrap=svgbob]");

  if (!svgbobs.length) {
    return;
  }

  svgbobs.forEach((svgbob) => {
    if (svgbob.dataset.processed) {
      return;
    }

    const spinner = document.createElement("div");
    spinner.classList.add("spinner");

    if (svgbob.dataset.codeHeight && key !== "composer") {
      svgbob.style.height = `${svgbob.dataset.codeHeight}px`;
    }

    later(() => {
      if (!svgbob.dataset.processed) {
        svgbob.append(spinner);
      }
    }, 2000);
  });

  svgbobs = element.querySelectorAll("pre[data-code-wrap=svgbob]");
  svgbobs.forEach(async (svgbob, index) => {
    if (svgbob.dataset.processed) {
      return;
    }

    const code = svgbob.querySelector("code");

    if (!code) {
      svgbob.dataset.processed = "true";
      return;
    }

    let cooked = await cookSvgBob(code.innerText);

    svgbob.dataset.processed = "true";
    svgbob.innerHTML = stripStyle(cooked);

    if (key === "composer") {
      later(() => updateMarkdownHeight(svgbob, index), 1000);
    }
  });
}

function updateMarkdownHeight(svgbob, index) {
  let height = parseInt(svgbob.getBoundingClientRect().height, 10);
  let calculatedHeight = parseInt(svgbob.dataset.calculatedHeight, 10);

  if (height === 0) {
    return;
  }

  if (height !== calculatedHeight) {
    svgbob.dataset.calculatedHeight = height;
    // TODO: need to use API here
    let composer = document.getElementsByClassName("d-editor-input")[0];
    let old = composer.value;

    let split = old.split("\n");

    let n = 0;
    for (let i = 0; i < split.length; i++) {
      if (split[i].match(/```svgbob/)) {
        if (n === index) {
          split[i] = "```svgbob height=" + height;
        }
        n += 1;
      }
    }

    let joined = split.join("\n");

    if (joined !== composer.value) {
      let restorePosStart = composer.selectionStart;
      let restorePosEnd = composer.selectionEnd;

      composer.value = joined;

      if (restorePosStart) {
        composer.selectionStart = restorePosStart;
        composer.selectionEnd = restorePosEnd;
      }
    }
  }
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
    api.decorateChatMessage((element) => {
      applySvgbob(element, `chat_message_${element.id}`);
    });
  }

  api.decorateCookedElement(
    async (elem, helper) => {
      const post = helper?.getModel();
      const id = post ? `post_${post.id}` : "composer";
      applySvgbob(elem, id);
    },
    { id: "discourse-svgbob" }
  );
});
