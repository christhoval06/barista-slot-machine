import React from './../lib/react/react.js';
import ReactDOM from './../lib/react/react-dom.js';

export class Reel extends React.Component {
    constructor(props){
        super();

        // props.items is the unique items on this reel
        // repeat items while less than props.numItems
        // to hold ~ 20 items per reel (configurable)

        this.items = [];

        while (props.numItems > this.items.length){
            var i = Math.floor(Math.random() * props.items.length);
            this.items.push(props.items[i]);
        }

        this.currentIndex = 1;
        this.currentType = this.items[this.currentIndex].type;
        this.spinning = false;
        this.height = 0;
        this.winner = false;


        this.state = {
            items: this.items.slice(0), // copy
            style: { top: 0 }
        };

        // bind method context
        [this.__offsetTop, this.__renderItems, this.spin, this.__extendReel, this.setWinner]
            .forEach(m => m.bind(this));
    }

    __offsetTop(index){
        var dest = ReactDOM.findDOMNode(this.refs.reel)
            .querySelectorAll('.reel-item[data-index="' + index + '"]');
        // since three are visible and the middle elements where
        // it should be displayed, add one element height to the top
        return dest[0].offsetTop - 72; // 72 is a single reel-item height todo: calculate
    }

    __extendReel(fn){
        // push another reel onto the state items
        Array.prototype.push.apply(this.state.items, this.items);
        this.setState({ items: this.state.items }, (fn || () => {}).bind(this));
    }

    __afterSpin(){
        // a spin leaves two reels above the newly visible elements
        // these can be cleaned up to keep the DOM light
        this.currentIndex = this.currentIndex % this.props.numItems;    // new index will be rmainder
        var newItems = this.state.items.slice(this.props.numItems * 2); // new items, [numItems*2:]

        // remove previous items
        this.setState({items: newItems }, () => {
            // preserve top position after adjustment
            var top = this.__offsetTop(this.currentIndex);
            this.setState({style: { top: -(top) }, winner: this.winner});
            this.spinning = false;
        });
    }

    __renderItems(){
        return this.state.items.map((item, index) => {
            return (
            <div
                className={'row reel-item ' + (this.state.winner &&  this.currentIndex === index ? 'winner' : '')}
                data-type={item.type}
                data-index={index}
                key={index}>{item.name}
            </div>);
        });
    }

    setWinner(){
        this.winner = true;
    }

    spin(position){
        // position is the index destination target for a single reel
        // e.g. position is between 0 (inclusive) and numItems (exclusive)
        if (this.spinning) return;

        // reset winner on new spin
        this.setState({ winner: false });
        this.winner = false;

        // todo: validate position range
        this.currentType = this.items[position].type;
        this.spinning = true;

        // append items
        this.__extendReel();
        // and again for a longer spin effect
        this.__extendReel(() => {
            // spin through 2 reels before landing on the target
            var indexDelta = (this.props.numItems * 2) - this.currentIndex + position,
                destinationIndex = this.currentIndex + indexDelta,
                duration = Math.round(Math.random() * 3) + 3, // random duration 3-6 sec
                top = this.__offsetTop(destinationIndex);

            // update index and start animation
            this.currentIndex = destinationIndex;
            this.setState({ style: { top: -(top), transition: 'top ' + duration + 's' }}, () => {
                // cleanup after the spin animation duration completes
                setTimeout(this.__afterSpin.bind(this), duration * 1000);
            });
        });
    }

    // lifecycle methods
    render() {
        return (
        <div className="four columns reel-wrapper">

            { this.props.debug ? <ReelDebug
                top={this.state.style.top}
                count={this.state.items.length}
                dest={this.currentIndex}
                winner={this.winner}
                type={this.currentType} /> : null }

            <div ref="reel" style={this.state.style} className="reel">
                { this.__renderItems() }
            </div>
        </div>
        );
    }
}

Reel.defaultProps = { numItems: 20 };


export class ReelDebug extends React.Component {
    constructor(props){
        super();
        this.state = props;
    }
    componentWillReceiveProps(props){
        this.setState(props);
    }
    render(){
        return (
        <div className="reel-debug">
            <ul>
                <li><label>Type</label><span>{this.state.type}</span></li>
                <li><label>Win</label><span>{this.state.winner ? 'yes' : 'no'}</span></li>
                <li><label>Index</label><span>{this.state.dest}</span></li>
                <li><label>Items</label><span>{this.state.count}</span></li>
                <li><label>Top</label><span>{this.state.top}px</span></li>
            </ul>
        </div>)
    }
}

ReelDebug.defaultProps = { dest: 0, count: 0, top: 0, winner: false, type: '' };