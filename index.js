"use strict";

import _ from "lodash";
import React from "react";
import classNames from "classnames";

class Dropdown extends React.Component {

  constructor(props) {
    super(props);

    this.state = this.getInitialSate();
    this.mounted = true;

    this.handleDocumentClick = this.handleDocumentClick.bind(this);
  }

  getInitialSate() {
    return {
      isOpen: false
    };
  }

  componentDidMount() {
    document.addEventListener("click", this.handleDocumentClick, false);
  }

  componentWillUnmount() {
    this.mounted = false;
    document.removeEventListener("click", this.handleDocumentClick, false);
  }

  handleMouseDown(evt) {
    if (evt.button === 0 && evt.type === "mousedown") {
      evt.stopPropagation();
      evt.preventDefault();

      this.setState({
        isOpen: !this.state.isOpen
      });
    }
  }

  setValue(option) {
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

  renderOption (option) {
    let classNameMap, optionClass;

    classNameMap = {
      "select-dropdown-option": true,
      "is-selected": option.value == this.getSelectedOption().value,
      "is-empty": option.value === null
    };

    classNameMap[option.value] = true;
    optionClass = classNames(classNameMap);

    return (
      <div key={option.value}
           className={optionClass}
           onMouseDown={this.setValue.bind(this, option)}
           onClick={this.setValue.bind(this, option)}>
        {option.label}
      </div>
    );
  }

  buildMenu() {
    let data, opts;

    data = [].concat(this.props.options);

    if (this.props.allowEmpty) {
      data.unshift({
        value: null,
        label: ""
      });
    }

    opts = data.map((option) => {
      let groupTitle, _options, rendered;

      if (option.type === "group") {
        groupTitle = (
          <div className="title">
            {option.name}
          </div>
        );

        _options = option.items.map((item) => this.renderOption(item));

        rendered = (
          <div className="group"
               key={option.name}>
            {groupTitle}
            {_options}
          </div>
        );
      } else {
        rendered = this.renderOption(option);
      }

      return rendered;
    });

    return opts.length ? opts : (
      <div className="select-dropdown-noresults">No options found.</div>
    );
  }

  handleDocumentClick(evt) {
    if (this.mounted && !React.findDOMNode(this).contains(evt.target)) {
      this.setState({
        isOpen: false
      });
    }
  }

  getSelectedOption() {
    let val, result;

    val = this.props.value || this.props.valueLink.value || _.first(this.props.options).value;
    result = _.filter(this.props.options, option => option.value === val);

    return _.first(result) || {
      label: this.props.placeholder
    };
  }

  render() {
    const { controlClassName, menuClassName } = this.props;
    let input, value, menu, dropdownClass, selectedOption;

    input = (
      <input type="hidden" ref="input"
        {...(_.omit(this.props, "options", "onChange", "valueLink"))}/>
    );

    selectedOption = this.getSelectedOption();

    value = (
      <div className={`placeholder ${selectedOption.value}`}>
        {selectedOption.label}
      </div>
    );

    menu = this.state.isOpen ? (
      <div className={menuClassName}>
        {this.buildMenu()}
      </div>
    ) : null;

    dropdownClass = classNames({
      "select-dropdown": true,
      "is-open": this.state.isOpen
    });

    return (
      <div className={dropdownClass}>
        {input}
        <div className={controlClassName}
             onMouseDown={this.handleMouseDown.bind(this)}
             onTouchEnd={this.handleMouseDown.bind(this)}>
          {value}
          <span className="select-dropdown-arrow" />
        </div>
        {menu}
      </div>
    );
  }

}

Dropdown.defaultProps = {
  controlClassName: "select-dropdown-control",
  menuClassName: "select-dropdown-menu",
  allowEmpty: true
};

export default Dropdown;
