import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

// TO DO : implement checkbox using npm react-bootstrap-toggle, won't work on codepen

const buttonColors = ['g', 'r', 'y', 'b'];
// win = 20 steps

class Game extends React.Component {

  state = {
    isOn: false,
    isStrictMode: false,
    stepsNumber: 0,
    stepsArray: [],
    playerSteps: [],
    buttons : {
      "g" : {
        isActive: false,
        sound: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3")
      },
      "r" : {
        isActive: false,
        sound: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3")
      },
      "y": {
        isActive: false,
        sound: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3")
      },
      "b" : {
        isActive: false,
        sound: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3")
      }
    }
  };
  
  constructor(props) {
    super(props);

    this.toggleOnOff = this.toggleOnOff.bind(this);
    this.toggleStrictMode = this.toggleStrictMode.bind(this);
    this.startGame = this.startGame.bind(this);
    this.increaseSteps = this.increaseSteps.bind(this);
    this.repeatLastStep = this.repeatLastStep.bind(this);
    this.getRandomColorButton = this.getRandomColorButton.bind(this);
    this.checkIfPlayerMadeCorrectSteps = this.checkIfPlayerMadeCorrectSteps.bind(this);
    this.waitForPlayerToMakeSteps = this.waitForPlayerToMakeSteps.bind(this);
    this.flashSteps = this.flashSteps.bind(this);
    this.resetAndRestartGame = this.resetAndRestartGame.bind(this);
    this.handleClick = this.handleClick.bind(this);    

  }

  toggleOnOff() {
    this.setState({
      isOn: !this.state.isOn,
      isStrictMode: false,
      stepsNumber: 0,
      stepsArray: [],
      playerSteps: [],
    });
  }


  toggleStrictMode() {
    this.setState({
      isStrictMode: !this.state.isStrictMode
    });
  }


  resetAndRestartGame() {
    this.setState({
      stepsNumber: 0,
      stepsArray: [],
      playerSteps: [],
    }, () => etTimeout(this.startGame, 5000));
  }

  getRandomColorButton() {
    return buttonColors[Math.floor(Math.random() * buttonColors.length)];
  }

  checkIfPlayerMadeCorrectSteps() {
    // playerSteps array === stepsArray[-1] at this moment
    const { playerSteps, stepsArray, isOn, stepsNumber, isStrictMode } = this.state;

    if (_.isEqual(playerSteps, stepsArray[stepsArray.length - 1])) {
     // reset his steps and continue with the steps
     if (isOn && playerSteps.length == 20) {
        alert("Victory, you won! Congrats, you're the best! Game will start again in 5 seconds");
       this.resetAndRestartGame();
     }
     else {
      this.setState({
        playerSteps: []
      }, () => {
            if (isOn) {
              this.increaseSteps();
            }
      });
    }
    } 
    else {  // player made a mistake
      this.setState({
        playerSteps: []
      },  () => {
            if (isOn) 
            {
              const stepsNumberCopy = stepsNumber;
              this.setState({
                stepsNumber: "!!"          // simulate !! flash and then set it back
              }, () => setTimeout( () =>
                          this.setState({
                            stepsNumber: stepsNumberCopy
                          }, () => {
                                      if (!isStrictMode) {
                                        this.repeatLastStep();
                                      }
                                      else {
                                        this.resetAndRestartGame(); // aka reset game
                                      }
                                  }),
                          2500)
                        );
            }
    });
    }
  }


  waitForPlayerToMakeSteps() {
    const { stepsNumber } = this.state;
    setTimeout(() => {
        this.checkIfPlayerMadeCorrectSteps();
    }, (stepsNumber + 2) * 1000);   // wait for the player to make the same steps (wait time: numberOfSteps + 2 second bonus time)
  }


  flashSteps(steps, newStepsArray) {

    const setInactive = function(btn) {
      const objForUpdate = {buttons : {
        "g" : {
          isActive: false
        },
        "r" : {
          isActive: false
        },
        "y": {
          isActive: false
        },
        "b" : {
          isActive: false
        }
     }};

      objForUpdate.buttons[btn].isActive = false;
      this.setState(_.merge({}, this.state, objForUpdate)); // immutable.js to use

    }.bind(this);

    const setActive = function(btn) {
      const objForUpdate = {buttons : {
        "g" : {
          isActive: false
        },
        "r" : {
          isActive: false
        },
        "y": {
          isActive: false
        },
        "b" : {
          isActive: false
        }
     }};

      objForUpdate.buttons[btn].isActive = true;
      this.state.buttons[btn].sound.play();
      this.setState(_.merge({}, this.state, objForUpdate), () => setTimeout(setInactive, 500, btn));   /// immutability would be better, thinking of using immutable.js seriously

    }.bind(this);


    const flashButtons = function(i) {
      if (i < steps.length) {
        setActive(steps[i]);
        setTimeout(flashButtons, 800, i+1);
      } 
      else {
        this.setState({
          stepsArray: newStepsArray
        }, this.waitForPlayerToMakeSteps);
      }
    }.bind(this);

    flashButtons(0);

  }

  repeatLastStep() {
    const { stepsNumber, stepsArray} = this.state;

    const newStepsArray = JSON.parse(JSON.stringify(stepsArray)); // immutability / use immutable.js
    const length = newStepsArray.length - 1;
    const steps = length >= 0 ? newStepsArray[length].slice() : [];
    newStepsArray.push(steps);
    this.flashSteps(steps, newStepsArray);

  }

  increaseSteps() {
    const { stepsNumber, stepsArray} = this.state;

    const newStepsArray = JSON.parse(JSON.stringify(stepsArray)); // immutability / use immutable.js
    const length = newStepsArray.length - 1;
    const steps = length >= 0 ? newStepsArray[length].slice() : [];
    const randomColor = this.getRandomColorButton();
    steps.push(randomColor);
    newStepsArray.push(steps);
    this.setState({
       stepsNumber: stepsNumber + 1,
    }, this.flashSteps(steps, newStepsArray));
    

  }


  startGame() {
    const { isOn } = this.state;
    if (isOn) this.increaseSteps();
  }


  handleClick(value, event) {
    const { playerSteps, buttons} = this.state;

    buttons[value].sound.play();
    const newPlayerSteps = JSON.parse(JSON.stringify(playerSteps)); // immutability
    newPlayerSteps.push(value);
    this.setState({
      playerSteps: newPlayerSteps
    });;
  }

  render() {
    const count = this.state.stepsNumber;
    const { isOn, isStrictMode } = this.state;

    return  (
     <div className="row">
          <div className="col-md-12 col-sm-12 col-12">
              <div className="game-container">
                <div className="top-row">
                  <div className={this.state.buttons["g"].isActive ? "active green button flip" : "green button flip"} onClick={this.handleClick.bind(this, "g")}></div>
                  <div className={this.state.buttons["r"].isActive ? "active red button mirror-flip vert-flip" : "red button mirror-flip vert-flip"}  onClick={this.handleClick.bind(this, "r")}></div>
                </div>
                <div className="center">
                      <div className="title-container"><h2>Simon</h2></div>
                      <div className="count-container">
                        <div className="count"><span>{ isOn ? count: "" }</span></div>
                        <label >count</label>
                      </div>
                      
                      <div className="start-container">
                        <div className="start" onClick={this.startGame}></div>
                        <label >start</label>                        
                      </div>
                      
                      <div className="strict-container">
                        <div className="strict" onClick={this.toggleStrictMode}></div>
                        <label className={isStrictMode ? "active" : ""} >strict</label>
                      </div>
                      
                      <div className="checkbox-container">
                        <input id="on-off-chbx" className="on-off" onClick={this.toggleOnOff}  type="checkbox" value="None"/>
                        <label htmlFor="on-off-chbx"></label>
                      </div>
                 </div>
                <div className="bottom-row">
                  <div className={this.state.buttons["y"].isActive ? "active yellow button" : "yellow button"} onClick={this.handleClick.bind(this, "y")}></div>
                  <div className={this.state.buttons["b"].isActive ? "active blue button mirror-flip" : "blue button mirror-flip"} onClick={this.handleClick.bind(this, "b")}></div>
                </div>
              </div>
          </div>
     </div>
        );
  }
}



ReactDOM.render(<Game/> , document.getElementById("app"));