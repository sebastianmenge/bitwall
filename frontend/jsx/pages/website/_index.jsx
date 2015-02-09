var React = require("react"),
    _ = require("underscore"),
    PageContext = require("../../mixins/page_context.js"),
    TileListable = require("../../mixins/tile_listable.jsx")

module.exports = React.createClass({
  mixins: [PageContext, TileListable],

  getDefaultProps: function(){
    return {
      title: "Make your Patience platform fit your identity",
      numColumns: 2,
      entries: [
        {
          icon: "fa-pencil-square",
          label: "Edit the welcome page",
          description: "Easily change the appearance of your website's welcome page to attract new customers: choose a customized  background image, provide a rich and detailed description of your website, showcase specific courses and feature your own instructors and testimonials.",
          route: "website/show"
        },
        {
          icon: "fa-globe",
          label: "Customize your domains",
          description: "Add, edit and toggle your custom domains using our domain manager. With a custom domain your website will look more professional and will be easier to find online, thus resulting in higher sales revenue. If you need help to setup your domain, write to <a href='mailto:domains@patience.io'>domains@patience.io</a>.",
          route: "website/domain"
        },
        {
          icon: "fa-certificate",
          label: "Define the identity of your website",
          description: "Choose a logo, a favicon, the brand color of your website and define your own CSS rules to overwrite the Patience default style.",
          route: "website/branding"
        }
      ]
    }
  },

  render: function(){
    return this.renderTileList(this.props.entries)
  }
})