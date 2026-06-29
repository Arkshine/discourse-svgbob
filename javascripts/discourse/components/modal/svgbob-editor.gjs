import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { on } from "@ember/modifier";
import { action } from "@ember/object";
import didInsert from "@ember/render-modifiers/modifiers/did-insert";
import DButton from "discourse/components/d-button";
import DModal from "discourse/components/d-modal";
import concatClass from "discourse/helpers/concat-class";
import { or } from "discourse/truth-helpers";
import { i18n } from "discourse-i18n";

export default class SvgbobEditor extends Component {
  @tracked text = this.args.model.initialText ?? "";
  @tracked expanded = false;

  @action
  setInitialValue(element) {
    element.value = this.text;
  }

  @action
  updateText(event) {
    this.text = event.target.value;
  }

  @action
  toggleExpanded() {
    this.expanded = !this.expanded;
  }

  @action
  apply() {
    this.args.model.onApply(this.text);
    this.args.closeModal();
  }

  <template>
    <DModal
      @title={{or @model.title (i18n (themePrefix "svgbob.title"))}}
      @closeModal={{@closeModal}}
      class={{concatClass
        "svgbob-editor-modal"
        (if this.expanded "--expanded")
      }}
    >
      <:headerAboveTitle>
        <DButton
          @action={{this.toggleExpanded}}
          @icon={{if this.expanded "compress" "expand"}}
          @title={{themePrefix
            (if this.expanded "svgbob.collapse" "svgbob.expand")
          }}
          class="btn-transparent no-text svgbob-editor-modal__expand"
        />
      </:headerAboveTitle>
      <:body>
        <textarea
          class="svgbob-editor-modal__source"
          aria-label={{i18n (themePrefix "svgbob.source")}}
          {{didInsert this.setInitialValue}}
          {{on "input" this.updateText}}
        ></textarea>
      </:body>
      <:footer>
        <DButton
          @action={{this.apply}}
          @label={{themePrefix "svgbob.save"}}
          class="btn-primary"
        />
        <DButton @action={{@closeModal}} @label="cancel" class="btn-default" />
      </:footer>
    </DModal>
  </template>
}
