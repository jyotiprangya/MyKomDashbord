import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DownloadConfirmDialogComponent } from '../../download-confirm-dialog/download-confirm-dialog.component';

@Component({
  selector: 'app-chargelist',
  templateUrl: './chargelist.component.html',
  styleUrls: ['./chargelist.component.css']
})
export class ChargelistComponent implements OnInit {

 
  closeResult: any;
  form:any= UntypedFormGroup;
  loading = false;
  id: any;
  selectedBlock: any = {
    id:0, block_name:''
  };
  floor: any;
  constructor(private service:ApiService,    private router: Router,
   private fb: UntypedFormBuilder, private modalService: NgbModal, 
   private _location: Location,private dialog: MatDialog,private cdr: ChangeDetectorRef) { }

  totalLength:any;
  totalhousetypeLength:any;
  totalhousetypeLength2:any;


  page:number = 1;
  readData:any = [];
  readData2:any = [];
  readData3:any = [];
  readData4:any = [];
  readData5:any = [];
  readData6:any = [];


  getparamid:any;
  societyId=sessionStorage.getItem('societyId');
  
  showScreen = false;
  showScreen2 = false;
  showScreen3 = false;
  value: any;
  value1: any;
  value2: any;
  value3: any;
  selectedValue: string = 'Fixed';
  types: string[] | undefined = ['Fixed', 'Area Based', 'Area Based on House type'];
  form1!: UntypedFormGroup;
  form2!: UntypedFormGroup;
  form3!: UntypedFormGroup;
  amounts: string[] = []; 
  ids: string[] = [];
  role=sessionStorage.getItem('role');
  sortDirection: { [key: string]: boolean } = {};
  isModalOpen = false;
  hiddenColumns: any[] = [];
  displayedColumns: any[] = []; 
  selectedColumn: any = null; 
  selectedColumnName: string | null = null;
  selectedRecord: any[] = [];
  isDropdownOpen = false;
  filteredData: any[] = [];
  enabledBlocks: any[] = [];  
  disabledBlocks: any[] = [];
  searchTerm: string = ''; 
  originalData: any[] = []; 
  
  ngOnInit(): void {
    this.getAllData();
    this.getAllAccountData();
    this.getAllCOAData();
this.updateColumnLists();
this. getAllhousetypeData();

//  this.loadData();
//   this.form = this.fb.group({
//     type: [0, Validators.required]
//   });
//this.getAllrentaltypeData();
    

    this.form = this.fb.group({
      chargeName: [null],
     
      accountId: [''],
      chartOfAccountId: [null],
      desc: [''],
      isGst:[false],
     
  
      chargeData: this.fb.array([
        this.fb.group({
        amount: '',  
        amountPerUnit: '',
        houseTypeId:'' 
        })
      ]) , 
    });
    this.form1 = new UntypedFormGroup({
      chargeName: new UntypedFormControl('', [Validators.required]),
     
      accountId:new UntypedFormControl('', [Validators.required]),
      chartOfAccountId: new UntypedFormControl('', [Validators.required]),
      desc: new UntypedFormControl('', [Validators.required]),
      isGst:new UntypedFormControl(false, [Validators.required]),
     
      amount: new UntypedFormControl('', [Validators.required]),
      houseTypeId: new UntypedFormControl('', [Validators.required]),
     
    });

    this.form2 = new UntypedFormGroup({
      chargeName: new UntypedFormControl('', [Validators.required]),
     
      accountId:new UntypedFormControl('', [Validators.required]),
      chartOfAccountId: new UntypedFormControl('', [Validators.required]),
      desc: new UntypedFormControl('', [Validators.required]),
      isGst:new UntypedFormControl(false, [Validators.required]),
      amount: new UntypedFormControl('', [Validators.required]),
    });
    this.form3 = new UntypedFormGroup({
      chargeName: new UntypedFormControl('', [Validators.required]),
     
      accountId:new UntypedFormControl('', [Validators.required]),
      chartOfAccountId: new UntypedFormControl('', [Validators.required]),
      desc: new UntypedFormControl('', [Validators.required]),
      isGst:new UntypedFormControl(false, [Validators.required]),
      amountPerUnit: new UntypedFormControl('', [Validators.required]),
    });

    //  this.form = this.fb.group({
    //   flatId: [null],
    //   area:[null],
    //   credit: [0],
    //   debit: [0],
    //   houseTypeId: [null],
    //   securityDeposit:[0],
    //  // socityId: [this.societyId]
    // });
   
  }
  // quantities() : FormArray {  
  //   return this.form.get("quantities") as FormArray  
  // }  
    
get chargeData(): UntypedFormArray {
    return this.form.get('chargeData') as UntypedFormArray;
  }
  newQuantity(): UntypedFormGroup {  
    return this.fb.group({  
      amount: '',  
      amountPerUnit: '',
      id:''  
    })  
  }  
     
  addQuantity() {  
    this.chargeData.push(this.newQuantity());  
  }  
     
  // removeQuantity(i:number) {  
  //   this.quantities().removeAt(i);  
  // }  
  onchange(e: any) {
    switch (e) {
      case 'Area Based on House type':
        this.form2.reset();
        this.form3.reset();
        break;
      case 'Fixed':
        this.form1.reset();
        this.form3.reset();
        break;
      case 'Area Based':
        this.form1.reset();
        this.form2.reset();
        break;
    }
  }
  onCancelClick(){
    this.getparamid = "";
   
    this.form.reset();
    this.form1.reset();
    this.form2.reset();
    this.form3.reset();
   
  }

  
  // loadData() {
  //   this.service.getChargeList().subscribe((res) => {
  //     console.log(res, "res==>");
      
  //     this.originalData = res.data; // Store unfiltered full dataset
  //     this.readData = [...this.originalData]; // Initialize table data
  //     this.totalLength = this.readData.length;
  //   }, error => {
  //     console.error("Error fetching vendor data:", error);
  //   });
  // }
  
  
searchData() {
  const searchValue = this.searchTerm.trim().toLowerCase();

  if (!searchValue) {
    this.readData = [...this.originalData];
  } else {
    const filtered = this.originalData.filter(us =>
      (us.chargeName?.toLowerCase().includes(searchValue) ||
       us.type?.toLowerCase().includes(searchValue) ||
       us.accountName?.toLowerCase().includes(searchValue) ||
       us.houseType?.toLowerCase().includes(searchValue) ||
       us.amountPerUnit?.toString().toLowerCase().includes(searchValue) ||
       us.amount?.toString().toLowerCase().includes(searchValue))
    );

    this.readData = [...filtered];
  }

  this.totalLength = this.readData.length;
  this.page = 1;

  // Force view update
  this.cdr.detectChanges();
}

  


  
  columns = [
    { name: 'Charge Name', visible: true },
    { name: 'Charge Type', visible: true },
    { name: 'Chart of Account', visible: true },
    { name: 'House Type', visible: true },
    { name: 'Price per sqr.ft', visible: true },
    { name: 'Charge Amount', visible: true },
    { name: 'GST', visible: true }
  ];
  
    
    
    
      toggleModal() {
        this.isModalOpen = !this.isModalOpen;
      }
       
     
      cancelChanges() {
        this.hiddenColumns.forEach(column => column.selected = false);
        this.displayedColumns.forEach(column => column.selected = false);
        this.toggleModal();
      }
      
     
    
      updateColumnLists() {
        this.hiddenColumns = this.columns.filter(column => !column.visible);
        this.displayedColumns = this.columns.filter(column => column.visible);
      }
    
    
    
    
      addColumn() {
        const selectedColumns = this.hiddenColumns.filter(column => column.selected);
        selectedColumns.forEach(column => {
          column.visible = true;
          this.displayedColumns.push({ ...column, selected: false });
        });
        this.hiddenColumns = this.hiddenColumns.filter(column => !column.selected);
      }
      
      removeColumn() {
        const selectedColumns = this.displayedColumns.filter(column => column.selected);
        selectedColumns.forEach(column => {
          column.visible = false;
          this.hiddenColumns.push({ ...column, selected: false });
        });
        this.displayedColumns = this.displayedColumns.filter(column => !column.selected);
      }
      
      isColumnVisible(columnName: string): boolean {
        const column = this.displayedColumns.find(col => col.name === columnName);
        return column ? column.visible : false;
      }
      toggleDropdown(): void {
        this.isDropdownOpen = !this.isDropdownOpen;
      }
      applyColumnSelection() {
        this.updateColumnLists();
        this.toggleModal();
        this.columns = [...this.displayedColumns]; 
      }
    
      sortData(column: string): void {
        this.sortDirection[column] = !this.sortDirection[column]; // Toggle the sort direction for the column
        this.readData.sort((a: any, b: any) => {
          const direction = this.sortDirection[column] ? 1 : -1;
          return a[column] > b[column] ? direction : -direction;
      });
      }
     
      exportData(): void {
        const dialogRef = this.dialog.open(DownloadConfirmDialogComponent);
    
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.downloadCSVfile();
          }
        });
      }
    
      downloadCSVfile(): void {
        console.log('Filtered Data:', this.readData);
        const visibleColumns = this.columns
          .filter(col => col.visible && col.name !== 'Actions')
          .map(col => col.name);
        console.log('Visible Columns:', visibleColumns);
    
        const dataToExport = this.readData.map((entry: { [x: string]: any; }) => {
          const exportEntry: any = {};
    
          visibleColumns.forEach(column => {
            const key = this.mapColumnToKey(column);
            // let value = key;
            // if (key === 'isInside') {
            //   value = this.map[value];
            // }
            
            if (column === 'In/Out Status') {
              exportEntry[column] = entry[key] ? "Inside" : "Out";
            } else {
              exportEntry[column] = entry[key]; 
            }
    
            console.log(`Mapping column "${column}" to key "${key}" with value: ${exportEntry[column]}`);
          });
    
          console.log('Export Entry:', exportEntry);
          return exportEntry;
        });
        const csvContent = this.convertToCSV(dataToExport);
        console.log('CSV Content:', csvContent); 
    
        this.downloadCSV(csvContent, 'ChargeList_log.csv');
        console.log('CSV downloaded');
      }
    
    private convertToCSV(data: any[]): string {
        if (data.length === 0) {
            return '';
        }
    
        const header = Object.keys(data[0]).join(',');
        const rows = data.map(row => Object.values(row).join(',')).join('\n');
        return `${header}\n${rows}`;
    }
    
    private downloadCSV(csvContent: string, filename: string): void {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) { // Feature detection
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
    private mapColumnToKey(columnName: string): string {
      switch (columnName) {
        case 'Charge Name': return 'chargeName';
        case 'Charge Type': return 'type';
        case 'Chart of Account': return 'accountName';
        case 'House Type': return 'houseType';
        case 'Price per sqr.ft': return 'amountPerUnit';
        case 'Charge Amount': return 'amount';
        case 'GST': return 'isGst';
        default: return '';
      }
    }
    
  // addItemDetail() {
   
  //   this.chargeData.push(this.newQuantity());
  // }
  // newQuantity(): FormGroup {  
  //   return this.fb.group({
  //     itemName: [''],
  //     quantity: [''],
  //     rate: [''],
  //     purchaseAccount: [''],
  //     description: [''],
  //     deduction: [''],
  //     reasonOfDeduction: [''],
  //     cgst: [''],
  //     sgst: [''],
  //     igst: [''],
  //     hsn: [''],
  //     tds: [''],
  //     images: ['']
  //   });
  // } 


  submitdata(key: string) {
    switch (key) {
      case 'Area Based on House type':
        console.log(this.totalhousetypeLength);
        console.log(this.readData5);
       // console.log(this.readData5.houseTypeId);
        let data: any = {
          chargeName: this.form1.value.chargeName,
          accountId:  this.form1.value.accountId,
          chartOfAccountId: this.form1.value.chartOfAccountId,
          desc:  this.form1.value.desc,
          isGst: this.form1.value.isGst,
          type: this.selectedValue,
          chargeData: [],
        }

        for (let i = 0; i < this.totalhousetypeLength; i++) {
          data.chargeData.push({
            amount: this.amounts[i],
            amountPerUnit: "",
            houseTypeId: this.ids[i],
          });
        }
      
        console.log(JSON.stringify(data));
        this.service.createChargeList(data).subscribe((res)=>{
          console.log(res,'res==>');
          this.form.reset();
          this.getAllData();
          this.onCancelClick();
        });
        break;
      case 'Fixed':
        let data1: any = {
          chargeName: this.form2.value.chargeName,
          accountId:  this.form2.value.accountId,
          chartOfAccountId: this.form2.value.chartOfAccountId,
          desc:  this.form2.value.desc,
          isGst: this.form2.value.isGst,
          type: this.selectedValue,

          chargeData: [
            {
              amount: this.form2.value.amount,
              amountPerUnit: "",
              houseTypeId: ""
            }
          ],
        }
        console.log(data1);
        this.service.createChargeList(data1).subscribe((res)=>{
          console.log(res,'res==>');
          this.form.reset();
          this.getAllData();
          this.onCancelClick();
        });
        break;
      case 'Area Based':
        let data2: any = {
          chargeName: this.form3.value.chargeName,
          accountId:  this.form3.value.accountId,
          chartOfAccountId: this.form3.value.chartOfAccountId,
          desc:  this.form3.value.desc,
          isGst: this.form3.value.isGst,
          type: this.selectedValue,

          chargeData: [
            {
              amount: "",
              amountPerUnit: this.form3.value.amountPerUnit,
              houseTypeId: ""
            }
          ],
        }
        console.log(data2);
        this.service.createChargeList(data2).subscribe((res)=>{
          console.log(res,'res==>');
          this.form.reset();
          this.getAllData();
          this.onCancelClick();
        });
        break;
    }
  }
  OnEdit(us:any,key:String){
   
    switch (key) {
      case 'Area Based on House type':
        console.log(this.totalhousetypeLength);
        console.log(this.readData5);
       // console.log(this.readData5.houseTypeId);

         this.form1.controls['chargeName'].setValue(us.chargeName);
         this.form1.controls['accountId'].setValue(us.accountId);
         this.form1.controls['chartOfAccountId'].setValue(us.chartOfAccountId);
         this.form1.controls['desc'].setValue(us.desc);
         this.form1.controls['isGst'].setValue(us.isGst);
         this.form1.controls['type'].setValue(us.type);
         this.form1.controls['chargeData'].setValue(us.chargeData);
        

        for (let i = 0; i < this.totalhousetypeLength; i++) {
          us.chargeData.push({
            amount: this.amounts[i],
            amountPerUnit: "",
            houseTypeId: this.ids[i],
          });
        }
      
       
        break;
      case 'Fixed':
        this.form2.controls['chargeName'].setValue(us.chargeName);
        this.form2.controls['accountId'].setValue(us.accountId);
        this.form2.controls['chartOfAccountId'].setValue(us.chartOfAccountId);
        this.form2.controls['desc'].setValue(us.desc);
        this.form2.controls['isGst'].setValue(us.isGst);
        this.form2.controls['type'].setValue(us.type);
        this.form2.controls['chargeData'].setValue(us.chargeData);
         

        
       
        break;
      case 'Area Based':
        this.form3.controls['chargeName'].setValue(us.chargeName);
        this.form3.controls['accountId'].setValue(us.accountId);
        this.form3.controls['chartOfAccountId'].setValue(us.chartOfAccountId);
        this.form3.controls['desc'].setValue(us.desc);
        this.form3.controls['isGst'].setValue(us.isGst);
        this.form3.controls['type'].setValue(us.type);
        this.form3.controls['chargeData'].setValue(us.chargeData);
        break;
    }
   }
  
  onSubmit() {  
    console.log(this.form.value);  
  }  
getAllData() {
  this.service.getChargeList().subscribe((res) => {
    console.log(res, "res==>");
    const reversedData = res.data.reverse(); // 🔁 Reverse the array
    this.originalData = reversedData;
    this.readData = [...reversedData];
    this.totalLength = this.readData.length;
  });
}


  
  back(){
    this._location.back();
  }
  generateRandomCode(): any {
    var code = '';
    var digits = '0123456789';

    for (var i = 0; i < 16; i++) {
      var randomIndex = Math.floor(Math.random() * digits.length);
      code += digits[randomIndex];
    }

    return code;
  }
  getAllCOAData(){
    this.service.getChartOfAccount().subscribe((res)=>{
      console.log(res,"res==>");
     this.readData2 = res.data;
    
    });
  }
 getAllhousetypeData(){
    this.service.getHouseType().subscribe((res)=>{
      console.log(res,"res==>");
     this.readData5 = res.data;
     this.totalhousetypeLength = (res.data).length;

    });
}

  getAllrentaltypeData(){
    this.service.getFlatType().subscribe((res)=>{
      console.log(res,"res==>");
     this.readData6 = res.data;
     this.totalhousetypeLength2 = (res.data).length;

    });
  }
  
  getAllAccountData(){
    this.service.getSocietyAccount().subscribe((res)=>{
      console.log(res,"res==>");
     this.readData3 = res.data;
    
    });
  }
  getAllChargeTypeData(){
    this.service.getChargeType().subscribe((res)=>{
      console.log(res,"res==>");
     this.readData4 = res.data;
    
    });
  }
 
  // onSelect(event:any){
  //   console.log(event);
  //   this.service.getFloorById(event.target.value).subscribe((res)=>{
     
  //   this.readData4 = res.data;
    
  //   });
  
  // }

  allocate(){
    this.router.navigate(['/supervisor/paymentdashboard/allocatecharge']);
  }
  
  
  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      this.form1.reset();
      this.form2.reset();
      this.form3.reset();

      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      this.form1.reset();
      this.form2.reset();
      this.form3.reset();

      return 'by clicking on a backdrop';
    } else {
      this.form1.reset();
      this.form2.reset();
      this.form3.reset();

      return `with: ${reason}`;
    }

  }
 
  allocatecharge(content2: any) {
    this.modalService.open(content2, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismiss(reason)}`;
    });
  }

  private getDismiss(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }

  }
 

saveDetails(form:any) {
 console.log(this.form.value);
  if(this.form.valid)
  {
    console.log(this.form.value);
    this.service.createChargeList(this.form.value).subscribe((res)=>{
      console.log(res,'res==>');
      this.loading = false;
      this.form.reset();
      this.getAllData();
      this.onCancelClick();
    });
  }
}




 FlatUpdate(){
   console.log(this.getparamid);
   console.log(this.form.value,'updated');
   if(this.form.valid)
   {
     
     this.service.updateFlat({id:this.getparamid,name:this.form.value.name,floorId:this.form.value.floorId,type:this.form.value.type} ).subscribe((res)=>{
       alert( 'Updated Successfully...');
       this.loading = false;
         this.getAllData();
         this.onCancelClick();
     });
   }
 }
 



}




