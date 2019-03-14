'use strict';

export default {
  sideBar: {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    width: 500,
    overflowX: 'auto',
    overflowY: 'auto',
    backgroundColor: '#21252B',
    whiteSpace: 'nowrap',
  },
  mainPane: {
    // This is shit. Flexbox is probably better but I don't
    // feel like figuring out how that works right now.
    marginLeft: 500,
    padding: '1em',
  },
    component: {
        width: '50%',
        display: 'inline-block',
        verticalAlign: 'top',
        padding: '20px',
        '@media (max-width: 640px)': {
            width: '100%',
            display: 'block'
        }
    },
    searchBox: {
        padding: '20px 20px 0 20px'
    },
    viewer: {
        fontSize: '12px',
        whiteSpace: 'pre-wrap',
        padding: '20px',
        color: 'black',
        minHeight: '250px'
    }
};