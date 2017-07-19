import * as React from "react";
import * as ko from 'knockout';

export interface HelloProps { compiler: string, framework: string };

class PickerTeam {
    public expectedWin = 0;
    public historicWins = 0;
    public historicGames = 0;

    public defence = '';
    public offence = '';

    public get historicWin() {
        return this.historicGames > 0 ? this.historicWins / this.historicGames : 0;
    }
}

class PickerState{
    public red = new PickerTeam;
    public blu = new PickerTeam;
}

export class Picker extends React.Component<{}, PickerState> {

    /**
     *
     */
    constructor() {
        super();
        
        this.state = new PickerState;
    }

    render() {
        window.setTimeout(()=>{  this.setState(Object.assign({'red.expectedWin': 23}, this.state))}, 1000);

        this.state.red.defence = 'Beavis';
        this.state.red.offence = 'Butthead';

        this.state.blu.defence = 'Hutch';
        this.state.blu.offence = 'Starsky'

        return <div className="picker">
            <div className="row">
                <div className="red column">
                    <div>&nbsp;</div>
                    <div>{this.state.red.defence}</div>
                    <div>{this.state.red.offence}</div>

                    <div className="row">
                        <div className="column">
                            <div>{this.state.red.historicWins}/{this.state.red.historicGames}</div>
                            <div>{this.state.red.historicWin}</div>
                        </div>

                        <div className="large-label">{this.state.red.expectedWin}</div>
                    </div>
                </div>

                <div className="blu column">
                    <div className="row">
                        <div className="large-label">{this.state.blu.expectedWin}</div>

                        <div className="column">
                            <div>{this.state.blu.historicWins}/{this.state.blu.historicGames}</div>
                            <div>{this.state.blu.historicWin}</div>
                        </div>
                    </div>
                    <div>{this.state.blu.offence}</div>
                    <div>{this.state.blu.defence}</div>
                    <div>&nbsp;</div>
                </div>
            </div>
        </div>
    }
}