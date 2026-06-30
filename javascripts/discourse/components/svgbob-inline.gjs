import Component from "@glimmer/component";
import { action } from "@ember/object";
import { service } from "@ember/service";
// eslint-disable-next-line discourse/ui-kit-imports
import DButton from "discourse/components/d-button";
import SvgbobDiagram from "./svgbob-diagram";
import SvgbobFullscreen from "./svgbob-fullscreen";

export default class SvgbobInline extends Component {
  @service modal;

  @action
  fullscreen() {
    this.modal.show(SvgbobFullscreen, {
      model: {
        content: this.args.data.content,
      },
    });
  }

  <template>
    <div class="svgbob-diagram-controls">
      <DButton
        @icon="discourse-expand"
        class="btn-flat svgbob-fullscreen-button"
        @action={{this.fullscreen}}
      />
    </div>

    <SvgbobDiagram @data={{@data}} />
  </template>
}
