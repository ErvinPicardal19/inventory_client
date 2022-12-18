import React from 'react'
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, Legend, Category, StackingColumnSeries, Tooltip } from '@syncfusion/ej2-react-charts';

import { stackedCustomSeries, stackedPrimaryXAxis, stackedPrimaryYAxis } from '../../../data/dummy';

import { useStateContext } from '../../contexts/ContextProvider';

const Stack = ({width, height}) => {
  const {currentMode} = useStateContext();
  let colors = ['#00BDAE', '#404041'];

  const onChartLoaded = (args) => {
    let chart = document.getElementById('charts');
    let legendTextCol = chart.querySelectorAll('[id*="chart_legend_text_"]');
    for (let i = 0; i < legendTextCol.length; i++) {
        //set the color to legend label
        legendTextCol[i].setAttribute('fill', colors[i]);
    }
}

  return (
    <ChartComponent
      width={width}
      height={height}
      id = "charts"
      primaryXAxis={stackedPrimaryXAxis}
      primaryYAxis={stackedPrimaryYAxis}
      chartArea={{border: {width: 0}}}
      tooltip={{enable: true}}
      background={currentMode === "Dark" ? 'rgb(51 55 62 / var(--tw-bg-opacity))' : ''}
      legendSettings={{background: (currentMode === "Dark" ? 'rgb(51 55 62 / var(--tw-bg-opacity))' : 'white')}}
      loaded={onChartLoaded.bind(this)}
    >
      <Inject services={[Legend, Category, StackingColumnSeries, Tooltip]} />
      <SeriesCollectionDirective>
        {stackedCustomSeries.map((item, index) => <SeriesDirective key={index} {...item} />)}
      </SeriesCollectionDirective>
    </ChartComponent>
  )
}

export default Stack