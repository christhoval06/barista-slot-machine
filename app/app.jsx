import React from './../lib/react/react.js';
import ReactDOM from './../lib/react/react-dom.js';
import { Reel } from './reel.jsx';

class ReelItem {
    constructor(type, name) {
        this.type = type;
        this.name = name;
    }
}

export class App extends React.Component {

    constructor(){
        super();
        this.state = { debug: false, message: 'Try your luck.' };
        this.spin.bind(this);
        this.spinAll.bind(this);
        this.toggleDebugMode.bind(this);
    }

    componentDidMount(){
        this.reels = [ this.refs.reel1, this.refs.reel2, this.refs.reel3 ];
    }

    toggleDebugMode(e){
        this.setState({ debug: !this.state.debug });
    }

    spinAll(e){
        // ignore requests to play before the reels are done spinning
        if(this.reels.some(r => r.spinning)){
            e.preventDefault();
            return;
        }
        this.setState({ message: 'Reeeeeeling...'});
        // `spin` returns the type result of the spin
        // if all the reels produced the same type
        // then we have a winner
        var types = this.reels.map(this.spin);

        // e.g. types[0] === types[1] && types[0] === types[2]
        var winner = new Set(types).size === 1;

        if(winner){
            this.reels.forEach(r => r.setWinner());
        }

        setTimeout(() => {
            this.setState({message: winner ?
                'Lucky you, jackpot! You get ' + types[0] + '.' :
                'Better luck next time, try again!'
            });
        }, 5500);
    }

    spin(reel){
        // random number 0...19
        var n = Math.floor(Math.random() * reel.props.numItems);
        reel.spin(n);
        return reel.currentType;
    }

    render() {
        return (
        <div className="center">
            <nav className="row">
                <h1>Barista Slot Machine</h1>
            </nav>
            <div className="row actions">
                <h4 className="seven columns">{this.state.message}</h4>
                <div className="five columns">
                    <button className="u-pull-right button-play button-primary" onClick={this.spinAll.bind(this)}>Play</button>
                    <button className={'u-pull-right ' + (this.state.debug ? 'button-primary' : '')}  onClick={this.toggleDebugMode.bind(this)}>Debug Mode</button>
                </div>
            </div>
            <div className={'slot-machine row twelve columns ' + (this.state.debug ? 'debug' : '')}>
                <Reel ref="reel1" debug={this.state.debug} items={[
                    new ReelItem('coffee', 'Coffee Maker'),
                    new ReelItem('tea', 'Teapot'),
                    new ReelItem('espresso', 'Espresso Machine') ]} />

                <Reel ref="reel2" debug={this.state.debug} items={[
                    new ReelItem('coffee', 'Coffee Filter'),
                    new ReelItem('tea', 'Tea Strainer'),
                    new ReelItem('espresso', 'Espresso Tamper') ]} />

                <Reel ref="reel3" debug={this.state.debug} items={[
                    new ReelItem('coffee', 'Coffee Grounds'),
                    new ReelItem('tea', 'Loose Tea'),
                    new ReelItem('espresso', 'Ground Espresso Beans') ]} />
            </div>
        </div>
        );
    }
}

ReactDOM.render(<App/>, document.querySelector("#main"));
