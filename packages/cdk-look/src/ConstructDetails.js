import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import {Treebeard, decorators} from 'react-treebeard';

import data from './data';
import styles from './styles';
import * as filters from './filter';
import { constructIcon, image } from './iconmap';

const HELP_MSG = 'Select A Node To See Its Data Structure Here...';

export default class ConstructDetails extends React.Component {
    render() {
        const constructData = this.props.node && this.props.node.constructData;

        if (!constructData) {
            return <div>{HELP_MSG}</div> ;
        }

        const style = styles.viewer;
        return (<div>
            <h1>{constructIcon(constructData, true, image)} {constructData.id}</h1>
            <div className='construct-path'>{constructData.path}</div>
            <table style={{
              border: 'solid 1px grey'
            }}>
              {Object.entries(constructData.metadata || {}).map(([k, v]) =>
                <tr key={k}>
                  <th>{k}</th>
                  <td>{v}</td>
                </tr>
              )}
            </table>
            <pre>
              {JSON.stringify(constructData, undefined, 2)}
            </pre>
          </div>);
    }
}
ConstructDetails.propTypes = {
    node: PropTypes.object
};

