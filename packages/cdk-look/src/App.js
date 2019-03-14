import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import {Treebeard, decorators} from 'react-treebeard';

import data from './data';
import styles from './styles';
import * as filters from './filter';
import ConstructDetails from './ConstructDetails';
import treeTheme from './tree-theme';

import './App.css';
import { constructIcon, smallImage } from './iconmap';

// Example: Customising The Header Decorator To Include Icons
decorators.Header = ({style, node}) => {
    const iconType = node.children ? 'folder' : 'file-text';
    const iconClass = `fa fa-${iconType}`;
    const iconStyle = {marginRight: '5px'};

    return (
        <div style={style.base}>
            <div style={style.title}>
                <i className={iconClass} style={iconStyle}/>

                {node.name}
            </div>
        </div>
    );
};

class App extends React.Component {
    constructor() {
        super();

        this.state = {data};
        this.onToggle = this.onToggle.bind(this);
    }

    onToggle(node, toggled) {
        const {cursor} = this.state;

        if (cursor) {
            cursor.active = false;
        }

        node.active = true;
        if (node.children) {
            node.toggled = toggled;
        }

        this.setState({cursor: node});
    }

    onFilterMouseUp(e) {
        const filter = e.target.value.trim();
        if (!filter) {
            return this.setState({data});
        }
        var filtered = filters.filterTree(data, filter);
        filtered = filters.expandFilteredNodes(filtered, filter);
        this.setState({data: filtered});
    }

    render() {
        const {data: stateData, cursor} = this.state;

        return (
          <div>
            <div style={styles.sideBar}>
                <div style={styles.searchBox}>
                    <div className="input-group">
                        <span className="input-group-addon">
                          <i className="fa fa-search"/>
                        </span>
                        <input className="form-control"
                               onKeyUp={this.onFilterMouseUp.bind(this)}
                               placeholder="Search the tree..."
                               type="text"/>
                    </div>
                </div>
                <div style={styles.component}>
                    <Treebeard data={stateData}
                               decorators={{
                                   ...decorators,
                                   Header(props) {
                                        return (
                                            <div style={{...props.style, display: 'inline-block', height: '1.8em' }}>
                                                {constructIcon(props.node.constructData, false, smallImage)}
                                                {props.node.name}
                                            </div>
                                        );
                                   }
                               }}
                               style={treeTheme}
                               onToggle={this.onToggle}/>
                </div>
            </div>
            <div style={styles.mainPane}>
                <ConstructDetails node={cursor}/>
            </div>
          </div>
        );
    }
}

export default App;