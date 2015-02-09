
var React = require('react'),
    Paper = require('./paper.jsx'),
    Classable = require('./mixins/classable.js'),
    Draggable = require('react-draggable2');

var Slider = React.createClass({

  propTypes: {
    required: React.PropTypes.bool,
    disabled: React.PropTypes.bool,
    min: React.PropTypes.number,
    max: React.PropTypes.number,
    step: React.PropTypes.number,
    error: React.PropTypes.string,
    description: React.PropTypes.string,
    name: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func,
    onDragStart: React.PropTypes.func,
    onDragStop: React.PropTypes.func,
    defaultValue: React.PropTypes.oneOfType([
        React.PropTypes.number,
        React.PropTypes.arrayOf(React.PropTypes.number)
    ]),
    doubleSlider : React.PropTypes.bool
  },

  mixins: [Classable],

  getDefaultProps: function() {
    return {
      required: true,
      disabled: false,
      defaultValue: 0,
      min: 0,
      max: 1,
      dragging: false,
      doubleSlider : false
    };
  },

  getInitialState: function() {
    if(this.props.doubleSlider) {
        var values = this.props.values;
        if(values == null || values.length != 2) {
            values = [this.props.min, this.props.max];
        }
        var percents = values.map(function(num) {
            var percent = num / this.props.max;
            if(isNaN(percent)) {
                percent = 0;
            }
            return percent;
        }.bind(this));
        return {
            values : values,
            percents : percents
        };

    } else {
        var value = this.props.value;
        if (value == null) value = this.props.defaultValue;
        var percent = value / this.props.max;
        if (isNaN(percent)) percent = 0;
        return {
          value: value,
          percent: percent
        }
    }
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.value != null) {
      this.setValue(nextProps.value);
    }
  },
  //FIXME - Make so disabled works
  _renderDraggables : function() {
      var createDraggable = function(disabled, percent, index) {
        return <Draggable axis="x" bound="point"
                  cancel={disabled ? '*' : null}
                  start={{x: (percent * 100) + '%'}}
                  onStart={this._onDragStart}
                  onStop={this._onDragStop}
                  onDrag={this._onDragUpdate.bind(this, index)}>
                  <div className="mui-slider-handle" tabIndex={0}></div>
            </Draggable>
      }.bind(this);

      if(this.props.doubleSlider) {
        return [
            createDraggable(false, this.state.percents[0], 0),
            createDraggable(false, this.state.percents[1], 1)
        ];
      } else {
        return createDraggable(false, this.state.percent, 0);
      }
  },
  render: function() {
    var classes = this.getClasses('mui-input', {
      'mui-error': this.props.error != null
    });

    var sliderClasses = this.getClasses('mui-slider', {
      'mui-slider-zero': typeof this.state.percents == "undefined" && this.state.percent == 0,
      'mui-disabled': this.props.disabled
    });


    var lowPercent, highPercent;

    if(this.props.doubleSlider) {
        lowPercent = this.state.percents[0];
        if (lowPercent > 1) lowPercent = 1; else if (lowPercent < 0) lowPercent = 0;

        highPercent = this.state.percents[1];
        if (highPercent > 1) higjPowPercent = 1; else if (highPercent < 0) highPercent = 0;
    } else {
        var percent = this.state.percent;
        if (percent > 1) percent = 1; else if (percent < 0) percent = 0;
        lowPercent = percent;
        highPercent = percent;
    }
    
    var draggables = this._renderDraggables();

    var middleSliderFill = null;
    if(this.props.doubleSlider) {
        middleSliderFill = (
            <div className="mui-slider-selection mui-slider-selection-middle"
              style={{width: ((highPercent - lowPercent) * 100) + '%', left : (lowPercent * 100) + '%'}}>
              <div className="mui-slider-selection-fill"></div>
            </div>
        );
    }

    return (
      <div className={classes} style={this.props.style}>
        <span className="mui-input-highlight"></span>
        <span className="mui-input-bar"></span>
        <span className="mui-input-description">{this.props.description}</span>
        <span className="mui-input-error">{this.props.error}</span>
        <div className={sliderClasses} onClick={this._onClick}>
          <div ref="track" className="mui-slider-track">
            {draggables}
            <div className="mui-slider-selection mui-slider-selection-low"
              style={{width: (lowPercent * 100) + '%'}}>
              <div className="mui-slider-selection-fill"></div>
            </div>
            {middleSliderFill}
            <div className="mui-slider-selection mui-slider-selection-high"
              style={{width: ((1 - highPercent) * 100) + '%'}}>
              <div className="mui-slider-selection-fill"></div>
            </div>
          </div>
        </div>
        <input ref="input" type="hidden"
          name={this.props.name}
          value={this.state.value}
          required={this.props.required}
          min={this.props.min}
          max={this.props.max}
          step={this.props.step} />
      </div>
    );
  },

  getValue: function() {
    return this.state.value;
  },

  setValue: function(i) {
    // calculate percentage
    var percent = (i - this.props.min) / (this.props.max - this.props.min);
    if (isNaN(percent)) percent = 0;
    // update state
    this.setState({
      value: i,
      percent: percent
    });
  },

  getPercent: function() {
    if(this.props.doubleSlider) {
        return this.state.percents;
    } else {
        return this.state.percent;
    }
  },

  setPercent: function (percent, index) {
    var value = this._percentToValue(percent);
    if(this.props.doubleSlider) {
        var values = this.state.values;
        values[index] = value;
        var percents = this.state.percents;
        percents[index] = percent;
        this.setState({values : values, percents : percents});
    } else {
        this.setState({value: value, percent: percent});
    }
  },

  clearValue: function() {
    this.setValue(0);
  },

  _onClick: function (e) {
    // let draggable handle the slider
    if (this.state.dragging || this.props.disabled) return;
    var value = this.state.value;
    var node = this.refs.track.getDOMNode();
    var boundingClientRect = node.getBoundingClientRect();
    var offset = e.clientX - boundingClientRect.left;
    this._updateWithChangeEvent(e, offset / node.clientWidth);
  },

  _onDragStart: function(e, ui) {
    this.setState({
      dragging: true
    });
    if (this.props.onDragStart) this.props.onDragStart(e, ui);
  },

  _onDragStop: function(e, ui) {
    this.setState({
      dragging: false
    });
    if (this.props.onDragStop) this.props.onDragStop(e, ui);
  },

  _onDragUpdate: function(index, e, ui) {
    if (!this.state.dragging) return;
    if (!this.props.disabled) this._dragX(e, ui.position.left, index);
  },

  _dragX: function(e, pos, index) {
    var max = this.refs.track.getDOMNode().clientWidth;
    if (pos < 0) pos = 0; else if (pos > max) pos = max;
    this._updateWithChangeEvent(e, pos / max, index);
  },

  _updateWithChangeEvent: function(e, percent, index) {
    if (this.state.percent === percent && !this.props.doubleSlider) return;
    this.setPercent(percent, index);
    var value = this._percentToValue(percent);
    var val;
    if(this.props.doubleSlider) {
        val = this.state.values;
        val[index] = value;
    } else {
        val = value;
    }
    if (this.props.onChange) this.props.onChange(e, val);
  },

  _percentToValue: function(percent) {
    return percent * (this.props.max - this.props.min) + this.props.min;
  }

});

module.exports = Slider;
