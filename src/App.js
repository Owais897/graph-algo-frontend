import "./App.css";
import { useEffect, useState } from "react";
import Graph from "react-graph-vis";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { Row, Col, Button, Tag } from "antd";
import { Select } from "antd";
import { Layout, Menu, Breadcrumb } from "antd";
import {
  UserOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from "@ant-design/icons";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const { Option } = Select;

function App() {
  let edge = [];
  let node = [];
  const [m, setEdge] = useState([]);
  console.log("m: ", m);

  const [n, setNode] = useState([]);
  console.log("n: ", n);
  const [response, setResponse] = useState([]);
  const [algo, setAlgo] = useState("getDijkastra");
  let algos = [
    { key: "getDijkastra", value: "Dijkastra" },
    { key: "getBellmanFord", value: "BellmanFord" },
    { key: "getFloydWarshall", value: "FloydWarshall" },
    { key: "getKruskal", value: "Kruskal" },
    { key: "getPrims", value: "Prims" },
    { key: "getBoruvka", value: "Boruvka" },
    { key: "getCluster", value: "Cluster" },
  ];
  console.log("algo: ", algo);
  function handleChange(value) {
    console.log(`selected ${value}`);
    setAlgo(value);
    setResponse([]);
  }
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
  const runAlgo = async () => {
    let res = await axios.request({
      method: "PUT",
      url: `http://localhost:4000/api/v1/kpis/${algo}`,
      data: graph,
    });
    console.log("res: ", res.data);
    setResponse([...res.data]);
  };

  return (
    <div className="App">
      <Layout>
        <Header className="header" style={{ height: 70 }}>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
            <Menu.Item key="1">Algo Project</Menu.Item>
            <Menu.Item style={{ marginLeft: 50 }} key="2">
              <input type="file" onChange={showFile} />
            </Menu.Item>
            {/* <Menu.Item key="3">owais</Menu.Item> */}
          </Menu>
        </Header>
      </Layout>

      {/* <input type="file" onChange={showFile} />
      <button
        onClick={() => {
          runAlgo();
        }}
      >
        get api call
      </button> */}
      <Row>
        <Col span={18} style={{ backgroundColor: "gray" }}>
          <Graph
            key={uuidv4}
            graph={graph}
            options={options}
            events={events}
            getNetwork={(network) => {
              //  if you want access to vis.js network api you can set the state in a parent component using this property
            }}
          />{" "}
        </Col>
        <Col span={6} style={{ backgroundColor: "#92e083" }}>
          select algorithm
          <Select
            defaultValue="getDijkastra"
            style={{ width: 120 }}
            onChange={handleChange}
          >
            {algos.map((v) => {
              return (
                <Option key={v.key} value={v.key}>
                  {v.value}
                </Option>
              );
            })}
          </Select>
          <Button
            onClick={() => {
              runAlgo();
            }}
          >
            Run
          </Button>
          <br />
          {response.length ? (
            <div>
              {algo === "getFloydWarshall" &&
                response?.map((v) => {
                  return v
                    ? v?.map((k, i) => {
                        return (
                          <>
                            <Tag color="geekblue">row {i}</Tag>
                            <br />
                            {k?.map((l) => {
                              return <Tag color="success">{l ?? "null"}</Tag>;
                            })}
                            <br />
                          </>
                        );
                      })
                    : "";
                })}
              {
                // [].includes(algo)&&
                algo !== "getFloydWarshall" &&
                  response.map((v) => {
                    return <Tag color="success">{v}</Tag>;
                  })
              }
            </div>
          ) : (
            ""
          )}
        </Col>
      </Row>
      <div style={{ backgroundColor: "red", width: "70%" }}></div>
    </div>
  );
}

export default App;
