import ReactDom from 'react-dom';
import React from 'react';
import './index.css';

function getStatus(squares){
     let wincb = [
         [0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]
     ]

     for(let i =0;i<wincb.length;i++){
         let win = wincb[i];
         let s1 = win[0];
         let s2 = win[1];
         let s3 = win[2];

         if(squares[s1]!=null&&squares[s1]==squares[s2]&&squares[s2]==squares[s3]){
             return squares[s1];
         }
     }

     return null;
}

class Board extends React.Component{
    constructor(props){
        super();
    }    

    handleBoxClick(i){
       this.props.handleForBoxClick(i);
    }

    renderButton(i){
        return(
           <button onClick={()=>this.handleBoxClick(i)}>{this.props.boxes[i]=="null"?"":this.props.boxes[i]}</button>
        )
    }

    render(){
        return(
            <div className="board">
                <div className="title">
                    Tic Tac Toe
                </div>
                <div className="content">
                     <div className="ttt">
                         <div className="row">
                             {this.renderButton(0)}
                             {this.renderButton(1)}
                             {this.renderButton(2)}
                         </div>
                         <div className="row">
                             {this.renderButton(3)}
                             {this.renderButton(4)}
                             {this.renderButton(5)}
                         </div>
                         <div className="row">
                             {this.renderButton(6)}
                             {this.renderButton(7)}
                             {this.renderButton(8)}
                         </div>
                     </div>
                </div>
            </div>
        );
    }
}

class Display extends React.Component{
    constructor(props){
        super(props);
    }

    handleHistory(i){
        this.props.handlerForHistory(i);
    }

    render() {
        let gameTitle = null;
        if(this.props.gameStatus!=null){
            if(this.props.gameStatus=="Match Draw"){
                gameTitle = "Match Draw";
            }
            else{
               gameTitle = "Game Over " + this.props.gameStatus + " Wins";
            }
        }
        else{
            if(this.props.stepNumber%2==0){
                gameTitle = "Next Move For X";
            }
            else{
                gameTitle = "Next Move For O";
            }
        }

        let buttons = [];

        for(let i =0;i<=this.props.stepNumber;i++){
            let button = null;
            if(i==0){
                button = (<button key={i} onClick={()=>this.handleHistory(i)}>Go to Steps</button>);
            }
            else{
                button = (<button key={i} onClick={()=>this.handleHistory(i)}>Go to Step number {i}</button>);
            }

            buttons.push(button);
        }

        return (
            <div className='display'>
                <div className='title'>
                    {gameTitle}
                </div>
                <div className='content'>
                    <div className='history'>
                       {buttons}
                    </div>
                </div>
            </div>
        );
    }
}

class TTT extends React.Component{
    constructor(){
        super();
        this.state = {
            history : [
                [null,null,null,null,null,null,null,null,null]
            ],
            stepNumber : 0,
            gameStatus : null
        }
    }

    handleSquareClick(i){
        let oldHistory = this.state.history.slice();
        let lastIndexArray = oldHistory[oldHistory.length-1].slice();
        if(lastIndexArray[i]!=null){
            return;
        }

        lastIndexArray[i] = this.state.stepNumber%2==0?"X":"O";
        oldHistory.push(lastIndexArray);
        
        let status = getStatus(lastIndexArray);
        if(this.state.gameStatus!=null){
            return;
        }

        if(this.state.stepNumber==8&&this.gameStatus==null){
            status = "Match Draw"
        }

        this.setState({
            history : oldHistory,
            stepNumber : this.state.stepNumber +1,
            gameStatus : status
        })
    }

    moveToStep(i){
       let oldHistory = this.state.history.slice(0,i+1);
       let status = getStatus(oldHistory);
      
       this.setState({
           history : oldHistory,
           stepNumber : i,
           gameStatus : status
       })
    }

    render(){
        let squares = this.state.history[this.state.history.length-1];
        return(
            <>
              <Board handleForBoxClick={(i)=> this.handleSquareClick(i)} boxes={squares}></Board> 
              <Display stepNumber={this.state.stepNumber} gameStatus={this.state.gameStatus} handlerForHistory={(i)=>this.moveToStep(i)}></Display>
            </>
        );
    }
}

ReactDom.render(<TTT/>,document.getElementById("root"));