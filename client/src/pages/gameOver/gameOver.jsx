import React, { Component } from "react";
import "semantic-ui-css/semantic.min.css";
import { Link } from "react-router-dom";
import "./gameOver.css"
import { Button, Input, Grid, Label, Header, Icon, Modal, Image, Rating } from "semantic-ui-react";
import { useMediaQuery } from 'react-responsive'


//import { Card } from 'antd'
import ReactEcharts from 'echarts-for-react'
//import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/markPoint'
import 'echarts/lib/component/toolbox';
//npm install --save echarts-for-react

const GameOver = (props) => {
    var i = 0;

    const isDesktopOrLaptop = useMediaQuery({ query: '(min-device-width: 1224px)' })
    const isBigScreen = useMediaQuery({ query: '(min-device-width: 1824px)' })
    const isTabletOrMobile = useMediaQuery({ query: '(max-device-width: 1224px)' })
    var i = 0;
    function getGraph(name, result) {
        //https://echarts.apache.org/en/option.html#toolbox.feature.saveAsImage.type
        //consider this website
        const resultLabel = new Array();
        for (i = 0; i < result.length; ++i) {
            resultLabel.push("Round" + (i + 1).toString())
        }
        return {
            title: {
                text: "Graph of " + name + " pasture resources",
                textStyle: {
                    fontSize:20,
                    color: '#303133',
                    backgroundColor: 'transparent'
                }
            },
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                show: true, // show backgroung color
                backgroundColor:'#bac',
            },
            xAxis: {
                name: 'Round',
                data: resultLabel,
                nameLocation: "middle",
                nameGap: "30",
                // nameTextStyle:{
                //     backgroundColor = '#123234',
                // }
            },
            yAxis: {
                name: 'PlayerChoice',
                type: 'value',
                nameLocation: "middle",
                nameGap: "30",
            },
            toolbox: {
                show: true,
                feature: {
                    dataZoom: {
                        yAxisIndex: "none"
                    },
                    dataView: {
                        readOnly: false
                    },
                    magicType: {
                        type: ["line", "bar"]
                    },
                    restore: {},
                    saveAsImage: {
                        type: 'jpg',
                    },
                    myTool: {
                        show: true,
                        title: 'Custom extension method',
                        icon: 'image://http://echarts.baidu.com/images/favicon.png',
                        onclick: function () {
                            alert('myToolHandler2')
                        }
                    }
                }
            },
            series: [
                {
                    name: 'pasture',
                    type: 'line',
                    barWidth: '50%',
                    //data:[12, 15, 20, 23, 25, 18, 12]
                    data: result,
                    //areaStyle: {},
                }
            ]
        }
    }

    function compareGraph(name1, name2, result1, result2) {

        const resultLabel = new Array();
        for (i = 0; i < result1.length; ++i) {
            resultLabel.push("Round" + (i + 1).toString())
        }
        return {
            title: {
                text: "Graph of " + name1 + " and " + name2 + " pasture resources",
                textStyle: {
                    fontSize:20,
                    color: '#303133',
                    backgroundColor: 'transparent'
                }
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: [name1, name2]
            },
            grid: {
                show: true, // show backgroung color
                backgroundColor:'#bac',
            },
            xAxis: {
                //name:'Round',
                data: resultLabel,
            },
            yAxis: {
                //name:'PlayerChoice',
                type: 'value',
            },
            series: [
                {
                    name: 'pasture',
                    type: 'line',
                    barWidth: '50%',
                    data: result1,
                    lineStyle: {
                        color: '#ee5050'
                    },
                },
                {
                    name: 'pasture',
                    type: 'line',
                    barWidth: '50%',
                    data: result2,
                    lineStyle: {
                        color: "#5a9bf2"
                    },
                }
            ]
        }
    }

    const [open, setOpen] = React.useState(false)

    return (
        <div className="layout">
            <div className="hgo-transparent-box">
                <div className="GameOver-header">Game Over</div>
                {/* <div style={{textAlign: "center", fontSize: "30px"}}>
                    Ended on Round:
                </div> */}

                <div className="hostresult-header"  style={{textAlign: "center", paddingBottom: "15px"}}>
                    Final Results
                </div>
                <section class="tabcenter">

                    <div class="table__wrapper">
                        <table className="table" >
                            <thead>
                                <tr>
                                    <th scope="col">Place</th>
                                    <th scope="col">Player</th>
                                    <th scope="col">Total</th>
                                    {/*  <th scope="col">Compare</th> */}
                                </tr>
                            </thead>
                            <tbody>{props.table.slice(0, props.table.length).map((row, index) => {
                                return (
                                    <tr>
                                        <td data-header="Place" key={index[0]}>{row[0]}</td>
                                        <td key={index[1]} data-header="Player">{row[1]}</td>
                                        <td key={index[2]} data-header="Game Score Score">{row[2]}</td>
                                        
                                    </tr>
                                )
                            })}</tbody>
                        </table>
                    </div>
                </section>
                {/* 
                <Grid className="Graph">
                    <ReactEcharts option={getGraph("Sara", [12, 15, 20, 23, 25, 18, 12])}
                        style={{ width: '200%', height: '500%' }} />
                </Grid>

                <Grid className="Graph">
                    <ReactEcharts option={getGraph("Jessy", [23, 45, 12, 34, 56, 78, 12])}
                        style={{ width: '200%', height: '500%' }} />
                </Grid>

                <Grid className="Graph">
                    <ReactEcharts option={compareGraph("A", "B", [23, 45, 12, 34, 56, 78, 12], [11, 22, 33, 44, 55, 66, 17])}
                        style={{ width: '200%', height: '500%' }} />
                </Grid> */}


                {/* <div className="Download">
                    <Button
                        to="/"
                        size="medium"
                        inverted
                        color="teal"
                        style={{ width: "200px" }}>
                        Download Result
                </Button>
                </div> */}

            {/* <div className="modalgraph">
                <Modal
                    centered = "true"
                    onClose={() => setOpen(false)}
                    onOpen={() => setOpen(true)}
                    open={open}
                    trigger={<Button>Show Modal</Button>}
                >
                    <Modal.Content image>
                        <ReactEcharts option={getGraph("Jessy",[23,45,12,34,56,78,12])} 
                        style={{width: '200%',height:'500%'}}/>
                    </Modal.Content>
                </Modal>
            </div> */}

                {/*   <div>
                    Results by player and round
            </div>
                <div>
                    Drop down list to look at particular players
            </div>
                <div>
                    Like our Game? <Rating icon='star' defaultRating={5} maxRating={5} />
                </div> */}
                <div className="back-buttom">
                    <Button
                        as={Link}
                        to="/"
                        size="massive"
                        inverted
                        color="teal"
                        style={{ width: "600px" }}
                    >
                        Return to Home
                </Button>
                </div>
            </div>
        </div>

    );
};

export default GameOver;