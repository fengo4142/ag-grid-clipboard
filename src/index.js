import React, { Component } from "react";
import ReactDOM from "react-dom";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import "ag-grid-enterprise";

import CustomHeader from "./customHeader.js";

import "./styles.css";

class GridExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        {
          headerName: "Athlete",
          field: "athlete"          
        },
        {
          headerName: "Age",
          field: "age",
        },
        {
          headerName: "Country",
          field: "country",
        },
        {
          headerName: "Year",
          field: "year",
        },
        {
          headerName: "Date",
          field: "date",
        },
        {
          headerName: "Sport",
          field: "sport",
        },
        {
          headerName: "Gold",
          field: "gold",
        },
        {
          headerName: "Silver",
          field: "silver",
        },
        {
          headerName: "Bronze",
          field: "bronze",
        },
        {
          headerName: "Total",
          field: "total",
          suppressSizeToFit: true
        }
      ],
      defaultColDef: {
        editable: true,
        sortable: true,
        filterable: true,
        headerComponentFramework: CustomHeader,
        headerComponentParams: {
          menuIcon: "fa-bars"
        }
      },
      suppressRowClickSelection: true,
      enableRangeSelection: true,
      rowSelection: "multiple",
      rowDeselection: true,
      clipboardDeliminator: ",",

      rowData: []
    };
  }

  _fetchData() {
    const httpRequest = new XMLHttpRequest();
    const updateData = data => {
      this.setState({ rowData: data });
      //cb(data);
    };

    httpRequest.open(
      "GET",
      "https://raw.githubusercontent.com/ag-grid/ag-grid-docs/master/src/olympicWinnersSmall.json"
    );
    httpRequest.send();
    httpRequest.onreadystatechange = () => {
      if (httpRequest.readyState === 4 && httpRequest.status === 200) {
        updateData(JSON.parse(httpRequest.responseText));
      }
    };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this._fetchData();
    this.gridApi.sizeColumnsToFit();
  }
  onKeyUp(evt) {
    if (evt.key === "Shift") {
      this.gridApi.clearRangeSelection();
      this.setState({ suppressRowClickSelection: true });
      this.setState({ enableRangeSelection: true });
    }
  }
  onKeyDown(evt) {
    if (evt.shiftKey) {
      this.gridApi.deselectAll();
      this.gridApi.clearRangeSelection();
      this.setState({ enableRangeSelection: false });
      this.setState({ suppressRowClickSelection: false });
    }
    if (evt.key === "x" && (evt.ctrlKey || evt.metaKey)) {
      this.gridApi.copySelectedRangeToClipboard();

      const [cellrange] = this.gridApi.getCellRanges();
      const rowDataUpdated = [];
      if (cellrange !== undefined) {
        let startRowIndex = cellrange.startRow.rowIndex;
        let endRowIndex = cellrange.endRow.rowIndex;
        if (startRowIndex > endRowIndex) {
          let temp = startRowIndex;
          startRowIndex = endRowIndex;
          endRowIndex = temp;
        }
        for (let index = startRowIndex; index <= endRowIndex; index++) {
          let colData = cellrange.columns.map(column => {
            let nodeData = this.gridApi.getRowNode(index).data;
            nodeData[column.colId] = "";
            return nodeData;
          });
          rowDataUpdated.push(colData);
        }
      } else {
        this.gridApi.copySelectedRowsToClipboard();
        const selectedRows = this.gridApi.getSelectedRows();
        let rowData = selectedRows.map(row => {
          let obj = row;
          for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
              obj[prop] = "";
            }
          }
          console.log(obj);
          return obj;
        });
        rowDataUpdated.push(rowData);
      }
      console.log(rowDataUpdated);
      this.gridApi.updateRowData({ update: rowDataUpdated });
      return true;
    }
    return false;
  }
  rowClicked() {
    if (
      this.gridApi.getSelectedRows().length &&
      this.state.suppressRowClickSelection
    ) {
      this.gridApi.deselectAll();
    }
    return true;
  }
  sortChanged() {
    console.log("--", this.state.suppressRowClickSelection);
  }
  render() {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <div
          className="grid-wrapper"
          onKeyDown={this.onKeyDown.bind(this)}
          onKeyUp={this.onKeyUp.bind(this)}
        >
          <div
            id="myGrid"
            style={{
              boxSizing: "border-box",
              height: "100%",
              width: "100%"
            }}
            className="ag-theme-balham"
          >
            <AgGridReact
              columnDefs={this.state.columnDefs}
              defaultColDef={this.state.defaultColDef}
              suppressRowClickSelection={this.state.suppressRowClickSelection}
              enableRangeSelection={this.state.enableRangeSelection}
              rowSelection={this.state.rowSelection}
              clipboardDeliminator={this.state.clipboardDeliminator}
              onGridReady={this.onGridReady.bind(this)}
              onRowClicked={this.rowClicked.bind(this)}
              onSortChanged={this.sortChanged.bind(this)}
              rowData={this.state.rowData}
            />
          </div>
        </div>
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div
        className="ag-theme-balham"
        style={{
          height: "500px",
          width: "1400px",
          margin: "auto"
        }}
      >
        <GridExample />
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
