# frozen_string_literal: true

RSpec.describe "Svgbob", type: :system do
  fab!(:admin)
  fab!(:topic)

  let(:topic_page) { PageObjects::Pages::Topic.new }

  before do
    upload_theme_or_component
    sign_in(admin)
  end

  it "renders a svgbob diagram in a post" do
    post = Fabricate(:post, topic:, raw: <<~RAW)
      ```svgbob
      +--+
      |hi|
      +--+
      ```
    RAW

    topic_page.visit_topic(post.topic)

    expect(page).to have_css(".svgbob-wrapper .svgbob-diagram svg")
  end
end
