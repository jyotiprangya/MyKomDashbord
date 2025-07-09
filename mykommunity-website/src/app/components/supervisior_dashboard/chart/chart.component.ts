import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { ApiService } from 'src/app/services/api.service';

// import {
//   ApexNonAxisChartSeries,
//   ApexResponsive,
//   ApexChart,
//   ApexPlotOptions,
//   ApexGrid,
// } from "ng-apexcharts";
import { Router } from '@angular/router';

// export type ChartOptions = {
//   series: ApexNonAxisChartSeries;
//   chart: ApexChart;
//   responsive: ApexResponsive[];
//   plotOptions: ApexPlotOptions;
//   grid: ApexGrid
// };


//const socket = io('http://localhost:3000');

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  @ViewChild("chart")
  chart2!: ChartComponent;
 // public chartOptions: Partial<ChartOptions>;


  length = '';
  private chart: any; 
  data: number[] = []; // Array to store progressive data
  timer: any;


  // carouselItems = [
  //   { image: "chartCanvas", title: 'Slide 1', description: 'Slide 1 description' },
  //   { image: '../../../../assets/bg-11.jpg', title: 'Slide 2', description: 'Slide 2 description' },
  //   { image: '../../../../assets/bg-11.jpg', title: 'Slide 3', description: 'Slide 3 description' }
  // ];

  dailyTrafficChartBar: any;
  monthlyTrafficChartBar: any;
  dailyBandwithUsage: any;
  trafficGrowthChart: any;
  totalLength: any;
  totalLengthofvisitorinside: any;

  approvedUserLength: any;
  unRegRULength: any;

  pendingUserLength: any;
  rejectedUserLength: any;

  totalbookingLength: any;
  totalcancelbookingLength: any;
  totalbookedbookingLength: any;
  

  page: number = 1;
  showScreen = false;

  readData: any = [];
  readDataActive: any = [];
  readDataVehicle: any = [];

  readData2: any = [];
  readData3: any = [];
  readunRegRU: any = [];

  readData4: any = [];
  readData5: any = [];
  readData6: any = [];
  readData7: any = [];
  readData8: any = [];
  map: any ={
    false: "Out",
    true: "Inside"
  }

  readDatalocalservice: any = [];
  alllocalservice: any = [];

  complaintRESOLVED:any = [];
  complainNEW:any = [];
  complaintIN_PROGRESS:any = [];
  complaintON_HOLD:any = [];
  complaintRE_OPENED:any = [];

  Visitor_pending_approval:any = [];
  Visitor_inside_building:any = [];
  Visitor_parcel_at_gate:any = [];




  constructor(
    private service: ApiService, private router: Router
  ) {
   
  }
  readRegRU = this.readData8.length - this.readunRegRU.length;

   ngOnInit() {
     this.createChartbar();
     this.getAllFlatData();
   this.getAllVehicleData();
   this.getAllActiveUserData();
    this.getComplaintResolved();
    this.getComplaintnew();
    this.getComplaintIn_progress();
    this.getComplaintRe_opened();
    this.getComplainton_hold();
    this.getAllApprovedUserData();
    this.getAllunRegRUData();

    this.getAllPendingUserData();
    this.getAllRejectedUserData();
    this.getAllUserData();
    this.getAllAmenityTypeData();
    this.getAllAmenityCancelledBookingData();
    this.getAllAmenityBookedBookingData();
    this.getVisitor_pending_approval();
    this.getparcel_atgate();
    this.getInside_building();
    this.getLocalServiceProviderInsideList();
    // this.updateDoughnutChart();
    // this.createGroupedBarChart('performanceChart', ['Q1', 'Q2', 'Q3', 'Q4']);
    // this.updateDoughnutChart5();
  }
  getAllFlatData(){
    this.service.getFlat().subscribe((res)=>{
      console.log(res,"res==>");
      this.readData8 = res.data;

    });
  }

  getAllUserData() {

    this.service.getUserlist().subscribe((res) => {
      console.log(res, "res==>");
      this.readData = res.data;
      this.totalLength = (res.data).length;
      console.log(this.readData);
      console.log(this.totalLength);
      this.updateDoughnutChart();
    });

  }

  getAllActiveUserData() {

    this.service.getUserlist().subscribe((res) => {
      console.log(res, "res==>");
      this.readDataActive = res.data.filter((user: { disabled: boolean; }) => user.disabled === false);
      
    });

  }
  getAllVehicleData(){

    this.service.getVehiclelist().subscribe((res)=>{
      console.log(res,"res==>");
      this.readDataVehicle = res.data;
     
      
      
    });

  }
  getAllApprovedUserData() {

    this.service.getapprovedUserlist().subscribe((res) => {
      console.log(res, "res==>");
      this.readData3 = res.data;
      this.approvedUserLength = (res.data).length;
      console.log(this.approvedUserLength);
      this.updateDoughnutChart2();
    });

  }
  
createGroupedBarChart(elementId: string, labels: string[]) {
  new Chart(elementId, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Sales',
          data: [100],
          backgroundColor: '#42a5f5',
          borderColor: '#1e88e5',
          borderWidth: 1
        },
        {
          label: 'Expenses',
          data: [150],
          backgroundColor: '#66bb6a',
          borderColor: '#57a05a',
          borderWidth: 1
        },
        {
          label: 'Profit',
          data: [50],
          backgroundColor: '#ffa726',
          borderColor: '#ff9800',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          stacked: false,
          title: {
            display: true,
            text: 'Quarters'
          }
        },
        y: {
          stacked: false,
          beginAtZero: true,
          title: {
            display: true,
            text: 'Amount'
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top'
        }
      }
    }
  });
}
  getAllunRegRUData() {

    this.service.getunregRU().subscribe((res) => {
      console.log(res, "res==>");
      this.readunRegRU = res.data;
      console.log(res.data);
      this.unRegRULength = (res.data).length;
      console.log(this.unRegRULength);
     // this.updateDoughnutChart();
    });

  }
  
  getAllPendingUserData() {

    this.service.getpendingUserlist().subscribe((res) => {
      console.log(res, "res==>");
      this.readData4 = res.data;
      this.pendingUserLength = (res.data).length;
      console.log(this.pendingUserLength);
    });

  }
  getAllRejectedUserData() {

    this.service.getUserlist().subscribe((res) => {
      console.log(res, "res==>");
      this.readData5 = res.data.filter((user: { disabled: boolean; }) => user.disabled === true);
      this.rejectedUserLength = (res.data).length;
      console.log(this.rejectedUserLength);
    });

  }

  getComplaintResolved() {
    this.service.getComplaintResolved().subscribe((res) => {
      console.log(res, "res==>");
      this.complaintRESOLVED = res.data;

      // this.length = res.data.length;
      // console.log(this.length);
      console.log("length....");
      // this.readData = res.data;
      // console.log(this.readData.status);
      this.updateChartData();
      this.updateDoughnutChart4();


    });
  }
  getComplaintnew() {
    this.service.getComplaintNew().subscribe((res) => {
      console.log(res, "res==>");
      this.complainNEW = res.data;

     // = res.data.length;
      console.log(this.complainNEW.length);
      console.log("length....");
      // this.readData = res.data;
      // console.log(this.readData.status);
      this.updateChartData();
    //  this.updateDoughnutChart4();

    });
  }
    getComplaintIn_progress() {
      this.service.getComplaintIn_progress().subscribe((res) => {
        console.log(res, "res==>");
        this.complaintIN_PROGRESS = res.data;

       // this.length = res.data.length;
        console.log(this.length);
        console.log("length....");
        // this.readData = res.data;
        // console.log(this.readData.status);
        this.updateChartData();
       // this.updateDoughnutChart4();

      });
    } 
    getComplainton_hold() {
      this.service.getComplaintOn_hold().subscribe((res) => {
        console.log(res, "res==>");
        this.complaintON_HOLD = res.data;

       // this.length = res.data.length;
        console.log(this.length);
        console.log("length....");
        // this.readData = res.data;
        // console.log(this.readData.status);
        this.updateChartData();

      });
    } 
    getComplaintRe_opened() {
      this.service.getComplaintRe_opened().subscribe((res) => {
        console.log(res, "res==>");
        this.complaintRE_OPENED = res.data;

       // this.length = res.data.length;
        console.log(this.length);
        console.log("length....");
        // this.readData = res.data;
        // console.log(this.readData.status);
        this.updateChartData();

      });
    }


    updateChartData() {
      const chartData = [
        this.complainNEW.length,
        this.complaintRESOLVED.length,
        this.complaintIN_PROGRESS.length,
        this.complaintON_HOLD.length,
        this.complaintRE_OPENED.length,
      ];
    console.log(chartData);
      this.chart.data.datasets[0].data = chartData;
      this.chart.update();
      console.log(chartData);

    }

    getVisitor_pending_approval() {
    //   this.service.getPending_approval().subscribe((res) => {
    //     console.log(res, "res==>");
    //     this.Visitor_pending_approval = res.data;
  
  
    //   });
    // }
    this.service.getActivity().subscribe((res)=>{
      console.log(res,"res==>");
      this.Visitor_pending_approval = res.data.filter((item:any) => item.status === "PENDING_APPROVAL");
      console.log(this.Visitor_pending_approval);
      this.Visitor_pending_approval.sort((a:any, b:any) => {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
      this.updateDoughnutChart5();
      //this.totalLength = (res.data).length;
    });
  }
   
    getInside_building() {
      this.service.Visitor_Inside_building().subscribe((res) => {
        console.log(res, "res==>");
        this.Visitor_inside_building = res.data;
        this.Visitor_inside_building.sort((a:any, b:any) => {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });
        this.totalLengthofvisitorinside = (res.data).length;
  
  
      });
    }
    getparcel_atgate() {
      this.service.getActivity().subscribe((res) => {
        console.log(res, "res==>");
        this.Visitor_parcel_at_gate = res.data.filter((item:any) => item.status === "RECEIVED_AT_GATE");
  
      });
    }
  // getAllLocalserviceData(){
  //   this.service.getLocalServiceProvider().subscribe((res)=>{
  //     console.log(res,"res==>");
  //     this.readData2 = res.data;
  //   });
  // }


  getAllAmenityTypeData() {
    this.service.getAmenity().subscribe((res) => {
      console.log(res, "res==>");
      this.readData2 = res.data;
      this.readData2.sort((a: any, b: any) => {
        return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
      });
      this.totalbookingLength = (res.data).length;
      console.log(this.totalbookingLength);
this.updateDoughnutChart3();
    });
  }

  getLocalServiceProviderInsideList() {
    this.service.getLocalServiceProvider().subscribe((res) => {
      console.log(res, "res==>");
      this.alllocalservice =res.data;

      this.readDatalocalservice =res.data.filter((item:any) => item.isInside === true);
     console.log(this.readDatalocalservice);
    });
  }

  getAllAmenityCancelledBookingData() {
    this.service.getCancelledBooking().subscribe((res) => {
      console.log(res, "res==>");
      this.readData6 = res.data;
      // this.readData2.sort((a: any, b: any) => {
      //   return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
      // });
      this.totalcancelbookingLength = (res.data).length;
      console.log(this.totalcancelbookingLength);
      // this.updateDoughnutChart3();


    });
  }
  getAllAmenityBookedBookingData() {
    this.service.getBookedBooking().subscribe((res) => {
      console.log(res, "res==>");
      this.readData7 = res.data;
      this.totalbookedbookingLength = this.readData7.length;
      console.log(this.totalbookedbookingLength);
     // this.updateDoughnutChart3();


    });
  }
  createDoughnutChart(elementId: string, labels: string[], data: number[]) {
    new Chart(elementId, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: ['#3498db', '#66bb6a', '#ffa726','#cbdacd'],
          hoverBackgroundColor: ['#2980b9', '#57a05a', '#ff9800','#cbdacd'],
          borderColor: ['#2980b9', '#57a05a', '#ff9800','#cbdacd'], // Border colors for each segment
          borderWidth: 2 // Set the border width
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',  
            align: 'center',    
            // labels: {
            //   boxWidth: 10,
            //   padding: 15,
            //   usePointStyle: false,  
            // }
          }
        },
        cutout: '70%',
        // layout: {
        //   padding: {
        //     left: 10,
        //     right: 10,
        //     top: 10,
        //     bottom: 10
        //   }
        // }
      }
    });
  }
  
  createDoughnutChart2(elementId: string, labels: string[], data: number[]) {
    new Chart(elementId, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: ['#3498db', '#66bb6a', '#ffa726'],
          hoverBackgroundColor: ['#2980b9', '#57a05a', '#ff9800']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'bottom'
          }
        },
        cutout: '70%' // Increased to make it look more like a ring
      }
    });
  }
  updateDoughnutChart() {
    const data = [
      this.readData8.length, (this.readData8.length - this.readunRegRU.length), this.readunRegRU.length
    ];
  
    // Check if all data values are zero
    const allZero = data.every(value => value === 0);
  
    if (allZero) {
      // Show one circle with a blank border if all data is zero
      this.createDoughnutChart(
        'flatChart',
        ['Total Flat', 'Registered', 'Unregistered',''],// Single label
        [0,0,0,1] // Single data point
      );
    } else {
    this.createDoughnutChart(
      'flatChart',
      ['Total Flat', 'Registered', 'Unregistered',''],
      [this.readData8.length, (this.readData8.length - this.readunRegRU.length), this.readunRegRU.length,0]
    );
  }
}
updateDoughnutChart3() {
  const data = [
    this.totalbookingLength, this.totalcancelbookingLength, this.totalbookedbookingLength
  ];

  // Check if all data values are zero
  const allZero = data.every(value => value === 0);

  if (allZero) {
    // Show one circle with a blank border if all data is zero
    this.createDoughnutChart(
      'amenityChart',
      ['Total Amenity', 'Cancelled', 'Booked',''], // Single label
      [0,0,0,1] // Single data point
    );
  } else {
  this.createDoughnutChart(
    'amenityChart',
    ['Total Amenity', 'Cancelled', 'Booked',''],
    [this.totalbookingLength, this.totalcancelbookingLength, this.totalbookedbookingLength,0]
  );
  }
}
updateDoughnutChart4() {
  const data = [
    this.complainNEW.length,
    this.complaintRESOLVED.length,
    this.complaintIN_PROGRESS.length,0
  ];

  // Check if all data values are zero
  const allZero = data.every(value => value === 0);

  if (allZero) {
    // Show one circle with a blank border if all data is zero
    this.createDoughnutChart(
      'complainChart',
      ['New Complaint', 'Resolved','In Progress',''], // Single label
      [0,0,0,1] // Single data point
    );
  } else {
    // Regular chart with actual data
    this.createDoughnutChart(
      'complainChart',
      ['New Complaint', 'Resolved', 'In Progress',''],
      data
    );
  }
}


updateDoughnutChart5() {
  const data = [
    this.Visitor_pending_approval.length,this.Visitor_inside_building.length,this.Visitor_parcel_at_gate.length
  ];

  // Check if all data values are zero
  const allZero = data.every(value => value === 0);

  if (allZero) {
    // Show one circle with a blank border if all data is zero
    this.createDoughnutChart(
      'chart',
      ['Approval pending', 'Entered', 'Parcels',''],
      [0,0,0,1] // Single data point
    );
  } else {
this.createDoughnutChart(
  'chart',
  ['Approval pending', 'Entered', 'Parcels',''],
  [this.Visitor_pending_approval.length,this.Visitor_inside_building.length,this.Visitor_parcel_at_gate.length,0]
);
}
}
updateDoughnutChart2() {
  const data = [
    this.readData3.length, this.readData4.length, this.readData5.length
  ];

  // Check if all data values are zero
  const allZero = data.every(value => value === 0);

  if (allZero) {
    // Show one circle with a blank border if all data is zero
    this.createDoughnutChart(
      'userChart',
      ['Approved User', 'Pending User', 'Rejected User',''],
      [0,0,0,1] // Single data point
    );
  } else {
  this.createDoughnutChart(
    'userChart',
    ['Approved User', 'Pending User', 'Rejected User'],
    [this.readData3.length, this.readData4.length, this.readData5.length,0]
  );
}
}

  // createChart() {
  //   const canvas = document.getElementById('chartCanvas') as HTMLCanvasElement;
  //   const ctx = canvas.getContext('2d');

  //   this.chart = new Chart(ctx!, {
  //     type: 'line', // Specify the type as 'line'
  //     data: {
  //       labels: ["Jan",
  //         "Feb",
  //         "Mar",
  //         "Apr",
  //         "May",
  //         "Jun",
  //         "Jul",
  //         "Aug",
  //         "Sept",
  //         "Oct",
  //         "Nov",
  //         "Dec"], // Specify the labels for the chart
  //       datasets: [
  //         {

  //           label: 'Visitor Count',
  //           data: [40,
  //             50,
  //             70,
  //             65,
  //             84,
  //             75,
  //             80,
  //             70,
  //             50,
  //             70,
  //             65,
  //             104,
  //             75,
  //             80,
  //             70,
  //             50,
  //             70,
  //             65,
  //             94,
  //             75,
  //             80,
  //             70,
  //             50,
  //             70,
  //             65,
  //             86,
  //             75,
  //             80,
  //             70,
  //             50,
  //             70], // Specify the data for the chart
  //           fill: false,
  //           // Disable filling the area under the line
  //           borderColor: 'rgb(240, 80, 107)',
  //           backgroundColor: 'rgb(240, 80, 107)',
  //           pointRadius: 0,
  //           // tension: 0.1 
  //           // Adjust the line curve (0 for straight lines)

  //         },
  //         // {

  //         //     label: 'Visitor Entry',
  //         //     data: [
  //         //        50,
  //         //         70,
  //         //         75,
  //         //         94,
  //         //         75,
  //         //         90,
  //         //         70,
  //         //         50,
  //         //         70,
  //         //         65,
  //         //         104,
  //         //         175,
  //         //         80,
  //         //         70,
  //         //         50,
  //         //         70,
  //         //         65,
  //         //         94,
  //         //         75,
  //         //         80,
  //         //         70,
  //         //         50,
  //         //         70,
  //         //         65,
  //         //         86,
  //         //         75,
  //         //         80,
  //         //         70,
  //         //         50,
  //         //         70
  //         //       ], // Specify the data for the chart
  //         //     fill: true, // Disable filling the area under the line
  //         //     borderColor: 'rgb(240, 80, 107)',
  //         //     backgroundColor:'rgb(240, 80, 107)',
  //         //     pointRadius: 0, // Specify the line color   //rgb(240, 80, 107)
  //         //     //tension: 1 ,

  //         //     // Adjust the line curve (0 for straight lines)

  //         //   }

  //       ]
  //     },

  //     options: {
  //       responsive: true,
  //       scales: {
  //         y: {
  //           beginAtZero: true
  //         },

  //       },
  //       interaction: {
  //         intersect: false,
  //         mode: 'index',
  //       },
  //       animations: {
  //         tension: {
  //           duration: 1000,
  //           easing: 'linear',
  //           from: 1,
  //           to: 0.5,
  //           loop: false
  //         }

  //       },
  //       plugins: {
  //         legend: {
  //           position: 'top',
  //           display: true
  //         },
  //         tooltip: {
  //           callbacks: {
  //             // footer: footer,
  //           }
  //         }
  //       },
  //       // Make the chart responsive
  //       // scales: {
  //       //   x: {
  //       //     beginAtZero: true // Start the y-axis at zero
  //       //   }
  //       // }
  //     }
  //   });
  // }
  createChartbar() {
    const canvas = document.getElementById('chartCanvasbar') as HTMLCanvasElement;
    const ctx4 = canvas.getContext('2d');
    this.getComplaintnew();
    console.log(this.complainNEW);
    
    this.chart = new Chart(ctx4!, {
        type: 'bar',
        data: {
            labels: ['New', 'Resolved', 'In Progress', 'On Hold ', 'Re-Opened'],
            datasets: [
                {
                    label: 'Complain Status',
                    data: [
                        this.complainNEW.length,
                        this.complaintRESOLVED.length,
                        this.complaintIN_PROGRESS.length,
                        this.complaintON_HOLD.length,
                        this.complaintRE_OPENED.length
                    ],
                    backgroundColor: [
                        '#42a5f5',
                        '#66bb6a',
                        '#ffa726',
                        'rgba(255, 99, 132)',
                        'darkcyan'
                    ],
                    // {
                    //   label: 'Sales',
                    //   data: [100],
                    //   backgroundColor: '#42a5f5',
                    //   borderColor: '#1e88e5',
                    //   borderWidth: 1
                    // },
                    // {
                    //   label: 'Expenses',
                    //   data: [150],
                    //   backgroundColor: '#66bb6a',
                    //   borderColor: '#57a05a',
                    //   borderWidth: 1
                    // },
                    // {
                    //   label: 'Profit',
                    //   data: [50],
                    //   backgroundColor: '#ffa726',
                    //   borderColor: '#ff9800',
                    //   borderWidth: 1
                    // }
                    borderColor: [
                        '#1e88e5',
                        '#57a05a',
                        '#ff9800',
                        'rgba(255, 99, 132)',
                        'rgba(54, 162, 235)'
                    ],
                    borderWidth: 2,
                    borderRadius: 5,
                    barThickness: 40, // Set a fixed thickness for the bars
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                },
                x: {
                    // You can also add padding for the category width if needed
                    stacked: false, // Make sure this is set to false if you want individual bars
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    display: true
                }
            }
        }
    });
}

  user() {
    this.router.navigate(['/supervisor/user'])
  }

  complain(){
    this.router.navigate(['/supervisor/complain']);
  }
  services(){
    this.router.navigate(['/supervisor/localservices']);
  }
  DHhistory(){
    this.router.navigate(['/supervisor/dailyhelpentryexit']);
  }
  flat(){
    this.router.navigate(['/supervisor/flat']);
  }
  unRegflat(){
    this.router.navigate(['/supervisor/unRegflat']);
  }
  Amenities(){
    this.router.navigate(['/supervisor/booking']);
  }
  Activity(){
    this.router.navigate(['/supervisor/activity']);
  }
  // createpieChart() {
  //   const canvas = document.getElementById('chartCanvaspie') as HTMLCanvasElement;
  //   const ctx2 = canvas.getContext('2d');

  //   this.chart = new Chart(ctx2!, {
  //     type: 'polarArea', // Specify the type as 'polarArea'
  //     data: {
  //       labels: ['New', 'Resolved', 'In Progress', 'On Hold ', 'Re-Opened'], // Specify the labels for the chart
  //       datasets: [
  //         {
  //           label: 'Data Set 1',
  //           data: [30, 50, 40, 45, 30], // Specify the data for the chart
  //           backgroundColor: ['rgba(255, 0, 0, 0.6)', 'rgba(1, 255, 100, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)'], // Specify the background colors for each segment
  //           borderColor: ['rgba(255, 0, 0, 0.6)', 'rgba(1, 255, 100, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)'], // Specify the border colors for each segment
  //           borderWidth: 1 // Specify the border width for each segment
  //         }
  //       ]
  //     },
  //     options: {
  //       responsive: true // Make the chart responsive
  //     }
  //   });
  //   //     type: 'pie',
  //   //   data: {
  //   //     labels: ['New','Resolved', 'In Progress', 'On Hold ','Re-Opened'],
  //   //     datasets: [
  //   //       {
  //   //         label: 'Data Set 1',
  //   //         data: [10, 30,7, 5,10],
  //   //         backgroundColor: ['rgba(255, 0, 0, 0.6)','rgba(1, 255, 100, 0.6)','rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)' ],
  //   //         borderWidth: 1,
  //   //       }
  //   //     ]
  //   //   },
  //   //   options: {
  //   //     responsive: true,
  //   //     plugins: {
  //   //       legend: {
  //   //         display: true, // Set it to 'false' if you want to hide the legend
  //   //       }
  //   //     }
  //   //   }
  //   // });
  // }

  // createdoughnutChart() {
  //   const canvas = document.getElementById('chartCanvasdoughnut') as HTMLCanvasElement;
  //   const ctx2 = canvas.getContext('2d');

  //   this.chart = new Chart(ctx2!, {
  //     type: 'doughnut', // Specify the type as 'polarArea'
  //     data: {
  //       labels: ['New', 'Resolved', 'In Progress', 'On Hold ', 'Re-Opened'], // Specify the labels for the chart
  //       datasets: [
  //         {
  //           label: 'Data Set 1',
  //           data: [30, 50, 40, 45, 30], // Specify the data for the chart
  //           backgroundColor: ['rgba(255, 0, 0, 0.6)', 'rgba(1, 255, 100, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)'], // Specify the background colors for each segment
  //           borderColor: ['rgba(255, 0, 0, 0.6)', 'rgba(1, 255, 100, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)'], // Specify the border colors for each segment
  //           borderWidth: 1 // Specify the border width for each segment
  //         }
  //       ]
  //     },
  //     options: {
  //       responsive: true // Make the chart responsive
  //     }
  //   });
  // }
 

  // createChartradar() {
  //   const canvas = document.getElementById('chartCanvasradar') as HTMLCanvasElement;
  //   const ctx3 = canvas.getContext('2d');

  //   this.chart = new Chart(ctx3!, {
  //     //   type: 'radar', // Specify the type as 'radar'
  //     //   data: {
  //     //     labels: ['Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5'], // Specify the labels for the chart
  //     //     datasets: [
  //     //       {
  //     //         label: 'Data Set 1',
  //     //         data: [50, 20, 30, 40, 50], // Specify the data for the chart
  //     //         backgroundColor: 'rgba(75, 192, 192, 0.2)', // Specify the background color of the radar area
  //     //         borderColor: 'rgba(75, 192, 192, 1)', // Specify the border color of the radar area
  //     //         borderWidth: 1, // Specify the border width of the radar area
  //     //         pointBackgroundColor: 'rgba(75, 192, 192, 1)', // Specify the background color of the data points
  //     //         pointBorderColor: '#fff', // Specify the border color of the data points
  //     //         pointRadius: 3 // Specify the radius of the data points
  //     //       },
  //     //       {
  //     //         label: 'Data Set 2',
  //     //         data: [40, 40, 20, 20, 50], // Specify the data for the chart
  //     //         backgroundColor: 'rgba(75, 19, 192, 0.2)', // Specify the background color of the radar area
  //     //         borderColor: 'rgba(75, 192, 19, 1)', // Specify the border color of the radar area
  //     //         borderWidth: 1, // Specify the border width of the radar area
  //     //         pointBackgroundColor: 'rgba(75, 192, 192, 1)', // Specify the background color of the data points
  //     //         pointBorderColor: '#fff', // Specify the border color of the data points
  //     //         pointRadius: 3 // Specify the radius of the data points
  //     //       }
  //     //     ]
  //     //   },
  //     //   options: {
  //     //     responsive: true // Make the chart responsive
  //     //   }
  //     // });
  //     type: 'pie',
  //     data: {
  //       labels: ['Label 1', 'Label 2', 'Label 3'],
  //       datasets: [
  //         {
  //           label: 'Data Set 1',
  //           data: [10, 20, 30],
  //           backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)'],
  //           borderWidth: 1,
  //         }
  //       ]
  //     },
  //     options: {
  //       responsive: true,
  //       plugins: {
  //         legend: {
  //           display: true, // Set it to 'false' if you want to hide the legend
  //         }
  //       }
  //     }
  //   });
  // }
}
