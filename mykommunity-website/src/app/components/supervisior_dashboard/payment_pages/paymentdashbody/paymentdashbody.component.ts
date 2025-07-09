import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-paymentdashbody',
  templateUrl: './paymentdashbody.component.html',
  styleUrls: ['./paymentdashbody.component.css']
})
export class PaymentdashbodyComponent implements OnInit {

  constructor(private service:ApiService,private router:Router) { }

  readData2:any = [];
  readData:any = [];
  readData3:any = [];
  readData4:any = [];
  readData5:any = [];
  readData6:any = [];
  readData7:any = [];


  ength='';
  private chart: any; // Reference to the Chart.js chart
  data: number[] = []; // Array to store progressive data
timer: any;



  ngOnInit(): void {
    this.getAllVendorData();
    this.getAllAccountData();
    this.getAllBudgeteData();
    this.getAllGLData();
    this.getAllCOAData();
    this.getAllPaidPaymentData();
    this.getAllPendingPaymentData();
    this.createCharts();
   // this.createChartbar();

  }


  getAllVendorData(){
    this.service.getPayment_vendor().subscribe((res)=>{
      console.log(res,"res==>");;
      this.readData = res.data;
      
    });
  }
  getAllAccountData(){
    this.service.getSocietyAccount().subscribe((res)=>{
      console.log(res,"res==>");
      this.readData2 = res.data;
      
    });
  }
  getAllBudgeteData(){
    this.service.getsocity_budget().subscribe((res)=>{
      console.log(res,"res==>");
      this.readData3 = res.data;
      
    });
  }
  getAllGLData(){
    this.service.getGeneralLedger().subscribe((res)=>{
      console.log(res,"res==>");
      this.readData4 = res.data;

    });
  }
  getAllCOAData(){
    this.service.getChartOfAccount().subscribe((res)=>{
      console.log(res,"res==>");
      this.readData5 = res.data;

    });
  }
  getAllPaidPaymentData(){
    this.service.getall_dues().subscribe((res)=>{
      console.log(res,"res==>");
     this.readData6 = res.data.filter((item:any) => item.paymentStatus === "PAID");
     this.updateChart();

  });

  }
  getAllPendingPaymentData(){
    this.service.getall_dues().subscribe((res)=>{
      console.log(res,"res==>");
     this.readData7 = res.data.filter((item:any) => item.paymentStatus === "PENDING");
    this.updateChart();

  });

  }
  createCharts() {
    new Chart('performanceChart', {
      type: 'bar',
      data: {
        labels: ['School 1', 'School 2', 'School 3'],
        datasets: [
          {
            label: 'Performance',
            data: [75, 65, 85],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          },
        ],
      },
    });

    new Chart('passPercentageChart', {
      type: 'doughnut',
      data: {
        labels: ['Boys', 'Girls'],
        datasets: [
          {
            label: 'Pass Percentage',
            data: [50, 50],
            backgroundColor: ['#4BC0C0', '#FF9F40'],
          },
        ],
      },
    });
  }
  createPieChart(elementId: string, labels: string[], data: number[]) {
    if (this.chart) {
      this.chart.destroy(); // Destroy previous chart if it exists
    }
    this.chart = new Chart(elementId, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: ['#3498db', '#66bb6a','#cbdacd'],
          hoverBackgroundColor: ['#2980b9', '#57a05a','#cbdacd']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'bottom'
          }
        }
      }
    });
  }
 
updateChart() {
  const data = [
    this.readData7.length, this.readData6.length
  ];

  // Check if all data values are zero
  const allZero = data.every(value => value === 0);

  if (allZero) {
    // Show one circle with a blank border if all data is zero
    this.createPieChart(
      'paymentChart',
      ['Pending', 'Paid','No Data'],// Single label
      [0,0,1] // Single data point
    );
  } else  { // Ensure both datasets are available
    this.createPieChart(
      'paymentChart',
      ['Pending', 'Paid'],
      [this.readData7.length, this.readData6.length]
    );
    console.log('Pending data length:', this.readData7.length);
    console.log('Paid data length:', this.readData6.length);
  }
}
  user() {
    this.router.navigate(['/supervisor/paymentdashboard/dashboard'])
  }
  complain(){
    this.router.navigate(['/supervisor/paymentdashboard/complain']);
  }
  services(){
    this.router.navigate(['/supervisor/paymentdashboard/localservices']);
  }
  flat(){
    this.router.navigate(['/supervisor/paymentdashboard/flat']);
  }
  payment(){
    this.router.navigate(['/supervisor/paymentdashboard/payment']);
  }
  account() {
    this.router.navigate(['/supervisor/paymentdashboard/account'])
  }
  vendorlist(){
    this.router.navigate(['/supervisor/paymentdashboard/vendorlist']);
  }
  budget(){
    this.router.navigate(['/supervisor/paymentdashboard/budget']);
  }
  GL(){
    this.router.navigate(['/supervisor/paymentdashboard/gl']);
  }
  COA(){
    this.router.navigate(['/supervisor/paymentdashboard/chartoa']);
  } 

  createChart() {
    const canvas = document.getElementById('chartCanvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    this.chart = new Chart(ctx!, {
      type: 'line', // Specify the type as 'line'
      data: {
        labels: ["Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec"], // Specify the labels for the chart
        datasets: [
          {
            
            label: 'Visitor Count',
            data: [ 40,
              50,
              70,
              65,
              84,
              75,
              80,
              70,
              50,
              70,
              65,
              104,
              75,
              80,
              70,
              50,
              70,
              65,
              94,
              75,
              80,
              70,
              50,
              70,
              65,
              86,
              75,
              80,
              70,
              50,
              70], // Specify the data for the chart
            fill: false,
             // Disable filling the area under the line
             borderColor: 'rgb(240, 80, 107)',
             backgroundColor:'rgb(240, 80, 107)',
            pointRadius: 0,
           // tension: 0.1 
            // Adjust the line curve (0 for straight lines)
            
          },
          // {
            
          //     label: 'Visitor Entry',
          //     data: [
          //        50,
          //         70,
          //         75,
          //         94,
          //         75,
          //         90,
          //         70,
          //         50,
          //         70,
          //         65,
          //         104,
          //         175,
          //         80,
          //         70,
          //         50,
          //         70,
          //         65,
          //         94,
          //         75,
          //         80,
          //         70,
          //         50,
          //         70,
          //         65,
          //         86,
          //         75,
          //         80,
          //         70,
          //         50,
          //         70
          //       ], // Specify the data for the chart
          //     fill: true, // Disable filling the area under the line
          //     borderColor: 'rgb(240, 80, 107)',
          //     backgroundColor:'rgb(240, 80, 107)',
          //     pointRadius: 0, // Specify the line color   //rgb(240, 80, 107)
          //     //tension: 1 ,
              
          //     // Adjust the line curve (0 for straight lines)
              
          //   }
            
        ]
      },
     
      options: {
        responsive: true, 
        animations: {
          tension: {
            duration: 1000,
            easing: 'linear',
            from: 1,
            to: 0.5,
            loop: false
          }
        
    },
   // Make the chart responsive
        scales: {
          y: {
            beginAtZero: true // Start the y-axis at zero
          }
        }
      }
    });
  }

  createChartbar() {
    const canvas = document.getElementById('chartCanvasbar') as HTMLCanvasElement;
const ctx4 = canvas.getContext('2d');

this.chart = new Chart(ctx4!, {
  type: 'bar',
  data: {
    labels: ['Paid', 'Unpaid'],
    datasets: [
      {
        data: [50, 30],
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1
      }
    ]
  },
  options: {
    responsive: true,
  
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      }
    }
  }
});
}


}
