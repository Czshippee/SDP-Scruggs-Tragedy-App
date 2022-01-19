import React, { useState, useEffect, Component } from "react"
import "semantic-ui-css/semantic.min.css"
import { Table, List, Button, Grid, Modal, ModalHeader, ModalActions } from "semantic-ui-react";
import "./hostRoundSummary.css"
import { Prompt } from "react-router-dom"

import { useMediaQuery } from 'react-responsive';

//import { Card } from 'antd'
import ReactEcharts from 'echarts-for-react'
//import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/markPoint'
//npm install --save echarts-for-react
import 'echarts/lib/component/toolbox';

const emptyObject = (obj) => {
  return JSON.stringify(obj) === '{}'; 
}

const roundHostPie = (data) => {
  if (emptyObject(data)) return
  var size = 0
  var farmSum = 0
  var pastSum = 0
  var resSum = 0
  for (var key in data) {
    if (key === "roundData") {
      continue
    } else {
      size++
      const pd = data[key]
      farmSum = farmSum + pd["farmingAmount"]
      pastSum = pastSum + pd["pastureAmount"]
      resSum = resSum + pd["reserveAmount"]
    }
  }
  const total = size * 10
  const farmProp = farmSum / total
  const pastProp = pastSum / total
  const resProp = resSum / total

  return (
    {
      title: {
        text: 'Proportion of Allocations',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          type: 'pie',
          radius: '50%',
          data: [
            { value: pastProp, name: 'Pasturing' },
            { value: farmProp, name: 'Farming' },
            { value: resProp, name: 'Reserve' },
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
  )
}

const roundHostPlayerLine = (gameStat) => {
  if (emptyObject(gameStat)) return
  console.log(gameStat)
  const round = gameStat["roundArray"]
  const min = gameStat["minArray"]
  const avg = gameStat["avgArray"]
  const max = gameStat["maxArray"]
  const opt = gameStat["optArray"]

  return (
    {
      title: {
        text: 'Individual Round Score'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {},
      toolbox: {
        show: true,
        feature: {
            dataZoom: {
                yAxisIndex: "none"
            },
            dataView: {
                readOnly: false
            },
            restore: {},
            saveAsImage: {
                type: 'jpg',
            },
        }
    },
      xAxis: {
        type: 'category',
        data: round
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: "Minimum",
          type: 'line',
          data: min,
          stack:{},
          itemStyle: {color: 'red'}
        },
        {
          name: 'Average',
          type: 'line',
          data: avg,
          itemStyle: {color:'gold'}
        },
        {
          name: 'Maximum',
          type: 'line',
          data: max,
          stack:{},
          itemStyle:{color: 'blue'}
        },
        {
          name: 'Optimal',
          type: 'line',
          data: opt,
          itemStyle:{color: 'green'}
        }
      ]
    }
  )

}

const roundHostGroupBar = (data) => {
  if (emptyObject(data)) return
  const group = data["roundData"]["groupRoundScore"]
  const opt = data["roundData"]["optimalRoundScore"]

  return (
    {
      title: {
        text: 'Group Round Score',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      legend: {},
      xAxis: [
        {
          type: 'category',
          data: ['Round Score'],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Group Round Score',
          type: 'bar',
          barWidth: '40%',
          data: [group]
        },
        {
          name: 'Optimal Round Score',
          type: 'bar',
          barWidth: '40%',
          data: [opt]
        }
      ]
    }
  )
}

const HostRoundSummary = (props) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  console.log("emtpty: ", props.emptyObject)

  useEffect(() => {
    window.addEventListener("beforeunload", alertUser);
    return () => {
      window.removeEventListener("beforeunload", alertUser);
    }
  })
  const alertUser = (e) => {
    e.preventDefault();
    e.returnValue = " ";
  }

  return (
    <div className="host-results-screen">
      <Prompt when={true} message="WARNING: By leaving this page, the game will end. Do you want to leave?" />
      <div className="host-results-box">
        {/* <div className="round-header">
                Results of Round
            </div>
    
      {/*<List inverted divided verticalAlign="middle">
        <List.Header className="list-head">
          <Grid columns={2} verticalAlign="middle">
            <Grid.Column>Player</Grid.Column>
            <Grid.Column text align="center">
              Cows Allocated
            </Grid.Column>
          </Grid>
        </List.Header> */}

        <div className="round-header">Round Leaderboard</div>
        <section class="tabcenter">

          <div class="table__wrapper">
            <table className="table" >

              <thead>
                <tr>
                  <th scope="col">Player</th>
                  <th scope="col">Game Score</th>
                  <th scope="col">Round Score</th>
                  <th scope="col">Farming</th>
                  <th scope="col">Pasturing</th>
                  <th scope="col">Reserve</th>
                  <th scope="col">Farming Score</th>
                  <th scope="col">Pasturing Score</th>
                  <th scope="col">Reserve Score</th>

                </tr>
              </thead>

              <tbody>{props.table.slice(0, props.table.length).map((row, index) => {
                return (
                  <tr>
                    <td data-header="Player" key={index[0]}>{row[0]}</td>
                    <td key={index[1]} data-header="Game Score">{row[1]}</td>
                    <td key={index[2]} data-header="Round Score">{row[2]}</td>
                    <td key={index[3]} data-header="Farming">{row[3]}</td>
                    <td key={index[4]} data-header="Pasturing">{row[4]}</td>
                    <td key={index[5]} data-header="Reserve">{row[5]}</td>
                    <td key={index[6]} data-header="Farming Score">{row[6]}</td>
                    <td key={index[7]} data-header="Pasturing Score">{row[7]}</td>
                    <td key={index[8]} data-header="Reserve Score">{row[8]}</td>
                  </tr>
                )
              })}</tbody>
            </table>
          </div>
        </section>
        <div className="host-buttons" style={{ paddingTop: "30px" }}>
          <Modal
            onClose={() => setConfirmOpen(false)}
            onOpen={() => setConfirmOpen(true)}
            open={confirmOpen}
            trigger={<Button
              inverted
              size="massive"
              color="black"
              style={{ width: "275px" }}
              disabled={props.emptyObject}
              >Show Graphs</Button>}
          >
            <Modal.Header>Group Results</Modal.Header>
            <Modal.Description>
              <ReactEcharts option={roundHostPie(props.data)} />
              <ReactEcharts option={roundHostPlayerLine(props.gameStat)} />
              <ReactEcharts option={roundHostGroupBar(props.data)} />

            </Modal.Description>
            <Modal.Actions>
              <Button color='red' onClick={() => setConfirmOpen(false)}>Close</Button>

            </Modal.Actions>
          </Modal>
        </div>
        <div className="host-buttons">
          <Button
            inverted
            size="massive"
            color="olive"
            style={{ width: "275px" }}
            onClick={props.nextRoundHandler}
          >
            Start Next Round
      </Button>
        </div>
        <div className="host-buttons">
          <Button
            inverted
            size="massive"
            color="red"
            style={{ width: "275px" }}
            onClick={props.endGameHandler}> End Game </Button>
        </div>
      </div>
    </div>
  );
};

export default HostRoundSummary;
