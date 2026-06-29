import Component from "@glimmer/component";
import { hash } from "@ember/helper";
import { action } from "@ember/object";
import { service } from "@ember/service";
import ToolbarButtons from "discourse/components/composer/toolbar-buttons";
import { ToolbarBase } from "discourse/lib/composer/toolbar";
import { i18n } from "discourse-i18n";
import SvgbobEditor from "./modal/svgbob-editor";
import SvgbobDiagram from "./svgbob-diagram";

const MENU_PADDING = 8;

class SvgbobToolbar extends ToolbarBase {
  constructor(opts) {
    super(opts);

    this.addButton({
      id: "svgbob-edit",
      icon: "pencil",
      title: themePrefix("svgbob.edit"),
      className: "svgbob-node__edit",
      action: opts.edit,
      tabindex: 0,
    });
  }
}

export default class SvgbobNodeView extends Component {
  @service menu;
  @service modal;

  #toolbar;
  #menuInstance;

  constructor() {
    super(...arguments);
    this.args.onSetup?.(this);
  }

  selectNode() {
    this.args.dom.classList.add("ProseMirror-selectednode");
    this.#showToolbar();
  }

  deselectNode() {
    this.args.dom.classList.remove("ProseMirror-selectednode");
    this.#closeToolbar();
  }

  stopEvent(event) {
    return this.#menuInstance?.content?.contains(event.target) ?? false;
  }

  destroy() {
    this.#closeToolbar();
  }

  async #showToolbar() {
    this.#toolbar ??= new SvgbobToolbar({ edit: this.edit });

    this.#menuInstance = await this.menu.newInstance(this.args.dom, {
      identifier: "svgbob-node-toolbar",
      component: ToolbarButtons,
      placement: "top-end",
      fallbackPlacements: ["top-end"],
      padding: MENU_PADDING,
      data: this.#toolbar,
      portalOutletElement: this.args.dom,
      closeOnClickOutside: false,
      closeOnEscape: false,
      closeOnScroll: false,
      trapTab: false,
      offset({ rects }) {
        return {
          mainAxis: -MENU_PADDING - rects.floating.height,
          crossAxis: -MENU_PADDING,
        };
      },
      limitShift: {
        offset: ({ rects }) => ({
          crossAxis: Math.min(
            rects.floating.height + 2 * MENU_PADDING,
            rects.reference.height - MENU_PADDING
          ),
        }),
      },
    });

    await this.#menuInstance.show();
  }

  #closeToolbar() {
    this.#menuInstance?.close();
    this.#menuInstance = null;
  }

  @action
  edit() {
    this.modal.show(SvgbobEditor, {
      model: {
        initialText: this.args.node.attrs.content,
        title: i18n(themePrefix("svgbob.edit")),
        onApply: (text) => this.#apply(text),
      },
    });
  }

  #apply(text) {
    const pos = this.args.getPos();
    this.args.view.dispatch(
      this.args.view.state.tr.setNodeMarkup(pos, null, {
        ...this.args.node.attrs,
        content: text,
      })
    );
  }

  <template>
    <SvgbobDiagram @data={{hash content=@node.attrs.content}} />
  </template>
}
