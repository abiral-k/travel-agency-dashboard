import {
  Category,
  ChartComponent,
  ColumnSeries,
  DataLabel,
  SeriesCollectionDirective,
  SeriesDirective,
  SplineAreaSeries,
  Tooltip,
} from "@syncfusion/ej2-react-charts";
import { Inject } from "@syncfusion/ej2-react-grids";
import { tripXAxis, tripyAxis, userXAxis, useryAxis } from "~/constants";

export default function DashboardCharts({
  userGrowth,
  tripsByTravelStyle,
}: {
  userGrowth: { day: string; count: number }[];
  tripsByTravelStyle: { travelStyle: string; count: number }[];
}) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <ChartComponent
        id="chart-1"
        primaryXAxis={userXAxis}
        primaryYAxis={useryAxis}
        title="User Growth"
        tooltip={{ enable: true }}
      >
        <Inject
          services={[
            ColumnSeries,
            SplineAreaSeries,
            Category,
            DataLabel,
            Tooltip,
          ]}
        />

        <SeriesCollectionDirective>
          <SeriesDirective
            dataSource={userGrowth}
            xName="day"
            yName="count"
            type="Column"
            name="Column"
            columnWidth={0.3}
            cornerRadius={{ topLeft: 10, topRight: 10 }}
          />

          <SeriesDirective
            dataSource={userGrowth}
            xName="day"
            yName="count"
            type="SplineArea"
            name="Wave"
            fill="rgba(71, 132, 238, 0.3)"
            border={{ width: 2, color: "#4784EE" }}
          />
        </SeriesCollectionDirective>
      </ChartComponent>

      <ChartComponent
        id="chart-2"
        primaryXAxis={tripXAxis}
        primaryYAxis={tripyAxis}
        title="Trip Trends"
        tooltip={{ enable: true }}
      >
        <Inject
          services={[
            ColumnSeries,
            SplineAreaSeries,
            Category,
            DataLabel,
            Tooltip,
          ]}
        />

        <SeriesCollectionDirective>
          <SeriesDirective
            dataSource={tripsByTravelStyle}
            xName="travelStyle"
            yName="count"
            type="Column"
            name="day"
            columnWidth={0.3}
            cornerRadius={{ topLeft: 10, topRight: 10 }}
          />
        </SeriesCollectionDirective>
      </ChartComponent>
    </section>
  );
}
