// import React, { useState } from "react";
// import "semantic-ui-css/semantic.min.css";
// import {Grid} from "semantic-ui-react";
// import ReactDOM from 'react-dom';

// import ReactEcharts from 'echarts-for-react'
// //import echarts from 'echarts/lib/echarts'
// import 'echarts/lib/chart/bar'
// import 'echarts/lib/component/tooltip'
// import 'echarts/lib/component/title'
// import 'echarts/lib/component/legend'
// import 'echarts/lib/component/markPoint'
// //npm install --save echarts
// function getOption(props){

// const Example = () => {
//         return {
//             title: {
//                 text: <h1>Graph of {props.name} pasture resources</h1>,
//                 textStyle: {
//                     fontSize:20,
//                     color: '#FFFFFF',
//                     backgroundColor: 'transparent'
//                }
//             },
//             tooltip:{
//                 trigger: 'axis'
//             },
//             xAxis: {
//                 name:'Round',
//                 data: ['Round1','Round2','Round3','Round4','Round5','Round6','Round7'],
//             },
//             yAxis: {
//                 name:'PlayerChoice',
//                 type: 'value',
//             },
//             series : [
//                 {
//                     name:'pasture',
//                     type:'line',
//                     barWidth: '50%',
//                     data:[12, 15, 20, 23, 25, 18, 12]
//                 }
//             ]
//         }
//     }
    
//     return(
//         <div>
//             <ReactEcharts option={ <getOption() name="Sara"/> } 
//             style={{width: '200%', height:'500%'}}/>
//         </div>
//     );
// };

// export default Example;