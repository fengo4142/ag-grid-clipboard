import React from "react";
import * as PropTypes from "prop-types";

// Header component to be used as default for all the columns.
export default class CustomHeader extends React.Component {
  constructor(props) {
    super(props);

    // this.sortChanged = this.onSortChanged.bind(this);
    this.props.column.addEventListener("sortChanged", this.onSortChanged);

    //The state of this component contains the current sort state of this column
    //The possible values are: 'asc', 'desc' and ''
    this.state = {
      sorted: ""
    };
  }

  componentWillUnmount() {
    this.props.column.removeEventListener("sortChanged", this.onSortChanged);
  }

  render() {
    let sortElements = [];
    if (this.props.enableSorting) {
      let downArrowClass =
        "customSortDownLabel " +
        (this.state.sorted === "desc" ? " active" : "");
      let upArrowClass =
        "customSortUpLabel " + (this.state.sorted === "asc" ? " active" : "");
      let removeArrowClass =
        "customSortRemoveLabel " + (this.state.sorted === "" ? " active" : "");

      sortElements.push(
        <div
          key={`up${this.props.displayName}`}
          className={downArrowClass}
          onClick={this.onSortRequested.bind(this, "desc")}
        >
          <i className="fa fa-long-arrow-alt-down" />
        </div>
      );
      sortElements.push(
        <div
          key={`down${this.props.displayName}`}
          className={upArrowClass}
          onClick={this.onSortRequested.bind(this, "asc")}
        >
          <i className="fa fa-long-arrow-alt-up" />
        </div>
      );
      sortElements.push(
        <div
          key={`minus${this.props.displayName}`}
          className={removeArrowClass}
          onClick={this.onSortRequested.bind(this, "")}
        >
          <i className="fa fa-times" />
        </div>
      );
    }

    let menuButton = null;
    if (this.props.enableMenu) {
      menuButton = (
        <div
          ref="menuButton"
          className="customHeaderMenuButton"
          onClick={this.onMenuClick.bind(this)}
        >
          <i className={"fa " + this.props.menuIcon} />
        </div>
      );
    }

    return (
      <div>
        {menuButton}
        <div className="customHeaderLabel" onDoubleClick={this.onHeaderDoubleClick.bind(this)}>{this.props.displayName}</div>
        {sortElements}
      </div>
    );
  }

  onSortRequested(order, event) {
    this.props.setSort(order, event.shiftKey);
  }

  onSortChanged = () => {
    if (this.props.column.isSortAscending()) {
      this.setState({
        sorted: "asc"
      });
    } else if (this.props.column.isSortDescending()) {
      this.setState({
        sorted: "desc"
      });
    } else {
      this.setState({
        sorted: ""
      });
    }
  };

  onHeaderDoubleClick() {
    console.log(this.props.api)
      this.props.api.addCellRange({
        rowStartIndex: 0,
        rowEndIndex: this.props.api.getDisplayedRowCount() - 1,
        columnStart: this.props.column.colId,
        columnEnd: this.props.column.colId
    });
    this.props.api.setFocusedCell(0, this.props.column.colId, null)
    console.log("range", this.props.api.getCellRanges())
  }
  onMenuClick() {
    this.props.showColumnMenu(this.refs.menuButton);
  }
}

// the grid will always pass in one props called 'params',
// which is the grid passing you the params for the cellRenderer.
// this piece is optional. the grid will always pass the 'params'
// props, so little need for adding this validation meta-data.
CustomHeader.propTypes = {
  params: PropTypes.object
};
