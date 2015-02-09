var React = require('react');
var Classable = require('./mixins/classable.js');
var ClickAwayable = require('./mixins/click-awayable');
var DropDownArrow = require('./svg-icons/drop-down-arrow.jsx');
var KeyLine = require('./utils/key-line.js');
var Paper = require('./paper.jsx');
var Menu = require('./menu.jsx');

var SelectMenu = React.createClass({

  mixins: [Classable, ClickAwayable],

  propTypes: {
  },

  getDefaultProps: function() {
    return {
      autoWidth: true
    };
  },

  getInitialState: function() {
    return {
      open: false
    }
  },  
  componentClickAway: function() {
    this.setState({ open: false });
  },
  componentDidMount: function() {
    var el = this.refs.menuItems.getDOMNode();

    this._initialMenuHeight = el.offsetHeight + KeyLine.Desktop.GUTTER_LESS;

    if (this.props.autoWidth) this._setWidth();

    this._renderVisibility();
  },
  componentDidUpdate : function() {
    if (this.props.autoWidth) this._setWidth();

    this._renderVisibility();
  },
  render: function() {
    var classes = this.getClasses('mui-drop-down-menu', {
      'mui-open': this.state.open
    });

    var menuStyle = null;
    if(this.props.spawnType === 'normal') {
        menuStyle = {
            'position' : 'absolute',
            'top' : 57
        };
    }

    var paperClasses = this.getClasses('mui-menu', {
      'mui-menu-hideable': true,
      'mui-visible': this.state.open
    });

    var paperStyle = _.extend({
        'visibility' : (this.state.open) ? 'visible' : 'hidden',
        'position' : 'absolute',
        'top' : 57
    }, this.props.style);

    return (
      <div className={classes}>
        <div className="mui-menu-control" onClick={this._onControlClick}>
          <Paper className="mui-menu-control-bg" zDepth={0} rounded={false} />
          <div className="mui-menu-label">
            {this.props.label}
          </div>
          <DropDownArrow className="mui-menu-drop-down-icon" />
        </div>
        <Paper ref="menuItems" zDepth={1} rounded={false} className={paperClasses} style={paperStyle}>
            {this.props.children}
        </Paper>
      </div>
    );        
  },
  _setWidth: function() {
    var el = this.getDOMNode(),
      menuItemsDom = this.refs.menuItems.getDOMNode();

    el.style.width = menuItemsDom.offsetWidth + 'px';
  },
  _renderVisibility: function() {
    var el;

    el = this.refs.menuItems.getDOMNode();
    var innerContainer = this.refs.menuItems.getInnerContainer().getDOMNode();
      
    if (this.state.open) {
        //Open the menu
        el.style.height = this._initialMenuHeight + 'px';

        /*
        //Set the overflow to visible after the animation is done so
        //that other nested menus can be shown
        CssEvent.onTransitionEnd(el, function() {
          //Make sure the menu is open before setting the overflow.
          //This is to accout for fast clicks
          if (this.props.visible) innerContainer.style.overflow = 'visible';
        }.bind(this));
        */
      } else {

        //Close the menu
        el.style.height = '0px';

        //Set the overflow to hidden so that animation works properly
        innerContainer.style.overflow = 'hidden';
      }
  },
  _onControlClick: function(e) {
    this.setState({ open: !this.state.open });
  },

  _onMenuItemClick: function(e, key, payload) {
    if (this.props.onChange && this.state.selectedIndex !== key) this.props.onChange(e, key, payload);
    this.setState({
      selectedIndex: key,
      open: false
    });
  }

});

module.exports = SelectMenu;

