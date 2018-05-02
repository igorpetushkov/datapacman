var React = require('react');
var Label = require('react-bootstrap').Label;

var Tree = React.createClass({
    render: function() {
        return (
            <h4>
                <Label onClick={this.props.onClickTree}>
                    {this.props.value}
                </Label>
            </h4>
        );
    }

});

module.exports = Tree;
