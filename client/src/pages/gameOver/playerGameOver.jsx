import React, { useState, Component, useEffect } from 'react';
import { Link } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import { Button, Grid, Table, List, Modal} from "semantic-ui-react";
import { useMediaQuery } from 'react-responsive'

import "./playerGameOver.css"

import ReactEcharts from 'echarts-for-react'
//import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/markPoint'
import 'echarts/lib/component/toolbox'; 


const playerFinalData = (data, scores) => {
    console.log(data)
    return (
        {
            legend: {
                data: ["First Place", "Last Place", "You", "Group Score"]
            },
            tooltip: {},
            dataset: {
                dimensions: ['round', 'farming', 'pasturing', 'reserve'],
                source: data
            },
            xAxis: { type: 'category' },
            yAxis: {},
            // Declare several bar series, each will be mapped
            // to a column of dataset.source by default.
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
            series: [
                { type: 'line', name: "First Place" },
                { type: 'line', name: "Last Place" },
                { type: 'line', name: "You" },
                {
                    type: 'line',
                    name: "Round Score",
                    data: scores
                }
            ]
        }
    )
}
const PlayerGameOver = (props) => {
    const [confirmOpen, setConfirmOpen] = useState(false);


    const isDesktopOrLaptop = useMediaQuery({ query: '(min-device-width: 1224px)' })
    const isBigScreen = useMediaQuery({ query: '(min-device-width: 1824px)' })
    const isTabletOrMobile = useMediaQuery({ query: '(max-device-width: 1224px)' })

    return (
        <div className="game-over">
            <div className="pgo-transparent-box">
                <div className="over-header">GAME OVER</div>
                <div className="over-text">
                    {/* <div className="roundCount">
                        Ended on Round {/*round number
                    </div> */}
                </div>
                <div className="over-text"> You placed: {props.rank} </div>
                <section class="tabcenter">

                    <div class="table__wrapper">
                        {/* <table className="table" >
                        <thead>

                            <th colspan="6" scope="row">TOP 10 PLAYERS </th>

                            <tr>
                                <th scope="col">Place</th>
                                <th scope="col">Player</th>
                                <th scope="col">Total</th>
                                <th scope="col">Farming</th>
                                <th scope="col">Pasturing</th>
                                <th scope="col">Reserve</th>

                            </tr>
                        </thead>
                        <tbody>
                            {<tr>
                                <td>/* Map the above values of the top players
                                      into a table. Add data-header="category" for
                                      Player-->Reserve, and scope="row" for Place. 
                                      see hostRoundSummary.jsx for example
                                      of table.
                                
                                </td>
                            </tr>}
                        </tbody>
                    </table> */}
                    </div>
                </section>
                {/*this modal should show a graph that shows how the player
            did against the top player, the last place player, and the group score */}
               {/*  <div className="host-buttons" style={{ paddingTop: "30px" }}>
                    <Modal
                        onClose={() => setConfirmOpen(false)}
                        onOpen={() => setConfirmOpen(true)}
                        open={confirmOpen}
                        trigger={<Button
                            inverted
                            size="massive"
                            color="black"
                            style={{ width: "275px" }}>Show Graph</Button>}
                    >
                        <Modal.Header>End Results</Modal.Header>
                        <Modal.Description>
                            <ReactEcharts option={playerFinalData(props.data)} style={{ width: '200%', height: '400%' }} />
                        </Modal.Description>
                        <Modal.Actions>
                            <Button color='red' onClick={() => setConfirmOpen(false)}>Close</Button>

                        </Modal.Actions>
                    </Modal>
                </div> */}

                <div className="homeButton" vertical="isTabletOrMobile">
                    <Button
                        as={Link}
                        to="/"
                        size="massive"
                        inverted
                        color="teal"
                        style={{ width: "275 px" }}
                        align="center"
                    >
                        Return to Home
                </Button>

                </div>

            </div>
        </div>
    );
};


export default PlayerGameOver;