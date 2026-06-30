import { hash } from "@ember/helper";
// eslint-disable-next-line discourse/ui-kit-imports
import DModal from "discourse/components/d-modal";
import SvgbobDiagram from "./svgbob-diagram";

const SvgbobFullscreen = <template>
  <DModal @closeModal={{@closeModal}} class="svgbob-fullscreen">
    <SvgbobDiagram @data={{hash content=@model.content}} />
  </DModal>
</template>;

export default SvgbobFullscreen;
