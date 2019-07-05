import React, { Component } from "react";
import ReactDOM from "react-dom";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-balham.css";
import "ag-grid-enterprise"

import "./styles.css";

class GridExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        {
          headerName: "Athlete",
          field: "athlete",
          width: 150,
          suppressSizeToFit: true
        },
        {
          headerName: "Age",
          field: "age",
          width: 90,
          minWidth: 50,
          maxWidth: 100
        },
        {
          headerName: "Country",
          field: "country",
          width: 120
        },
        {
          headerName: "Year",
          field: "year",
          width: 90
        },
        {
          headerName: "Date",
          field: "date",
          width: 110
        },
        {
          headerName: "Sport",
          field: "sport",
          width: 110
        },
        {
          headerName: "Gold",
          field: "gold",
          width: 100
        },
        {
          headerName: "Silver",
          field: "silver",
          width: 100
        },
        {
          headerName: "Bronze",
          field: "bronze",
          width: 100
        },
        {
          headerName: "Total",
          field: "total",
          width: 100
        }
      ],
      defaultColDef: { editable: true },
      rowSelection: "multiple",
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
    var that = this;
    that._fetchData();
     
  }
  onKeyDown(evt) {
    if (evt.key === "x" && (evt.ctrlKey || evt.metaKey)) {
        this.gridApi.copySelectedRangeToClipboard();

        const [cellrange] = this.gridApi.getCellRanges()
        const rowDataUpdated = [];

        for (let index = cellrange.startRow.rowIndex; index <= cellrange.endRow.rowIndex; index++) {
            let nodeData = this.gridApi.getRowNode(index).data;
            cellrange.columns.map(column => {
                nodeData[column.colId] = "";
            })
            rowDataUpdated.push(nodeData);
        }
        console.log(rowDataUpdated)
        this.gridApi.updateRowData({update: rowDataUpdated});

        return true;
    }
    return false;    
  }
  sizeToFit() {
    console.log(this)
    this.gridApi.sizeColumnsToFit();
  }
  autoSizeAll() {
    var allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(function(column) {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds);
  }
  render() {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <div className="grid-wrapper">
          <div
            id="myGrid"
            style={{
              boxSizing: "border-box",
              height: "100%",
              width: "100%"
            }}
            className="ag-theme-balham"
            onKeyDown={this.onKeyDown.bind(this)}
          >
            <AgGridReact
            columnDefs={this.state.columnDefs}
            defaultColDef={this.state.defaultColDef}
            enableRangeSelection={true}
            rowSelection={this.state.rowSelection}
            clipboardDeliminator={this.state.clipboardDeliminator}
            onGridReady={this.onGridReady.bind(this)}
            rowData={this.state.rowData}
          />
    
          </div>
        </div>
        <div className="button-bar">
          <button onClick={this.sizeToFit.bind(this)}>Size to Fit</button>
          <button onClick={this.autoSizeAll.bind(this)}>Auto-Size All</button>
        </div>
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        { headerName: "Make", field: "make" },
        { headerName: "Model", field: "model" },
        { headerName: "Price", field: "price" }
      ],
      rowData: [
        { make: "Toyota", model: "Celica", price: 35000 },
        { make: "Ford", model: "Mondeo", price: 32000 },
        { make: "Porsche", model: "Boxter", price: 72000 }
      ]
    };
  }

  render() {
    return (
      <div
        className="ag-theme-balham"
        style={{
          height: "500px",
          width: "1000px",
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
