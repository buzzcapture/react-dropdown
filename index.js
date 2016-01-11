"use strict";

import React from "react";
import classNames from "classnames";

class Dropdown extends React.Component {

  constructor(props) {
    super(props);

    // Seems to be important if using ES6 classes.
    this.state = this.getInitialSate(props);

    this.mounted = true;
    this.handleDocumentClick = this.handleDocumentClick.bind(this);
  }

  getInitialSate(props) {
    return {
      selected: props.value || {
        label: props.placeholder || "Select...",
        value: ""
      },

      isOpen: false
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.value && newProps.value !== this.state.selected) {
      this.setState({selected: newProps.value});
    }
  }

  componentDidMount() {
    document.addEventListener("click", this.handleDocumentClick, false);
  }

  componentWillUnmount() {
    this.mounted = false;
    document.removeEventListener("click", this.handleDocumentClick, false);
  }

  handleMouseDown(evt) {
    if (evt.button === 0 && evt.type !== "mousedown") {
      evt.stopPropagation();
      evt.preventDefault();

      this.setState({
        isOpen: !this.state.isOpen
      });
    }
  }

  setValue(option) {
    let newState = {
      selected: option,
      isOpen: false
    };

    this.fireChangeEvent(newState);
    this.setState(newState);
  }

  fireChangeEvent(newState) {
    if (newState.selected !== this.state.selected && this.props.onChange) {
      this.props.onChange(newState.selected);
    }
  }

  renderOption (option) {
    let optionClass = classNames({
      "dropdown-option": true,
      "is-selected": option == this.state.selected
    });

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
    let opts;

    opts = this.props.options.map((option) => {
      let groupTitle, _options, rendered;

      if (option.type == "group") {
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
      <div className="dropdown-noresults">No options found.</div>
    );
  }

  handleDocumentClick(evt) {
    if (this.mounted && !React.findDOMNode(this).contains(evt.target)) {
      this.setState({
        isOpen:false
      });
    }
  }

  render() {
    const { controlClassName, menuClassName } = this.props;

    let value, menu, dropdownClass;

    value = (
      <div className="placeholder">
        {this.state.selected.label}
      </div>
    );

    menu = this.state.isOpen ? (
      <div className={menuClassName}>
        {this.buildMenu()}
      </div>
    ) : null;

    dropdownClass = classNames({
      "dropdown": true,
      "is-open": this.state.isOpen
    });

    return (
      <div className={dropdownClass}>
        <div className={controlClassName}
             onMouseDown={this.handleMouseDown.bind(this)}
             onTouchEnd={this.handleMouseDown.bind(this)}>
          {value}
          <span className="dropdown-arrow" />
        </div>
        {menu}
      </div>
    );
  }

}

Dropdown.defaultProps = {
  controlClassName: "dropdown-control",
  menuClassName: "dropdown-menu"
};

export default Dropdown;
