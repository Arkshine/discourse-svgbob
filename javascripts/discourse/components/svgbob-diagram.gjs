import Component from "@glimmer/component";
import { cached, tracked } from "@glimmer/tracking";
import { cancel } from "@ember/runloop";
import { trustHTML } from "@ember/template";
// eslint-disable-next-line discourse/ui-kit-imports
import loadingSpinner from "discourse/helpers/loading-spinner";
import discourseLater from "discourse/lib/later";
import { cookSvgBob, stripStyle } from "../lib/renderer";

const SLOW_RENDER_MS = 500;

class Render {
  @tracked svg = null;
  @tracked slow = false;

  constructor(content) {
    const timer = discourseLater(() => (this.slow = true), SLOW_RENDER_MS);

    cookSvgBob(content).then((svg) => {
      cancel(timer);
      this.svg = trustHTML(stripStyle(svg));
    });
  }
}

export default class SvgbobDiagram extends Component {
  @cached
  get render() {
    return new Render(this.args.data.content);
  }

  <template>
    <div class="svgbob-diagram" ...attributes>
      {{#if this.render.svg}}
        <div class="svgbob-diagram__svg">{{this.render.svg}}</div>
      {{else}}
        <pre class="svgbob-diagram__source">{{@data.content}}</pre>
        {{#if this.render.slow}}
          <div class="svgbob-diagram__loading">{{loadingSpinner}}</div>
        {{/if}}
      {{/if}}
    </div>
  </template>
}
