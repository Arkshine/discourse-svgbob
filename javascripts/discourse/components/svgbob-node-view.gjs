import Component from "@glimmer/component";
import { hash } from "@ember/helper";
import SvgbobDiagram from "./svgbob-diagram";

export default class SvgbobNodeView extends Component {
  constructor() {
    super(...arguments);
    this.args.onSetup?.(this);
  }

  <template>
    <SvgbobDiagram @data={{hash content=@node.attrs.content}} />
  </template>
}
