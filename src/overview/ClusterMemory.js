import React, { Component } from 'react';
import ClusterTimeseries from '../timeseries/ClusterTimeseries';
import uuid from 'uuid';
import queryLibrary from '../data/query-library';

class ClusterMemory extends Component {
    state = {
        key: uuid.v4(),
        rate: 1000,
        width: 400,
        query: queryLibrary.JMX_MEMORY_STATS.query,
    };

    render() {
        return (
            <div className="ClusterMemory">
                <h3>Heap Size (bytes)</h3>

                <ClusterTimeseries key={this.state.key}
                    query={this.state.query} 
                    width={this.state.width}
                    rate={this.state.rate}
                    displayProperty='heapUsed'
                />
            </div>
        )
    }
}

export default ClusterMemory;
