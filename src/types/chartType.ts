type ApexSeriesData = {
  name: string;
  data: number[];
};

export type ChartData = {
  series: ApexSeriesData[];
  categories: string[];
};
