var React = require("react"),
    Bootstrap = require('react-bootstrap'),
    cx = require("react/addons").addons.classSet,
    $script = require("scriptjs"),
    _ = require("underscore");

var options = [
  {
    label: "Live chat with us!",
    icon: "comments-o",
    onClick: function() {
      $zopim(function() {
        $zopim.livechat.window.setPosition('br');
        $zopim.livechat.window.setOffsetHorizontal(50);
        $zopim.livechat.window.setOffsetVertical(34);
        $zopim.livechat.window.show();
      });
    },
    hide: function(state) {return state.zopimStatus=="offline"}
  },
  {
    label: "Write to our Support Team",
    icon: "envelope-o",
    script: "//widget.uservoice.com/OX2wR9Pv8C4AK3mnD9Woiw.js",
    onClick: function() {
      UserVoice.push(['show', {
        mode: 'contact',
        ticket_custom_fields: {
          "Ticket type": "General Support (existing users)"
        }
      }])
    }
  },
  {
    label: "Report a Bug",
    icon: "bug",
    script: "//widget.uservoice.com/OX2wR9Pv8C4AK3mnD9Woiw.js",
    onClick: function() {
      UserVoice.push(["show", {
        mode: "contact",
        contact_title: "Please describe what happened and what you expected should happened",
        ticket_custom_fields: {
          "Ticket type": "Report a Bug"
        }
      }])
    }
  },
  {
    label: "Which feature should we add next?",
    icon: "flask",
    script: "//widget.uservoice.com/OX2wR9Pv8C4AK3mnD9Woiw.js",
    onClick: function() {
      UserVoice.push(['show', {
        mode: 'smartvote'
      }])
    }
  },
  {
    label: "FAQ & Knowledge Base",
    icon: "folder-open-o",
    href: "http://support.patience.io/knowledgebase"
  },
  {
    label: "Join the Facebook Discussion Group",
    icon: "facebook",
    href: "https://www.facebook.com/groups/patience.friends"
  }
];

var SupportTab = React.createClass({

  mixins: [Bootstrap.OverlayMixin],

  propTypes: {
    educator: React.PropTypes.object.isRequired,
    user: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {
      isModalOpen: false,
      scriptsLoaded: false,
      zopimStatus: "offline"
    };
  },

  componentDidMount: function() {
    var that = this;
    $script("//v2.zopim.com/?25eQ4SnyX15KKIWsxiqjOdeF8ruOd9am", function() {
      $zopim(function() {
        $zopim.livechat.set({
          language: that.props.user.locale,
          name: that.props.user.displayName,
          email: that.props.user.email,
          phone: that.props.user.phone || that.props.educator.contractContactPhone || ''
        });
        $zopim.livechat.setOnStatus(function(status) {
          that.setState({zopimStatus: status})
        });
        // just to be sure, sometimes it still shows up even though it shouldn't
        $zopim.livechat.button.hide();
        $zopim.livechat.window.hide();
      })
    });
  },

  _loadScripts: function() {
    if (!this.state.scriptsLoaded) {
      var scripts = _.chain(options).pluck("script").compact().uniq().value();
      var that = this;
      $script(scripts, function() {
        that.setState({scriptsLoaded:true});
        UserVoice.push(['set', {
          accent_color: '#2a5f4c'
        }])
        UserVoice.push(['identify', {
          email:      that.props.user.email, // User’s email address
          name:       that.props.user.displayName, // User’s real name
          //created_at: 1364406966, // Unix timestamp for the date the user signed up
          id:         that.props.user.id, // Optional: Unique id of the user (if set, this should not change)
          type:       'admin', // Optional: segment your users by type
          account: {
           id:           that.props.educator.id, // Optional: associate multiple users with a single account
           name:         that.props.educator.name, // Account name
          //  created_at:   1364406966, // Unix timestamp for the date the account was created
          //  monthly_rate: 9.99, // Decimal; monthly rate of the account
          //  ltv:          1495.00, // Decimal; lifetime value of the account
          //  plan:         'Enhanced' // Plan name for the account
          }
        }])
      })
    }
  },

  _open: function(){
    this.setState({isModalOpen: true});
    this._loadScripts();
  },

  _close: function(){
    this.setState({isModalOpen: false});
  },

  renderOverlay: function () {
    if (!this.state.isModalOpen) return <span/>;
    var that = this;

    function onClick(handler) {
      return function() {
        handler ? handler() : null;
        that._close();
      }
    }

    var items = null;
    if (!this.state.scriptsLoaded) {
      items = <span>loading...</span>;
    } else {
      items = _.chain(options)
        .reject(function(option) {
          return option.hide && option.hide(that.state);
        })
        .map(function(option) {
          return <li key={option.label}>
            <a
              onClick={onClick(option.onClick)}
              href={option.href}
              target={option.href ? "_blank" : null}
              >
              <i className={"fa fa-li fa-"+option.icon}></i>
              {option.label}
            </a>
          </li>;
        }).value()
    }


    return (
      <Bootstrap.Modal title={<h4 className="modal-title">Help &amp; Feedback</h4>} onRequestHide={this._close} className={"support-modal"}>
        <ul className="fa-ul navigation-blocks">
          {items}
        </ul>
      </Bootstrap.Modal>
    );
  },


  render: function() {
    var classes = cx({
      "support-tab-trigger": true,
      "support-tab-trigger-hidden": this.state.isModalOpen
    });
    var offers = ["Help","Feedback"]
    if (this.state.zopimStatus!=="offline") offers.push("Live Chat");
    var offersText = [offers.slice(0,-1).join(", "), offers.slice(-1)[0]].join(" & ")
    return <a onClick={this._open} className={classes}>{offersText}</a>;
  }

});

module.exports = SupportTab;