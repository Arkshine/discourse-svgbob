import { module, test } from "qunit";
import { setupRenderingTest } from "discourse/tests/helpers/component-test";
import { testMarkdown } from "discourse/tests/helpers/rich-editor-helper";

module(
  "Integration | Component | prosemirror-editor - svgbob extension",
  function (hooks) {
    setupRenderingTest(hooks);

    test("renders a svgbob node and round-trips markdown", async function (assert) {
      this.siteSettings.rich_editor = true;

      const markdown = "```svgbob\n+--+\n|hi|\n+--+\n```";

      await testMarkdown(
        assert,
        markdown,
        () => {
          assert.dom(".svgbob-diagram").exists();
        },
        markdown
      );
    });

    test("tolerates legacy height= and drops it on serialize", async function (assert) {
      this.siteSettings.rich_editor = true;

      await testMarkdown(
        assert,
        "```svgbob height=500\n+--+\n|hi|\n+--+\n```",
        () => {
          assert.dom(".svgbob-diagram").exists();
        },
        "```svgbob\n+--+\n|hi|\n+--+\n```"
      );
    });

    test("non-svgbob fence stays a code block", async function (assert) {
      this.siteSettings.rich_editor = true;

      const markdown = "```js\nconst a = 1;\n```";

      await testMarkdown(
        assert,
        markdown,
        () => {
          assert.dom("pre code").exists();
          assert.dom(".svgbob-diagram").doesNotExist();
        },
        markdown
      );
    });
  }
);
