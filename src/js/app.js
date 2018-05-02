var React = require('react');
window.React = React; // just for http://fb.me/react-devtools

var Stores = require('./stores/Stores');
var MainApp = require('./views/MainApp.react.js');
var Constants = require('./constants/Constants');


Stores.initAll([
    Constants.StoreType.RAM,
    Constants.StoreType.TREE
]);

React.render(
    <MainApp />,
    document.getElementById('app')
);
