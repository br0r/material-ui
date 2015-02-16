var React = require('react');
var Classable = require('./mixins/classable');
var ClickAwayable = require('./mixins/click-awayable');
var DropDownArrow = require('./svg-icons/drop-down-arrow');
var KeyLine = require('./utils/key-line');
var Paper = require('./paper');
var Menu = require('./menu');

var SelectMenu = React.createClass({

  mixins: [Classable, ClickAwayable],

  propTypes: {
      autoWidth : React.PropTypes.bool,
      showArrow : React.PropTypes.bool,
      controlStyle : React.PropTypes.object
  },

  getDefaultProps: function() {
    return {
      autoWidth: true,
      showArrow : true,
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

    if (this.props.autoWidth) {this._setWidth()};
    this._setTop();

    this._renderVisibility();
  },
  componentDidUpdate : function() {
    if (this.props.autoWidth) {this._setWidth()};
    this._setTop();

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
            'top' : 56 //FIXME, does this always work?
        };
    }

    var paperClasses = this.getClasses('mui-menu', {
      'mui-menu-hideable': true,
      'mui-visible': this.state.open
    });

    var paperStyle = _.extend({
        'visibility' : (this.state.open) ? 'visible' : 'hidden',
        'position' : 'absolute',
        'top' : 57,
        'whiteSpace' : 'nowrap'
    }, this.props.style);

    if(this.props.orient === 'right') {
        paperStyle.right = '0px';
    }

    var arrowDown = (this.props.showArrow) ? <DropDownArrow className="mui-menu-drop-down-icon" /> : null;

    var controlStyle = this.props.controlStyle || {};

    return (
      <div className={classes} style={{"height" : (controlStyle.height) ? "auto" : 56}}>
        <div className="mui-menu-control" ref="menuControl" style={controlStyle} onClick={this._onControlClick}>
          <Paper className="mui-menu-control-bg" zDepth={0} rounded={false} />
          <div className="mui-menu-label" style={{"padding-left" : 0, "margin" : "auto", "line-height" : "normal"}}>
            {this.props.label}
          </div>
          {arrowDown}
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
  _setTop: function() {
    var el = this.refs.menuItems.getDOMNode(),
        controlEl = this.refs.menuControl.getDOMNode();

    el.style.top = controlEl.offsetHeight + 'px';
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

