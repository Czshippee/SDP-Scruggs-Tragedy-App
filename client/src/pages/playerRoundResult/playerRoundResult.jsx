import React, {useEffect} from "react";
import "semantic-ui-css/semantic.min.css";
import "./playerRoundResult.css";
import { Table, Image, Button, Modal } from "semantic-ui-react";
import {Prompt} from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'


import ReactEcharts from 'echarts-for-react'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/markPoint'
import 'echarts/lib/component/toolbox';


const playerRoundData = (data, scores) => {
    console.log(data)
    

    return (
        {
            legend: {
                data: ["Farming", "Pasturing", "Reserve", "Round Score"]
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
                { type: 'bar', name: "Farming" },
                { type: 'bar', name: "Pasturing" },
                { type: 'bar', name: "Reserve" },
                {
                    type: 'line',
                    name: "Round Score",
                    data: scores
                }
            ]
        }
    )
}

function displayAdaptiveGraph(desk, mobTab, port, obj){
    if (desk || (mobTab && !port)){
        return(
            <ReactEcharts option={playerRoundData(obj.data, obj.scores)} style={{ width: '700%', height: '400%' }} />
        )
    }
    else{
        return (
            <ReactEcharts option={playerRoundData(obj.data, obj.scores)} style={{ height: '400%' }} />
        )
    }
}



const PlayerRoundResult = (props) => {
    const [open, setOpen] = React.useState(false)
    const isDesktopOrLaptop = useMediaQuery({
        query: '(min-device-width: 1224px)'
      })
    const isTabletOrMobile = useMediaQuery({ query: '(max-device-width: 1224px)'  })
    const isPortrait = useMediaQuery({ query: '(orientation: portrait)' })
    console.log(props.data)
    useEffect(()=>{
        window.addEventListener("beforeunload", alertUser);
        return ()=>{
          window.removeEventListener("beforeunload", alertUser);
        }
      })
      const alertUser = (e)=>
  {
    e.preventDefault();
    e.returnValue = " ";
  }
    
    return (
        <div className="player-round-result">
            <Prompt when={true} message="By exiting, you will leave the game. Are you sure?" />
            <div className ="transparency-prr">
            <div className="Player-page-header">Round Summary</div>
            
            <section class="tabcenter">

                <div class="table__wrapper">
                    <table className="table" >
                        <thead>
                            <th colspan="5">Results</th>
                            <tr>
                                <th scope="col"></th>
                                <th scope="col">Farming</th>
                                <th scope="col">Pasturing</th>
                                <th scope="col">Reserve</th>
                                <th scope="col">Round Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.data.map((row, index) => {
                                return (
                                    <tr>
                                        <td key={"round"} scope="row">{row["round"]}</td>
                                        <td key={"farming"} data-header="Farming">{row["farming"]}</td>
                                        <td key={"pasturing"} data-header="Pasturing">{row["pasturing"]}</td>
                                        <td key={"reserve"} data-header="Reserve">{row["reserve"]}</td>
                                        <td key={props.scores} data-header="Round Score"> {props.scores[index]}</td>
                                    </tr>)
                            })}
                        </tbody>
                    </table>
                </div>
            </section>
            {/* //     <div className="results-header">
        //         Results of Round {props.round}:
        //     </div>
        //     <div className="cows-message">
        //         You have {props.cows} Cows Left
        //     </div>
        //     <div className = "waiting-message">
        //         Waiting for host to start the next round...
        //     </div> */}
            <div className="host-buttons" style={{paddingTop:"30px"}}>
                <Modal
                    onClose={() => setOpen(false)}
                    onOpen={() => setOpen(true)}
                    open={open}
                    trigger={<Button
                        inverted
                        size="massive"
                        color="black"
                        style={{ width: "275px" }}
                    >Show Graph</Button>}
                >
                    <Modal.Content image>
                        {/* <ReactEcharts option={playerRoundData(props.data, props.scores)} style={{ width: '700%', height: '400%' }} /> */}
                        {displayAdaptiveGraph(isDesktopOrLaptop, isTabletOrMobile, isPortrait, props)}
                    </Modal.Content>
                    <Modal.Actions>
                        <Button
                            content="OK"
                            labelPosition='right'
                            icon='checkmark'
                            onClick={() => setOpen(false)}
                            positive
                        />
                    </Modal.Actions>
                </Modal>
            </div>
            </div>
        </div>
    );
};

export default PlayerRoundResult;