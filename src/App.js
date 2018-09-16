import React, { Component } from "react";
import { Cypher } from "graph-app-kit/components/Cypher";
import {
  GraphAppBase,
  ConnectModal,
  CONNECTED
} from "graph-app-kit/components/GraphAppBase";
import { Render } from "graph-app-kit/components/Render";
import "./App.css";
import "semantic-ui-css/semantic.min.css";
import JMXComponent from './jmx/JMXComponent';
import Neo4jConfiguration from './configuration/Neo4jConfiguration';
import ActiveQueries from './performance/ActiveQueries';
import PerformancePane from './performance/PerformancePane';
import DBSize from './performance/DBSize';
import PermissionsPane from './configuration/PermissionsPane';
import { Tab } from 'semantic-ui-react'

const neo4j = require("neo4j-driver/lib/browser/neo4j-web.min.js").v1;

const renderJMX = ({ pending, error, result }) => {
  return pending ? (
    <div style={{ height: "60px" }}>pending</div>
  ) : error ? (
    <div style={{ height: "60px" }}>{error.message}</div>
  ) : result ? (
    <JMXComponent data={result} />
  ) : null;
};

class Halin extends Component {
  state = {
    cTag: 1
  };

  reRunManually = () => {
    this.setState(state => ({ cTag: state.cTag + 1 }));
  };
  render() {
    const panes = [
      {
        menuItem: 'Permissions',
        render: () => <PermissionsPane/>,
      },
      {
        menuItem: 'System Performance',
        render: () => <PerformancePane/>,
      },
      {
        menuItem: 'Database Size',
        render: () => <DBSize/>,
      },
      {
        menuItem: 'Active Queries',
        render: () => <ActiveQueries />,
      },
      {
        menuItem: 'Configuration',
        render: () => <Neo4jConfiguration />,
      },
      {
        menuItem: 'JMX / Diagnostics',
        render: () => <Cypher query="CALL dbms.queryJmx('*:*')" render={renderJMX} interval={3000} />,
      },
    ]

    return (
      <div className="App" key="app">
        <header className="App-header">
          <h1 className="App-title">Halin Neo4j Monitoring</h1>
        </header>

        <Render if={this.props.connected}>
          <div className='MainBody'>
            <Tab panes={panes} />
          </div>
        </Render>
      </div>
    );
  }
}

const App = () => {
  return (
    <GraphAppBase
      driverFactory={neo4j}
      integrationPoint={window.neo4jDesktopApi}
      render={({ connectionState, connectionDetails, setCredentials }) => {
        return [
          <ConnectModal
            key="modal"
            errorMsg={connectionDetails ? connectionDetails.message : ""}
            onSubmit={setCredentials}
            show={connectionState !== CONNECTED}
          />,
          <Halin key="app" connected={connectionState === CONNECTED} />
        ];
      }}
    />
  );
};

export default App;
