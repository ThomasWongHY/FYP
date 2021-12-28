import "./App.css";
import { FaPlusCircle } from "react-icons/fa";

function App() {
  return (
    <div className="App">
      {/* <h2>Start over</h2> */}
      {/* <img
         src="https://png.pngtree.com/png-vector/20191021/ourlarge/pngtree-vector-car-icon-png-image_1834527.jpg"
      /> */}
      <input className="address" type="text" placeholder="Enter any address" />
      <input className="address" type="text" placeholder="Enter any address" />
      <div className="stop-button">
        <FaPlusCircle />
        Add stop
      </div>
      <div className="goal">
        <div className="goal-title">Set your goal </div>
        <div className="goal-space">
          <div className="goal-words">
            <div className="goal-time">Enter your time weight(0-1):</div>
            <input className="input-number input-time " type="text" />
          </div>
          <div className="goal-words">
            <div className="goal-cost">Enter your cost weight(0-1):</div>
            <input className="input-number input-weight" type="text" />
          </div>
          <div className="warning">Time weight + cost must equal to 1</div>
        </div>
      </div>

      <div className="result">
        <div className="result-title">Result</div>
        <div className="result-space">
          <div className="result-words">
            <div className="result-time">Estimated Time:</div>
            <div className="result-number">30 mins</div>
          </div>
          <div className="result-words">
            <div className="result-cost">Estimated Cost:</div>
            <div className="result-number">$20</div>
          </div>
          <div className="result-words">
            <div className="result-vehicle">Required Vehicles:</div>
            <div className="result-number">2</div>
          </div>
        </div>
      </div>
      <div className="route">
        <button className="route-button">View Route Directions</button>
      </div>
    </div>
  );
}

export default App;
