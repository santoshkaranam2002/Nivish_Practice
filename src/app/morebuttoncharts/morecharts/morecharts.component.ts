import { Component,ViewChild, ElementRef, AfterViewInit, OnInit,Inject ,TemplateRef} from '@angular/core';
import { Apollo } from 'apollo-angular';
import { IvinService } from 'src/app/ivin.service';
// import { barchart, bubblechart, latestElectionResult, particpationdetails, piechart, totaldata, treechartdata } from '.../probite.graphql';
import { barchart, bubblechart, latestElectionResult, particpationdetails, piechart, totaldata, treechartdata } from 'src/app/quickinsights-pro-bite/probite.graphql';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as d3 from 'd3';
import { forkJoin } from 'rxjs';
import { GeoPath, GeoProjection } from 'd3-geo';
import { FeatureCollection, Geometry } from 'geojson';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import ItemChart from 'highcharts/modules/item-series';
import treegraph from 'highcharts/modules/treegraph';
import treemap from 'highcharts/modules/treemap';
// import HighchartsTheme from 'highcharts/themes/grid-light';
import HighchartsBrandLight from 'highcharts/themes/brand-light';


require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/export-data')(Highcharts);
require('highcharts/modules/annotations')(Highcharts);

treemap(Highcharts);
treegraph(Highcharts);
ItemChart(Highcharts);
HighchartsMore(Highcharts); 

// HighchartsTheme(Highcharts); // Apply the theme
HighchartsBrandLight(Highcharts); // Apply the Dark Unica theme

// Declare google variable
declare const google: any;


@Component({
  selector: 'app-morecharts',
  templateUrl: './morecharts.component.html',
  styleUrls: ['./morecharts.component.scss']
})
export class MorechartsComponent {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  @ViewChild('infoPanel') infoPanel!: ElementRef;
  // @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  // @ViewChild('infoPanel', { static: true }) infoPanel!: ElementRef;
  @ViewChild('selectedMapContainer') selectedMapContainer!: ElementRef;
  @ViewChild('districtMap') districtMap!: ElementRef<SVGSVGElement>;
  //  svg: any;
  private selectedSvg: any;
  state: any;
  election: any;
  year: any;
  constituency: any;
  tabledata: any;
  bardata: any;
  piechartdata: any;
  startvalue: any;
  endvalue: any;
  gender: any;
  party: any;
  category: any;
  private svg: any;
  private tooltip: any;
  private stateValues: Map<string, number> = new Map();
  private stateNames: string[] = [];
  private districtnames : string[]=[];
  districtData: FeatureCollection<Geometry, { NAME_1: string, NAME_2: string }> | undefined;
  geomapdata: any[] = []; 
  selectedState: string = ''; 

  showPopup = false;
  districts: any[] = [];
  totalelections: string[]=[];
  totalyears: string[]=[];
  totalconstituencies: string[]=[];
  treechartOptions:Highcharts.Options = {};

  Highcharts: typeof Highcharts = Highcharts;
  electors: any;
  votespolled: any;
  castewisedata: any;
  // Add a property to hold the chart instance
  castewisepiechart: Highcharts.Chart | undefined;
  treedata: any;
  usertype: any;
  firstname: any;
  shouldShowMapCard: boolean = true;

  //treegrapgh

  candidateinformation: any;
  stateNamenode: any;
  electionTitlenode: any;
  electionYearnode: any;
  constituencyNamenode: any;
  candidateData: any[] = [];

  clickedNodes: { election: string, year: string, constituency: string }[] = [];
  stateClicked: string = '';
  electionClicked: string = '';
  yearClicked: string = '';
  constituencyClicked: string = '';
  selectedNodeId: string | null = null;
  // selectedState: string | null = null;       

  selectedElection: string | null = null;  // Variable for storing election name
  selectedYear: string | null = null;      // Variable for storing election year
  selectedConstituency: string | null = null; 
  chartOptions: Highcharts.Options = {};
  bubblechartdata: any;
  latestElectionResult: any;
  lateststate: any;
  latestelectiontype: any;
  latestyear: any;
  userid: any;
  latestACname: any;
  // showMoreCharts = false;
  showMoreCharts: boolean = false; 
  myloginId: any;
  username: any;


constructor(public dialog: MatDialog,private ivinservice:IvinService,private apollo:Apollo,private httpClient: HttpClient){}
  ngOnInit(){
    // this.latestelectionresult();
    this.getbyloginid();
    this.usertype = sessionStorage.getItem('description');
    this.firstname  = sessionStorage.getItem('firstname');
    // this.smalltable();
    // this.Barchartfunctionality();
    // this.piechartfunctionality();
    // this.Geomapfunctionality();
    // this.intilizeoptions();
    // this.piechartcastewisefunctionality();
    // this.treechartfunctionality();
    // this.candiatedetails();
    // this.parliamentfunctionality();
    // this.checkConstituency();
    // this.bubblechartfunctionality();
    this.checkConstituency();
  }


  // openNewWindow() {
  //   this.username = sessionStorage.getItem('userprofileusername');
  //   console.log('userprofileusername',this.username);
  //   this.myloginId=localStorage.getItem('loginId');
  //   const url = '/publicview_probite/' + this.myloginId + '_' +  this.username;
  //   console.log('aaaaa',this.username)
  //   window.open(url, '_blank');
  // }

  checkConstituency() {
    this.shouldShowMapCard = !this.constituency;
  }
  
  ngAfterViewInit(): void {
    this.Barchartfunctionality();
    this.piechartcastewisefunctionality();
    this.treechartfunctionality();
    // this.candiatedetails();
    this.parliamentfunctionality();
    this.bubblechartfunctionality();
    // this.createMap();
    // this.Geomapfunctionality();
    // Add any required functionality for after view initialization here
  }

getbyloginid(){
  this.userid = sessionStorage.getItem('loginid');
  this.ivinservice.publicpagepagination(this.userid).subscribe((data:any)=>{
    if(data['Status']===200){
      console.log("data pag",data);
      this.latestElectionResult = data.Result[0];
      console.log("latestElectionResult",this.latestElectionResult);
      this.lateststate = this.latestElectionResult.StateUTName;
      console.log(this.lateststate,'this.lateststate')
      this.latestelectiontype = this.latestElectionResult.ElectionName;
      console.log(this.latestelectiontype,'this.latestelectiontype')
      this.latestyear = this.latestElectionResult.ElectionYear;
      console.log(this.latestyear,'this.latestyear');
      this.latestACname = this.latestElectionResult.ACName;
      console.log(this.latestACname,'this.latestACname')
      this.smalltable();
      this.Barchartfunctionality();
      this.piechartfunctionality();
      this.Geomapfunctionality();
      this.intilizeoptions();
      this.piechartcastewisefunctionality();
      this.treechartfunctionality();
      this.parliamentfunctionality();
      this.bubblechartfunctionality();
    }
  })
}

  // latestelectionresult(){
  //   this.apollo.use('probite').watchQuery({
  //     query:latestElectionResult
  //   }).valueChanges.subscribe(({data}:any)=>{
  //     this.latestElectionResult = data.latestElectionResult;
  //     console.log("latestElectionResult",this.latestElectionResult);
  //     this.lateststate = data.latestElectionResult.StateUTName;
  //     console.log(this.lateststate,'this.lateststate')
  //     this.latestelectiontype = data.latestElectionResult.ElectionName;
  //     console.log(this.latestelectiontype,'this.latestelectiontype')
  //     this.latestyear = data.latestElectionResult.ElectionYear;
  //     console.log(this.latestyear,'this.latestyear')
  //     this.smalltable();
  //     this.Barchartfunctionality();
  //     this.piechartfunctionality();
  //     this.Geomapfunctionality();
  //     this.intilizeoptions();
  //     this.piechartcastewisefunctionality();
  //     this.treechartfunctionality();
  //     this.parliamentfunctionality();
  //     this.bubblechartfunctionality();
  //   })
  // }

  smalltable(){
    this.state = this.lateststate;
    this.election =  this.latestelectiontype;
    this.year = this.latestyear;
    this.constituency = this.ivinservice.constituencyselected;
    this.startvalue = this.ivinservice.startvalue;
    this.endvalue = this.ivinservice.endvalue;
    this.gender = this.ivinservice.genderselected;
    this.party = this.ivinservice.partyselected;
    this.category = this.ivinservice.categoryselected;
    
    console.log("@@@ ##",this.state);
    console.log("@@@##",this.election);
    console.log("@@@###",this.year);
    console.log("@@@",this.constituency);
    console.log("@@@",this.startvalue);
    console.log("@@@",this.endvalue);
    console.log("@@@",this.gender);
    console.log("@@@",this.party);
    console.log("@@@",this.category);

    const totalvariables = {
      election :  this.latestelectiontype,
      electionyear : this.latestyear.toString(),
      statename : this.lateststate,
      constituency : this.constituency || null
    }
    console.log('public view variables',totalvariables);
    this.apollo.use('probite').watchQuery({
      query : totaldata,
      variables : totalvariables,
    }).valueChanges.subscribe(({data}:any)=>{
      this.tabledata = data.totalPolledAndElectors;
      console.log(" this.tabledata", this.tabledata);
      this.summarydata();

    })
  }

  getTitleText(): string {
    return `
      <span>
        ${this.state}
        ${this.state && this.election ? '&#8594;' : ''}
        ${this.election}
        ${this.election && this.year ? '&#8594;' : ''}
        ${this.year}

      </span>
    `;
  }

  // BAR chart

  drawBarchart() {
    if (!this.bardata || !this.bardata[0]) return;

    const categories = this.bardata[0].wins.map((win: any) => `${win.party} (${win.wins})`);
  
    // Safely access Highcharts colors
    const themeColors = Highcharts.getOptions().colors || [];
  
    const data = this.bardata[0].wins.map((win: any, index: number) => {
      return {
        y: win.wins, // The number of seats won
        color: themeColors.length > 0 ? themeColors[index % themeColors.length] : undefined
      };
    });
  
    const chartOptions: Highcharts.Options = {
      chart: {
        backgroundColor: 'transparent',
        type: 'column'
      },
      title: {
        text: 'Party Wise Seats Won',
        align: 'center'
      },
      subtitle: {
        text: this.getTitleText(),
      },
      xAxis: {
        categories: categories,
        crosshair: false,
        title: {
          text: 'Political Parties',
          style : {
            fontWeight:'bold'
          }
        },
        accessibility: {
          description: 'Parties'
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Number of Seats',
          style : {
            fontWeight : 'bold'
          }
        }
      },
      tooltip: {
        valueSuffix: ' Seats'
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: [
        {
          type: 'column',
          name: 'Seats Won',
          data: data
        }
      ],
      credits: {
        enabled: true,
        text: `Created By ${this.firstname} with Idovin Strategies`
      },
    };

    Highcharts.chart('Barchart', chartOptions);
  }


  Barchartfunctionality(){
    this.state =  this.lateststate ;
    this.election =this.latestelectiontype ;
    this.year = this.latestyear;
    this.constituency = this.ivinservice.constituencyselected;

    const piecharvariables = {
      election : this.latestelectiontype,
      state : this.lateststate,
      year :this.latestyear.toString(),
      constituency : this.constituency || null
    }
    console.log("bar chart variables",piecharvariables);
    this.apollo.use('probite').watchQuery({
      query : barchart,
      variables : piecharvariables,
    }).valueChanges.subscribe(({data}:any)=>{
      if (data && data.stateWiseWonSeats && data.stateWiseWonSeats.length > 0) {
        this.bardata = data.stateWiseWonSeats;
        console.log("barchart data", this.bardata);
        this.drawBarchart();
      }else {
        this.bardata = [];
      }
    })
  }

  // PIE Chart

  piechartpartywise() {
    if (!this.piechartdata || this.piechartdata.length === 0) {
      // Handle the case where there is no data
      return;
    }

    const chartData = this.piechartdata.map((party: any) => {
      return {
        name: party.partyName,
        y: parseFloat(party.percentage.replace('%', '')),
        partyVotes: party.partyVotes  // Include party votes
      };
    });
  
    const chartOptions: Highcharts.Options = {
      chart: {
        backgroundColor: 'transparent',
        type: 'pie'
      },
      title: {
        text: 'Party Wise Vote Share'
      },
      subtitle: {
        text: this.getTitleText()
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            formatter: function() {
              const percentage = this.point.percentage ?? 0;
              return `${Highcharts.numberFormat(percentage, 1)}%`;
            },
            distance: -50
          },
          showInLegend: true
        }
      },
      legend: {
        align: 'right',
        verticalAlign: 'middle',
        layout: 'vertical',
        itemStyle: {
          fontSize: '12px'
        },
        maxHeight: 300,  // Adjust height as needed
        // Workaround for adding scrollbar-like behavior
        labelFormatter: function () {
          // Find the data item that corresponds to this legend item
          const dataItem = chartData.find((item:any) => item.name === this.name);
          if (dataItem) {
            return `${dataItem.name} (${dataItem.y.toFixed(1)}%) (${dataItem.partyVotes})`;
          }
          return this.name;
        }
      },
      credits: {
        enabled: true,
        text: `Created By ${this.firstname} with Idovin Strategies`
      },
      series: [
        {
          type: 'pie',
          name: 'Percentage',
          data: chartData
        }
      ]
    };
  
    Highcharts.chart('partywisepiechart', chartOptions);
  }
  


  piechartfunctionality(){
    this.state =  this.lateststate;
    this.election = this.latestelectiontype;
    this.year = this.latestyear;
    this.constituency = this.ivinservice.constituencyselected;

    const piechartvariable = {
      election : this.latestelectiontype,
      statename : this.lateststate,
      electionyear : this.latestyear.toString(),
      constituency : this.constituency || null
    }
    console.log("piechart variables",piechartvariable);
    
    this.apollo.use('probite').watchQuery({
      query : piechart,
      variables : piechartvariable
    }).valueChanges.subscribe(({data}:any)=>{
      if (data && data.partySharingResult){
        this.piechartdata = data.partySharingResult;
        console.log('piechart party wise data',this.piechartdata);
        this.piechartpartywise();
      }
    })
  }


  // PIE Chart caste wise functionality and Chart 

  piechartcastewisefunctionality(){
    this.state =  this.lateststate;
    this.election = this.latestelectiontype;
    this.year = this.latestyear;
    this.constituency = this.ivinservice.constituencyselected;
    this.startvalue = this.ivinservice.startvalue;
    this.endvalue = this.ivinservice.endvalue;
    this.gender = this.ivinservice.genderselected;
    this.party = this.ivinservice.partyselected;
    this.category = this.ivinservice.categoryselected;

    const totalvariables = {
      election : this.latestelectiontype,
      electionyear : this.latestyear.toString(),
      statename : this.lateststate,
      constituency : this.constituency || null
    }
    console.log('caste pie variables',totalvariables);
    this.apollo.use('probite').watchQuery({
      query : totaldata,
      variables : totalvariables,
    }).valueChanges.subscribe(({data}:any)=>{
      this.castewisedata = data.totalPolledAndElectors;
      console.log(" this.castewisedata", this.castewisedata);
      this.piechartcastewise();
    })
  }

  piechartcastewise() {
    if (!this.castewisedata?.[0]?.ACCategoryResult) return;
  
    // Map data for Highcharts
    const data = this.castewisedata[0].ACCategoryResult.map((result: any) => ({
      name: `${result.caste} (${result.count})`,
      y: result.count
    }));
  
    // Chart options
    const chartOptions: Highcharts.Options = {
      chart: {
        backgroundColor: 'transparent',
        type: 'pie',
      },
      title: {
        text: 'Seat Representation by Reservation'
      },
      subtitle: {
        text: this.getTitleText(),
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            formatter: function() {
              const percentage = this.point.percentage ?? 0;
            return `${Highcharts.numberFormat(percentage, 1)}%`;
            },
            distance: -50
          },
          showInLegend: true
        }
      },
      credits: {
        enabled: true,
        text: `Created By ${this.firstname} with Idovin Strategies`
      },
      series: [
        {
          type: 'pie',
          name: 'Count',
          data: data
        }
      ]
    };
  
    // Destroy previous chart if it exists to avoid stacking issues
    if (this.castewisepiechart) {
      this.castewisepiechart.destroy();
    }
  
    // Create new chart
    this.castewisepiechart = Highcharts.chart('castewisepiechart', chartOptions);
  }
  


  Geomapfunctionality(){
    this.state =  this.lateststate;
    this.election = this.latestelectiontype;
    this.year = this.latestyear;
    this.constituency = this.ivinservice.constituencyselected;

    const piecharvariables = {
      election : this.latestelectiontype,
      state : this.lateststate,
      year : this.latestyear.toString(),
      constituency : this.constituency || null
    }
    console.log("Geo map variables",piecharvariables);
    this.apollo.use('probite').watchQuery({
      query : barchart,
      variables : piecharvariables,
    }).valueChanges.subscribe(({data}:any)=>{
      if (data && data.stateWiseWonSeats && data.stateWiseWonSeats.length > 0) {
        this.geomapdata = data.stateWiseWonSeats;
        console.log("geomap data", this.geomapdata); 
        this.createMap();
      }
    })
  }

  // Create a name mapping to handle discrepancies
  stateNameMapping: { [key: string]: string } = {
    "Odisha": "Orissa",
    "Uttarakhand": "Uttaranchal",
    // Add more mappings if necessary
  };

  // Geo Map chart 

  createMap(): void {

    if (!this.mapContainer || !this.infoPanel) {
      console.error('Map container or info panel not available.');
      return;
    }  

    console.log('Map container:', this.mapContainer.nativeElement);
    console.log('Info panel:', this.infoPanel.nativeElement);

    const element = this.mapContainer.nativeElement;
    const infoPanel = this.infoPanel.nativeElement;
    const width = 300;
    const height = 400;
  
    // Initialize D3.js SVG
    this.svg = d3.select(element).append('svg')
      .attr('width', width)
      .attr('height', height);
  
    // Create a tooltip
    this.tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background-color', 'white')
      .style('border', '1px solid black')
      .style('padding', '5px')
      .style('pointer-events', 'none');
  
    // Load GeoJSON data for states and districts
    forkJoin([
      this.httpClient.get<FeatureCollection<Geometry, { NAME_1: string }>>('assets/data/geo/India.geojson'),
      this.httpClient.get<FeatureCollection<Geometry, { NAME_1: string, NAME_2: string }>>('assets/data/geo/india_district.geojson')
    ]).subscribe(([stateData, districtData]) => {
      console.log('State GeoJSON data loaded successfully:', stateData);
      console.log('District GeoJSON data loaded successfully:', districtData);
  
      // Store the district data
      this.districtData = districtData;
  
      // Map state names
      stateData.features.forEach((feature: any) => {
        const correctedName = this.stateNameMapping[feature.properties.NAME_1] || feature.properties.NAME_1;
        feature.properties.correctedName = correctedName;
      });
  
      // Store state names
      this.stateNames = stateData.features.map((feature: any) => feature.properties.correctedName);
      console.log('statenames', this.stateNames);
  
      // Store district names
      this.districtnames = districtData.features.map((feature: any) => feature.properties.NAME_1);
      console.log('districtnames', this.districtnames);
  
      // Create a projection
      const projection = d3.geoMercator()
        .fitSize([width, height], stateData);
  
      const path = d3.geoPath().projection(projection);

      let lightGreenState: string | undefined;
  
      // Render India map with states
      this.svg.selectAll('path.state')
        .data(stateData.features)
        .enter().append('path')
        .attr('d', path)
        .attr('class', 'state')
        .style('fill', (d: any) => {
          if (this.geomapdata && Array.isArray(this.geomapdata)) {
            const stateData = this.geomapdata.find((item: any) => item.state === d.properties.correctedName);
            if (stateData) {
              if (!lightGreenState) {
                lightGreenState = d.properties.correctedName; // Identify the light green state
              }
              const infoHtml = `
                <div style="font-weight: bold;">State: ${d.properties.correctedName}</div>
                <div style="margin-top: 5px; font-weight: bold;">Party Wins:</div>
                <ul style="margin: 0; padding-left: 20px;">
                  ${stateData.wins.map((w: any) => `<li>${w.party}: ${w.wins}</li>`).join('')}
                </ul>
              `;
              infoPanel.innerHTML = infoHtml;
              return 'lightgreen';
            }
            return 'lightblue';
          }
          return 'lightblue';
        })
        .style('stroke', 'white')
        .style('stroke-width', '1px')
        .on('mouseover', (event: any, d: any) => {
          d3.select(event.currentTarget as HTMLElement).style('fill', 'orange');
          const stateValue = this.stateValues.get(d.properties.correctedName) || 0;
          const stateData = this.geomapdata.find((item: any) => item.state === d.properties.correctedName);
          this.tooltip.transition()
            .duration(200)
            .style('opacity', .9);
          this.tooltip.html(d.properties.correctedName)
            .style('left', (event.pageX + 5) + 'px')
            .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', (event: any, d: any) => {
          d3.select(event.currentTarget as HTMLElement).style('fill', () => {
            if (this.geomapdata && Array.isArray(this.geomapdata)) {
              const stateData = this.geomapdata.find((item: any) => item.state === d.properties.correctedName);
              return stateData ? 'lightgreen' : 'lightblue';
            }
            return 'lightblue';
          });
          // infoPanel.innerHTML = ''; // Clear the info panel on mouse out
          // infoPanel.style.display = 'none'; // Hide the info panel on mouse out
          this.tooltip.transition()
            .duration(500)
            .style('opacity', 0); // Hide the tooltip
        })
        .on('mousemove', (event: any, d: any) => {
          this.tooltip.style('left', (event.pageX + 5) + 'px')
            .style('top', (event.pageY - 28) + 'px');
        })
        .on('click', (event: any, d: any) => {
          console.log('Clicked state:', d.properties.correctedName);
          d3.select(event.currentTarget as HTMLElement).style('fill', 'yellow');
          this.showDistricts(d.properties.correctedName, path, projection);
        });
    });
  }

  showDistricts(stateName: string, path: d3.GeoPath, projection: d3.GeoProjection): void {
    if (!this.districtData) return;

    this.selectedState = stateName;
  
    const mappedStateName = this.stateNameMapping[stateName] || stateName;
    this.districts = this.districtData.features.filter((d: any) => d.properties.NAME_1 === mappedStateName);
  
    this.showPopup = true;
  
    // Ensure that createDistrictMap is called after the view is initialized
    setTimeout(() => this.createDistrictMap(), 0);
  }

  createDistrictMap(): void {
    if (!this.districtMap || !this.districtMap.nativeElement) return;
  
    const element = this.districtMap.nativeElement;
    const width = 500;
    const height = 400;
  
    // Initialize D3.js SVG
    const svg = d3.select(element)
      .attr('width', width)
      .attr('height', height);
  
    // Clear previous paths
    svg.selectAll('*').remove();
  
    // Create a projection
    const projection = d3.geoMercator()
      .fitSize([width, height], { type: 'FeatureCollection', features: this.districts });
  
    const path = d3.geoPath().projection(projection);
  
    // Create a tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background-color', 'white')
      .style('border', '1px solid black')
      .style('padding', '5px')
      .style('pointer-events', 'none');
  
    // Render districts
    svg.selectAll('path')
      .data(this.districts)
      .enter().append('path')
      .attr('d', path)
      .attr('class', 'district')
      .style('fill', 'lightblue')
      .style('stroke', 'white')
      .style('stroke-width', '1px')
      .on('mouseover', (event: any, d: any) => {
        d3.select(event.currentTarget as HTMLElement).style('fill', 'orange');
  
        // Tooltip for district name
        tooltip.transition()
          .duration(200)
          .style('opacity', .9);
        tooltip.html(d.properties.NAME_2)
          .style('left', (event.pageX + 5) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', (event: any, d: any) => {
        d3.select(event.currentTarget as HTMLElement).style('fill', 'lightblue');
        tooltip.transition()
          .duration(500)
          .style('opacity', 0); // Hide the tooltip
      })
      .on('mousemove', (event: any) => {
        tooltip.style('left', (event.pageX + 5) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      });
  }
  
  closePopup(): void {
    this.showPopup = false;
  }

  // Parliment chart

  parliamentfunctionality(){
    this.state = this.lateststate;
    this.election = this.latestelectiontype;
    this.year = this.latestyear;
    this.constituency = this.ivinservice.constituencyselected;

    const piecharvariables = {
      election : this.latestelectiontype,
      state :this.lateststate,
      year : this.latestyear.toString(),
      constituency : this.constituency || null
    }
    console.log("Geo map variables",piecharvariables);
    this.apollo.use('probite').watchQuery({
      query : barchart,
      variables : piecharvariables,
    }).valueChanges.subscribe(({data}:any)=>{
      if (data && data.stateWiseWonSeats && data.stateWiseWonSeats.length > 0) {
        this.geomapdata = data.stateWiseWonSeats;
        console.log("geomap data", this.geomapdata); 
        this.parliamentChart();
      }
    })
  }

  parliamentChart() {
    // Ensure geomapdata is defined and contains the expected structure
    if (!this.geomapdata || !Array.isArray(this.geomapdata)) {
      console.error('Invalid geomapdata format or geomapdata is empty.');
      return;
    }
  
    // Extract the wins array from the first item (assuming there's only one state in the response)
    const winsData = this.geomapdata[0].wins;
  
    // Calculate the total number of wins
    const totalWins = winsData.reduce((sum: number, item: any) => sum + item.wins, 0);
    console.log('Total Wins:', totalWins);
  
    // Function to generate a random color
    const getRandomColor = () => {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };
  
    // Transform the response data to the format required by Highcharts
    const chartData = winsData.map((item: any) => [
      item.party,              // Name of the party
      item.wins,               // Number of wins
      getRandomColor(),        // Random color
      item.party,             // Label for the data point
    ]);
  
    console.log('Chart Data:', chartData);
  
    // Define a variable to store the custom text
    let customText: Highcharts.SVGElement | null = null;
  
    // Configure Highcharts
    const chart = Highcharts.chart({
      chart: {
        backgroundColor: 'transparent',
        renderTo: 'container', // ID of the container element
        type: 'item',
        events: {
          load: function () {
            const chart = this as Highcharts.Chart;
  
            // Function to add custom text
            const addCustomText = () => {
              if (customText) {
                customText.destroy();
              }
              customText = chart.renderer.text(
                `Total Seats<br><b style="font-size:30px;">${totalWins}</b>`, // Text to display
                chart.plotWidth / 2 + 10, // X position
                chart.plotHeight / 2 + 120 // Y position
              )
              .attr({
                zIndex: 5,
                align: 'center'
              })
              .add();
            };
  
            // Add text when the chart is initially loaded
            addCustomText();
  
            // Update text position when the chart is resized
            Highcharts.addEvent(chart, 'redraw', addCustomText);
          }
        }
      },
      title: {
        useHTML: true,
        text: 'Party Wise Seats Won'
      },
      subtitle: {
        text: this.getTitleText(),
      },
      navigation: {
        buttonOptions: {
          enabled: true
        }
      },
      credits: {
        enabled: true,
        text: `Created By ${this.firstname} with Idovin Strategies`
      },
      legend: {
        labelFormat: '{name} <span style="opacity: 0.4">{y}</span>'
      },
      series: [{
        type: 'item',
        name: 'Representatives',
        keys: ['name', 'y', 'color', 'label'],
        data: chartData,
        dataLabels: {
          enabled: true,
          format: '{point.label}',
          style: {
            textOutline: '3px contrast'
          }
        },
        // Circular options
        center: ['50%', '88%'],
        size: '170%',
        startAngle: -100,
        endAngle: 100
      }],
      responsive: {
        rules: [{
          condition: {
            maxWidth: 600
          },
          chartOptions: {
            series: [{
              dataLabels: {
                enabled: true,
                format: '{point.label}',
                style: {
                  textOutline: '3px contrast'
                }
              },
              type: 'item'
            }]
          }
        }]
      },
      accessibility: {
        enabled: false // Disable accessibility features
      }
    });
  
    // Log the total number of dots
    console.log('Total number of dots:', chart.series[0].data.length);
  }
  

  // Tree Chart Functionality

  intilizeoptions(){
    this.treechartOptions = {
      chart: {
        backgroundColor: 'transparent',
        spacingBottom: 20,
        marginRight: 50,
        height: 400,
        width: 600
      },
      title: {
        useHTML: true,
        text: 'State Results Summary',
        align: 'center'
      },
      subtitle: {
        text: this.getTitleText(),
    },
      series: [{
        type: 'treegraph',
        keys: ['parent', 'id', 'id1','collapsed'],
        clip: false,
        data: [],  // Initialize with empty data
        marker: {
          symbol: 'circle',
          radius: 4,
          fillColor: 'black',
          lineWidth: 3
        },
        dataLabels: {
          align: 'left',
          format: '{point.id} {point.status}',  // Adjust format to include additional data
          style: {
            color: 'black',
            textOutline: '6px',
            whiteSpace: 'nowrap',
            fontSize: '10px' ,
          
          },
          x: 15,
          y:0,
          crop: false,
      
        },
        levels: [
          { level: 1, dataLabels: { x: 5, y: 10 } }, // Increase vertical spacing for level 1
          { level: 2, dataLabels: { x: 5, y: 30} }, // Increase vertical spacing for level 2
          { level: 3, colorVariation: { key: 'brightness', to: -0.5 }, dataLabels: { x: 5, y: 20} }, // Increase vertical spacing for level 3
          { level: 4 ,dataLabels: { x: 5, y: 20}},
          { level: 6, dataLabels: { x: 6 } }
        ]
      }],
      credits: {
        enabled: true,
        text: `Created By ${this.firstname} with Idovin Strategies`
      },
    };


  }



 initializeChart(state: string, electionsData: any[]): void {

    if (!this.treechartOptions) {
      this.intilizeoptions();
    }
    this.selectedState = state; // Store the state name
  
    let data: any[] = [{ parent: undefined, id: state, collapsed: true }];
    const addedElections = new Set<string>();
    const addedYears = new Set<string>();
  
    electionsData.forEach((election: any) => {
      if (!addedElections.has(election.ElectionName)) {
        data.push({
          parent: state,
          id: election.ElectionName,
          collapsed: true,
        });
        addedElections.add(election.ElectionName);
      }
  
      const yearId = election.ElectionYear.toString();
      if (!addedYears.has(yearId)) {
        data.push({
          parent: election.ElectionName,
          id: yearId,
          collapsed: true,
        });
        addedYears.add(yearId);
      }
  
      election.ACName.forEach((constituency: any) => {
        data.push({
          parent: yearId,
          id: constituency,
          collapsed: true,
        });
      });
    });
  
    if (!this.treechartOptions.series) {
      this.treechartOptions.series = [];
    }
  
    if (this.treechartOptions.series.length > 0) {
      (this.treechartOptions.series[0] as Highcharts.SeriesTreegraphOptions).data = data;
    } else {
      this.treechartOptions.series.push({
        type: 'treegraph',
        data: data,
      });
    }
  
    // Add a click event listener to the chart
    this.treechartOptions.plotOptions = {
      series: {
        cursor: 'pointer',
        point: {
          events: {
            click: (event: any) => {
              const clickedNodeId = event.point.id;
              this.storeNodeData(clickedNodeId, event.point.parent);
            }
          }
        }
      }
    };
  
    Highcharts.chart('treechart', this.treechartOptions);
  }
  


  // Store the clicked node data in the appropriate variable
storeNodeData(nodeId: string, parentId: string | undefined): void {
  if (!parentId) return; // Skip if it's the root node

  // Determine the type of node and store it in the appropriate variable
  if (parentId === this.selectedState) {
    this.selectedElection = nodeId;
    console.log('Selected Election:', this.selectedElection);
  } else if (parentId === this.selectedElection) {
    this.selectedYear = nodeId;
    console.log('Selected Year:', this.selectedYear);
  } else if (parentId === this.selectedYear) {
    this.selectedConstituency = nodeId;
    console.log('Selected Constituency:', this.selectedConstituency);
    
    // Store the clicked node data
    this.clickedNodes.push({
      election: this.selectedElection || '',  // Default to empty string if null
      year: this.selectedYear,
      constituency: this.selectedConstituency,
    });

    // Fetch candidate details
    this.candiatedetails();
  }
}
treechartfunctionality() {
  const totalvariables = {
    statename: this.state,
  }
  console.log('Tree chart variables:', totalvariables);
  this.apollo.use('probite').watchQuery({
    query: treechartdata,
    variables: totalvariables,
  }).valueChanges.subscribe(({ data }: any) => {
    this.treedata = data.StateTreeDetails;
    console.log("This.treedata:", this.treedata);

    this.initializeChart(this.state, this.treedata);
  });
}

candiatedetails() {
  this.clickedNodes.forEach((nodeData) => {
    const totalvariables = {
      election: nodeData.election,
      electionyear: nodeData.year,
      constituency: nodeData.constituency,
      statename: this.selectedState,
    };

    this.apollo.use('treedata').watchQuery({
      query: particpationdetails,
      variables: totalvariables,
    }).valueChanges.subscribe(({ data }: any) => {
      if (data && data.electionResult) {
        // Log the candidate details for each node
        console.log(`Candidates for ${nodeData.constituency}:`, data.electionResult);
        // Insert the candidate details into the tree chart
        const candidates = data.electionResult.map((candidate: any) => ({
          parent: nodeData.constituency,
          id: `${candidate.name} (${candidate.status})`,
          collapsed: true,
        }));

        // Ensure series and its data exist before accessing
        const series = this.treechartOptions.series?.[0] as Highcharts.SeriesTreegraphOptions;
        if (series && series.data) {
          const constituencyIndex = series.data.findIndex((node: any) => node.id === nodeData.constituency);
          if (constituencyIndex !== -1) {
            series.data.splice(constituencyIndex + 1, 0, ...candidates);
            Highcharts.chart('treechart', this.treechartOptions);
          }
        }
      } else {
        console.warn(`No participation details returned for ${nodeData.constituency}`);
      }
    });
  });
}
  

 



  summarydata(){
    if (this.tabledata && this.tabledata.length > 0) {
      const data = this.tabledata[0];
      this.electors = [data.SumTotalElectors]; // Assuming you have only one value for demonstration
      this.votespolled = [data.SumTotalPolled];
      console.log("this.electors",this.electors);
      console.log("this.votespolled",this.votespolled);
      this.summaryChart()
    }

  }

  summaryChart() {
    const chartOptions: Highcharts.Options = {
      chart: {
        backgroundColor: 'transparent',
        type: 'bar'
      },
      title: {
        text: ''
      },
      xAxis: {
          title: {
            text: '',
            style : {
              fontWeight : 'bold'
            }
          }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Total Voters',
          style : {
            fontWeight : 'bold'
          }
        }
      },
      legend: {
        reversed: true
      },
      plotOptions: {
        series: {
          stacking: 'normal',
          dataLabels: {
            enabled: true
          }
        }
      },
      credits: {
        enabled: true,
        text: `Created By ${this.firstname} with Idovin Strategies`
      },
      series: [
        {
          type: 'bar',
          name: 'Total Votes Polled',
          data: this.votespolled
        },
        {
          type: 'bar',
          name: 'Total Electors',
          data: this.electors
        },
      ]
    };

    Highcharts.chart('summarychart', chartOptions);

  }


// Bubble chart 


bubblechartfunctionality(){
  this.state =  this.lateststate;
  this.election = this.latestelectiontype;

  const bubblechartvariables = {
    statename :  this.lateststate,
    electiontype : this.latestelectiontype
  }

  this.apollo.use('probite').watchQuery({
    query : bubblechart,
    variables : bubblechartvariables
  }).valueChanges.subscribe(({data}:any)=>{
    this.bubblechartdata = data.seatWon;
    console.log("bubble chart data",this.bubblechartdata);
    this.bubbleChart();
  })
}



bubbleChart() {
  if (!this.bubblechartdata) return;

  // Extract unique years and ensure they are strings
  const years: string[] = Array.from(new Set(this.bubblechartdata.map((item: any) => item.year.toString())));

  // Reverse the order of the years so that the highest year appears at the top
  years.reverse();
  console.log('Years:', years);

  // Get the theme colors from Highcharts
  const themeColors = Highcharts.getOptions().colors || [];

  // Prepare series data as an array of objects
  const seriesData = this.bubblechartdata.flatMap((item: any) => {
    return item.partyWins.map((partyWin: any, index: number) => {
      const yearIndex = years.indexOf(item.year.toString());
      console.log(`Year: ${item.year}, Year Index: ${yearIndex}`);

      // Return an object with properties for Highcharts
      return {
       x: partyWin.wins + (index * 0.01),             // x-axis: wins (default to 0 if undefined)
        y: yearIndex,                      // y-axis: index of year in categories
        z: partyWin.wins ?? 1,                              // z-axis: bubble size (default to 1)
        name: partyWin.party,              // Party name
        color: themeColors[index % themeColors.length] // Assign color from theme
      };
    });
  });
  console.log('series data', seriesData);

  const chartOptions: Highcharts.Options = {
    chart: {
      backgroundColor: 'transparent',
      type: 'bubble',
      plotBorderWidth: 1,
      zooming: {
        type: 'xy'
      }
    },
    legend: {
      enabled: false
    },
    title: {
      text: 'Party Wise Seats Won'
    },
    subtitle: {
      text: this.getTitleText()
    },
    xAxis: {
      title: {
        text: 'Party Wins'
      },
      labels: {
        format: '{value}'
      }
    },
    yAxis: {
      categories: years, // Set categories to the years extracted
      title: {
        text: 'Year'
      },
      labels: {
        format: '{value}'
      }
    },
    tooltip: {
      useHTML: true,
      headerFormat: '<table>',
      pointFormat: 
        '<tr><th>Party Name:</th><td>{point.name}</td></tr>' +
        '<tr><th>Wins:</th><td>{point.x:.0f}</td></tr>',  // Ensure no decimal places
      footerFormat: '</table>',
      followPointer: true
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          format: '{point.name}',
          allowOverlap: false,
        },
        states: {
          hover: {
            halo: {
              size: 10, // Size of the halo around the hovered point
              opacity: 0.9 // Opacity of the halo
            },
            brightness: 0.3 // Brighten the bubble on hover
          }
        }
      }
    },
    credits: {
      enabled: true,
      text: `Created By ${this.firstname} with Idovin Strategies`
    },
    series: [{
      type: 'bubble',
      data: seriesData
    }]
  };

  Highcharts.chart('bubblechart', chartOptions); // Replace 'bubblechart' with the ID of your HTML element
}
  

}
