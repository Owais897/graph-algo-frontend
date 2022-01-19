import "./App.css";
import { useEffect, useState } from "react";
import Graph from "react-graph-vis";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

function App() {
  let edge = [];
  let node = [];
  const [m, setEdge] = useState([]);
  console.log("m: ", m);

  const [n, setNode] = useState([]);
  console.log("n: ", n);

  let graph = {
    nodes: n,
    edges: m,
  };

  const options = {
    layout: {
      hierarchical: false,
    },
    edges: {
      color: "#000000",
    },
    height: "500px",
  };

  const events = {
    select: function (event) {
      var { nodes, edges } = event;
    },
  };
  const showFile = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;

      let a = text.split("\n");

      let no = parseInt(a[2]);
      //
      for (let i = 0; i < no; i++) {
        node.push({ id: i, label: `Node ${i}` });
      }

      for (let i = no + 5; i < a.length - 3; i++) {
        let ed = a[i];

        let edg = ed.split("\t");
        //
        for (let j = 1; j < edg.length - 2; j += 4) {
          edge = edge.concat({
            from: edg[0],
            to: edg[j],
            weight: parseFloat(edg[j + 2]),
            id: Math.random(),
          });
        }
      }

      console.log("edge: ", edge);
      setEdge([...edge]);

      console.log("node111111: ", node);
      setNode([...node]);
      console.log("node2222222: ", node);
    };
    reader.readAsText(e.target.files[0]);
  };
  const getDijkastra = async () => {
    await axios.request({
      method: "PUT",
      url: `http://localhost:4000/api/v1/kpis/getCluster`,
      data: graph,
    });
  };

  return (
    <div className="App">
      owais
      <input type="file" onChange={showFile} />
      <button
        onClick={() => {
          getDijkastra();
        }}
      >
        get api call
      </button>
      <div style={{ backgroundColor: "red", width: "70%" }}>
        <Graph
          key={uuidv4}
          graph={graph}
          options={options}
          events={events}
          getNetwork={(network) => {
            //  if you want access to vis.js network api you can set the state in a parent component using this property
          }}
        />
      </div>
    </div>
  );
}

export default App;
