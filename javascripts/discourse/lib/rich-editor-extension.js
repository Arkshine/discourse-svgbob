import SvgbobNodeView from "../components/svgbob-node-view";

const extension = {
  nodeSpec: {
    svgbob: {
      group: "block",
      atom: true,
      selectable: true,
      draggable: true,
      defining: true,
      isolating: true,
      attrs: { content: { default: "" } },
      parseDOM: [
        {
          tag: "pre[data-code-wrap=svgbob]",
          getAttrs: (dom) => ({
            content: dom.querySelector("code")?.textContent ?? "",
          }),
        },
      ],
      toDOM: (node) => [
        "pre",
        { "data-code-wrap": "svgbob" },
        ["code", node.attrs.content],
      ],
    },
  },

  nodeViews: {
    svgbob: { component: SvgbobNodeView },
  },

  parse: {
    fence: (state, token) => {
      const { schema } = state;
      const info = (token.info || "").trim();
      const content = token.content.replace(/\n$/, "");

      if (!/^svgbob(\s|$)/.test(info)) {
        // non-svgbob fences keep default code_block behavior
        state.openNode(schema.nodes.code_block, { params: token.info || "" });

        if (content) {
          state.addText(content);
        }

        state.closeNode();

        return true;
      }

      state.addNode(schema.nodes.svgbob, { content });
      return true;
    },
  },

  serializeNode: {
    svgbob(state, node) {
      state.write("```svgbob\n");
      state.text(node.attrs.content ?? "", false);
      state.ensureNewLine();
      state.write("```");
      state.closeBlock(node);
    },
  },
};

export default extension;
