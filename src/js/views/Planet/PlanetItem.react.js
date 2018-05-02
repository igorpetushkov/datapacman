var React = require('react');

var PlanetItem = React.createClass({
    render: function() {
        return (
            <span className="planetItem">
                {this.props.value}
            </span>
        );
    }
});

module.exports = PlanetItem;
