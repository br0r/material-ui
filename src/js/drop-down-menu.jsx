var React = require('react');
var Classable = require('./mixins/classable.js');
var ClickAwayable = require('./mixins/click-awayable');
var DropDownArrow = require('./svg-icons/drop-down-arrow.jsx');
var KeyLine = require('./utils/key-line.js');
var Paper = require('./paper.jsx');
var Menu = require('./menu.jsx');

var DropDownMenu = React.createClass({

  mixins: [Classable, ClickAwayable],

  propTypes: {
    autoWidth: React.PropTypes.bool,
    onChange: React.PropTypes.func,
    menuItems: React.PropTypes.array.isRequired,
    spawnType : React.PropTypes.oneOf(['normal', 'mobile'])
  },

  getDefaultProps: function() {
    return {
      autoWidth: true,
      spawnType : 'normal'
    };
  },

  getInitialState: function() {
    return {
      open: false,
      selectedIndex: this.props.selectedIndex || 0
    }
  },

  componentClickAway: function() {
    this.setState({ open: false });
  },

  componentDidMount: function() {
    if (this.props.autoWidth) this._setWidth();
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.hasOwnProperty('selectedIndex')) {
      this.setState({selectedIndex: nextProps.selectedIndex});
    }
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

    return (
      <div className={classes}>
        <div className="mui-menu-control" onClick={this._onControlClick}>
          <Paper className="mui-menu-control-bg" zDepth={0} rounded={false} />
          <div className="mui-menu-label">
            {this.props.menuItems[this.state.selectedIndex].text}
          </div>
          <DropDownArrow className="mui-menu-drop-down-icon" />
          <div className="mui-menu-control-underline" style={{'display' : 'none'}} />
        </div>
        <Menu
          ref="menuItems"
          autoWidth={this.props.autoWidth}
          selectedIndex={this.state.selectedIndex}
          menuItems={this.props.menuItems}
          hideable={true}
          visible={this.state.open}
          onItemClick={this._onMenuItemClick}
          style={menuStyle}  />
      </div>
    );
  },

  _setWidth: function() {
    var el = this.getDOMNode(),
      menuItemsDom = this.refs.menuItems.getDOMNode();

    el.style.width = menuItemsDom.offsetWidth + 'px';
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

module.exports = DropDownMenu;
