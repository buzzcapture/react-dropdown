"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _ = _interopRequire(require("lodash"));

var React = _interopRequire(require("react"));

var ReactDOM = _interopRequire(require("react-dom"));

var classNames = _interopRequire(require("classnames"));

var Dropdown = (function (_React$Component) {
  function Dropdown(props) {
    _classCallCheck(this, Dropdown);

    _get(Object.getPrototypeOf(Dropdown.prototype), "constructor", this).call(this, props);

    this.state = this.getInitialSate();
    this.mounted = true;

    this.handleDocumentClick = this.handleDocumentClick.bind(this);
  }

  _inherits(Dropdown, _React$Component);

  _createClass(Dropdown, {
    getInitialSate: {
      value: function getInitialSate() {
        return {
          isOpen: false
        };
      }
    },
    componentDidMount: {
      value: function componentDidMount() {
        document.addEventListener("click", this.handleDocumentClick, false);
      }
    },
    componentWillUnmount: {
      value: function componentWillUnmount() {
        this.mounted = false;
        document.removeEventListener("click", this.handleDocumentClick, false);
      }
    },
    handleMouseDown: {
      value: function handleMouseDown(evt) {
        if (evt.button === 0 && evt.type === "mousedown") {
          evt.stopPropagation();
          evt.preventDefault();

          this.setState({
            isOpen: !this.state.isOpen
          });
        }
      }
    },
    setValue: {
      value: function setValue(option) {
        this.refs.input.value = option.value;

        // Update linked component.
        if (this.props.valueLink) {
          this.props.valueLink.requestChange(option.value);
        } else if (this.props.onChange) {
          // Call onChange with no Event, but pass the selection.
          this.props.onChange(null, option);
        }

        this.setState({
          isOpen: false
        });
      }
    },
    renderOption: {
      value: function renderOption(option) {
        var classNameMap = undefined,
            optionClass = undefined;

        classNameMap = {
          "select-dropdown-option": true,
          "is-selected": option.value == this.getSelectedOption().value,
          "is-empty": option.value === null
        };

        classNameMap[option.value] = true;
        optionClass = classNames(classNameMap);

        return React.createElement(
          "div",
          { key: option.value,
            className: optionClass,
            onMouseDown: this.setValue.bind(this, option),
            onClick: this.setValue.bind(this, option) },
          option.label
        );
      }
    },
    buildMenu: {
      value: function buildMenu() {
        var _this = this;

        var data = undefined,
            opts = undefined;

        data = [].concat(this.props.options);

        if (this.props.allowEmpty) {
          data.unshift({
            value: null,
            label: ""
          });
        }

        opts = data.map(function (option) {
          var groupTitle = undefined,
              _options = undefined,
              rendered = undefined;

          if (option.type === "group") {
            groupTitle = React.createElement(
              "div",
              { className: "title" },
              option.name
            );

            _options = option.items.map(function (item) {
              return _this.renderOption(item);
            });

            rendered = React.createElement(
              "div",
              { className: "group",
                key: option.name },
              groupTitle,
              _options
            );
          } else {
            rendered = _this.renderOption(option);
          }

          return rendered;
        });

        return opts.length ? opts : React.createElement(
          "div",
          { className: "select-dropdown-noresults" },
          "No options found."
        );
      }
    },
    handleDocumentClick: {
      value: function handleDocumentClick(evt) {
        if (this.mounted && !ReactDOM.findDOMNode(this).contains(evt.target)) {
          this.setState({
            isOpen: false
          });
        }
      }
    },
    getSelectedOption: {
      value: function getSelectedOption() {
        var val = undefined,
            result = undefined;

        val = this.props.value || (this.props.valueLink || {}).value || _.first(this.props.options).value;
        result = _.filter(this.props.options, function (option) {
          return option.value === val;
        });

        return _.first(result) || {
          label: this.props.placeholder
        };
      }
    },
    render: {
      value: function render() {
        var _props = this.props;
        var controlClassName = _props.controlClassName;
        var menuClassName = _props.menuClassName;

        var input = undefined,
            value = undefined,
            menu = undefined,
            dropdownClass = undefined,
            selectedOption = undefined;

        input = React.createElement("input", _extends({ type: "hidden", ref: "input"
        }, _.omit(this.props, "options", "onChange", "valueLink")));

        selectedOption = this.getSelectedOption();

        value = React.createElement(
          "div",
          { className: "placeholder " + selectedOption.value },
          selectedOption.label
        );

        menu = this.state.isOpen ? React.createElement(
          "div",
          { className: menuClassName },
          this.buildMenu()
        ) : null;

        dropdownClass = classNames({
          "select-dropdown": true,
          "is-open": this.state.isOpen
        });

        return React.createElement(
          "div",
          { className: dropdownClass },
          input,
          React.createElement(
            "div",
            { className: controlClassName,
              onMouseDown: this.handleMouseDown.bind(this),
              onTouchEnd: this.handleMouseDown.bind(this) },
            value,
            React.createElement("span", { className: "select-dropdown-arrow" })
          ),
          menu
        );
      }
    }
  });

  return Dropdown;
})(React.Component);

Dropdown.defaultProps = {
  controlClassName: "select-dropdown-control",
  menuClassName: "select-dropdown-menu",
  allowEmpty: true
};

module.exports = Dropdown;

