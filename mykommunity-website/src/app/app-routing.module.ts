import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { LoginComponent } from './components/website/login/login.component';
import { AppComponent } from './app.component';
import { AboutComponent } from './components/website/about/about.component';
import { AdminComponent } from './components/admin_dashboard/admin/admin.component';
import { BodyComponent } from './components/website/body/body.component';
import { ContactComponent } from './components/website/contact/contact.component';
import { MainComponent } from './components/website/main/main.component';
import { DashboardComponent } from './components/admin_dashboard/dashboard/dashboard.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { UserComponent } from './components/supervisior_dashboard/user/user.component';
import { CommunityComponent } from './components/admin_dashboard/community/community.component';
import { CityComponent } from './components/admin_dashboard/city/city.component';
import { ComplainComponent } from './components/supervisior_dashboard/complain/complain.component';

import { CreateComponent } from './components/admin_dashboard/create/create.component';
import { StaffdashComponent } from './components/supervisior_dashboard/staffdash/staffdash.component';
import { StaffdashboardComponent } from './components/supervisior_dashboard/staffdashboard/staffdashboard.component';
import { EmergencyComponent } from './components/supervisior_dashboard/emergency/emergency.component';
import { NoticeComponent } from './components/supervisior_dashboard/notice/notice.component';
import { LocalserviceComponent } from './components/supervisior_dashboard/localservice/localservice.component';
import { LocalservicecategoryComponent } from './components/supervisior_dashboard/localservicecategory/localservicecategory.component';
import { SecurityComponent } from './components/supervisior_dashboard/security/security.component';
import { SocietydirectoryComponent } from './components/supervisior_dashboard/societydirectory/societydirectory.component';
import { BlockComponent } from './components/supervisior_dashboard/block/block.component';
import { FloorComponent } from './components/supervisior_dashboard/floor/floor.component';
import { FlatComponent } from './components/supervisior_dashboard/flat/flat.component';
import { GateComponent } from './components/supervisior_dashboard/gate/gate.component';
import { AuthGuard } from './services/auth.guard';
import { PaymentComponent } from './components/supervisior_dashboard/payment_pages/payment/payment.component';
import { CreateBillComponent } from './components/supervisior_dashboard/payment_pages/create-bill/create-bill.component';
import { BilldetailsComponent } from './components/supervisior_dashboard/payment_pages/billdetails/billdetails.component';
import { StateComponent } from './components/admin_dashboard/state/state.component';
import { EmergencycategoryComponent } from './components/supervisior_dashboard/emergencycategory/emergencycategory.component';
import { ComplaintCategoryComponent } from './components/supervisior_dashboard/complaint-category/complaint-category.component';
import { AmenityComponent } from './components/supervisior_dashboard/amenity/amenity.component';
import { VendorComponent } from './components/admin_dashboard/vendor/vendor.component';
import { ComplaintDetailsComponent } from './components/supervisior_dashboard/complaint-details/complaint-details.component';
import { AmenitiesBookingComponent } from './components/supervisior_dashboard/amenities-booking/amenities-booking.component';
import { SosComponent } from './components/supervisior_dashboard/sos/sos.component';
import { InvoiceComponent } from './components/supervisior_dashboard/payment_pages/invoice/invoice.component';
import { ChartofaccntComponent } from './components/supervisior_dashboard/payment_pages/chartofaccnt/chartofaccnt.component';
import { InvoicetemplateComponent } from './components/supervisior_dashboard/payment_pages/invoicetemplate/invoicetemplate.component';
import { GenerateinvoiceComponent } from './components/supervisior_dashboard/payment_pages/generateinvoice/generateinvoice.component';
import { InvoicehistoryComponent } from './components/supervisior_dashboard/payment_pages/invoicehistory/invoicehistory.component';
import { InvoicegrpComponent } from './components/supervisior_dashboard/payment_pages/invoicegrp/invoicegrp.component';
import { PaymentintimationComponent } from './components/supervisior_dashboard/payment_pages/paymentintimation/paymentintimation.component';
import { SettleduesComponent } from './components/supervisior_dashboard/payment_pages/settledues/settledues.component';
import { DuesComponent } from './components/supervisior_dashboard/payment_pages/dues/dues.component';
import { ReceiptComponent } from './components/supervisior_dashboard/payment_pages/receipt/receipt.component';
import { GeneralpaymentComponent } from './components/supervisior_dashboard/payment_pages/generalpayment/generalpayment.component';
import { VendorbookingComponent } from './components/supervisior_dashboard/payment_pages/vendorbooking/vendorbooking.component';
import { VendorlistComponent } from './components/supervisior_dashboard/payment_pages/vendorlist/vendorlist.component';
import { AddvendorbookingComponent } from './components/supervisior_dashboard/payment_pages/addvendorbooking/addvendorbooking.component';
import { BankreconcilationComponent } from './components/supervisior_dashboard/payment_pages/bankreconcilation/bankreconcilation.component';
import { VendorreportdateComponent } from './components/supervisior_dashboard/payment_pages/vendorreportdate/vendorreportdate.component';
import { VendorreportComponent } from './components/supervisior_dashboard/payment_pages/vendorreport/vendorreport.component';
import { BankreconcilationdetailsComponent } from './components/supervisior_dashboard/payment_pages/bankreconcilationdetails/bankreconcilationdetails.component';
import { ShowduesComponent } from './components/supervisior_dashboard/payment_pages/showdues/showdues.component';
import { BudgetsComponent } from './components/supervisior_dashboard/payment_pages/budgets/budgets.component';
import { NewbudgetComponent } from './components/supervisior_dashboard/payment_pages/newbudget/newbudget.component';
import { BudgetdetailsComponent } from './components/supervisior_dashboard/payment_pages/budgetdetails/budgetdetails.component';
import { BudgetreportComponent } from './components/supervisior_dashboard/payment_pages/budgetreport/budgetreport.component';
import { CashtransferComponent } from './components/supervisior_dashboard/payment_pages/cashtransfer/cashtransfer.component';
import { PaymentdashboardComponent } from './components/supervisior_dashboard/payment_pages/paymentdashboard/paymentdashboard.component';
import { GeneralledgerComponent } from './components/supervisior_dashboard/payment_pages/generalledger/generalledger.component';
import { SocietyaccountComponent } from './components/supervisior_dashboard/payment_pages/societyaccount/societyaccount.component';
import { ConfigamountComponent } from './components/supervisior_dashboard/payment_pages/configamount/configamount.component';
import { RentalunitsetupComponent } from './components/supervisior_dashboard/payment_pages/rentalunitsetup/rentalunitsetup.component';
import { ChargelistComponent } from './components/supervisior_dashboard/payment_pages/chargelist/chargelist.component';
import { AllocatechargesComponent } from './components/supervisior_dashboard/payment_pages/allocatecharges/allocatecharges.component';
import { BillgenerationComponent } from './components/supervisior_dashboard/payment_pages/billgeneration/billgeneration.component';
import { TrialbalanceComponent } from './components/supervisior_dashboard/payment_pages/trialbalance/trialbalance.component';
import { IncomeandexpensereportComponent } from './components/supervisior_dashboard/payment_pages/incomeandexpensereport/incomeandexpensereport.component';
import { BalancesheetComponent } from './components/supervisior_dashboard/payment_pages/balancesheet/balancesheet.component';
import { ReceiptandpaymentreportComponent } from './components/supervisior_dashboard/payment_pages/receiptandpaymentreport/receiptandpaymentreport.component';
import { HousetypeComponent } from './components/supervisior_dashboard/housetype/housetype.component';
import { ChargetypeComponent } from './components/supervisior_dashboard/payment_pages/chargetype/chargetype.component';
import { ActivityComponent } from './components/supervisior_dashboard/activity/activity.component';
import { LatefeeComponent } from './components/supervisior_dashboard/payment_pages/latefee/latefee.component';
import { PrivacypolicyComponent } from './components/website/privacypolicy/privacypolicy.component';
import { TermsComponent } from './components/website/terms/terms.component';
import { RefundpolicyComponent } from './components/website/refundpolicy/refundpolicy.component';
import { SecretaryapprovalComponent } from './components/secretaryapproval/secretaryapproval.component';
import { CreateamenitybookingComponent } from './components/supervisior_dashboard/createamenitybooking/createamenitybooking.component';
import { AdvertisementComponent } from './components/admin_dashboard/advertisement/advertisement.component';
import { VehicleComponent } from './components/supervisior_dashboard/vehicle/vehicle.component';
import { VisitorentryexitrecordComponent } from './components/supervisior_dashboard/visitorentryexitrecord/visitorentryexitrecord.component';
import { DailyHelpentryexitrecordComponent } from './components/supervisior_dashboard/daily-helpentryexitrecord/daily-helpentryexitrecord.component';
import { PopupMessageComponent } from './components/website/popup-message/popup-message.component';
import { ResetPasswordComponent } from './components/website/reset-password/reset-password.component';
import { QrcodeComponent } from './components/supervisior_dashboard/qrcode/qrcode.component';
import { SocietyDailyhelpComponent } from './components/supervisior_dashboard/society-dailyhelp/society-dailyhelp.component';
import { SocietyDailyhelpEntryExitComponent } from './components/supervisior_dashboard/society-dailyhelp-entry-exit/society-dailyhelp-entry-exit.component';
import { UnregFlatComponent } from './components/supervisior_dashboard/unreg-flat/unreg-flat.component';
import { SosDetailsComponent } from './components/supervisior_dashboard/sos-details/sos-details.component';
import { SupervisorActivityComponent } from './components/supervisior_dashboard/supervisor-activity/supervisor-activity.component';
import { CommunitySetupComponent } from './components/supervisior_dashboard/community-setup/community-setup.component';
import { SocietyDetailsComponent } from './components/supervisior_dashboard/society-details/society-details.component';
import { PaymentdashbodyComponent } from './components/supervisior_dashboard/payment_pages/paymentdashbody/paymentdashbody.component';
import { LocalserviceDetailsComponent } from './components/supervisior_dashboard/localservice-details/localservice-details.component';
import { EntryExitRecordComponent } from './components/supervisior_dashboard/entry-exit-record/entry-exit-record.component';
import { ShiftComponent } from './components/supervisior_dashboard/shift/shift.component';
import { ShiftAssignmentComponent } from './components/supervisior_dashboard/shift-assignment/shift-assignment.component';
import { EditAmenityBookingComponent } from './components/supervisior_dashboard/edit-amenity-booking/edit-amenity-booking.component';
import { DeletedUserComponent } from './components/supervisior_dashboard/deleted-user/deleted-user.component';
import { DeletedSecurityComponent } from './components/supervisior_dashboard/deleted-security/deleted-security.component';
import { DeletedStaffComponent } from './components/supervisior_dashboard/deleted-staff/deleted-staff.component';
import { DeletedDailyhelpProviderComponent } from './components/supervisior_dashboard/deleted-dailyhelp-provider/deleted-dailyhelp-provider.component';
import { DeletedBlockComponent } from './components/supervisior_dashboard/deleted-block/deleted-block.component';
import { DeletedFloorComponent } from './components/supervisior_dashboard/deleted-floor/deleted-floor.component';
import { DeletedGateComponent } from './components/supervisior_dashboard/deleted-gate/deleted-gate.component';
import { DeletedFlatComponent } from './components/supervisior_dashboard/deleted-flat/deleted-flat.component';
import { DeletedDailyhelpCategoryComponent } from './components/supervisior_dashboard/deleted-dailyhelp-category/deleted-dailyhelp-category.component';
import { DeletedEmergencyCategoryComponent } from './components/supervisior_dashboard/deleted-emergency-category/deleted-emergency-category.component';
import { DeletedSosComponent } from './components/supervisior_dashboard/deleted-sos/deleted-sos.component';
import { DeletedComplaintCategoryComponent } from './components/supervisior_dashboard/deleted-complaint-category/deleted-complaint-category.component';
import { DeletedHousetypeComponent } from './components/supervisior_dashboard/deleted-housetype/deleted-housetype.component';
import { DeletedAmenityComponent } from './components/supervisior_dashboard/deleted-amenity/deleted-amenity.component';
import { DeletedShiftComponent } from './components/supervisior_dashboard/deleted-shift/deleted-shift.component';
import { QrcodeStatusComponent } from './components/supervisior_dashboard/qrcode-status/qrcode-status.component';



const routes: Routes = [
  { path: 'home', component: MainComponent },
  { path: 'about', component: AboutComponent },
  { path: 'features', component: BodyComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'privacy_policy', component: PrivacypolicyComponent },
  { path: 'termsncondition', component: TermsComponent },
  { path: 'refund', component: RefundpolicyComponent },
  { path: 'login', component: LoginComponent },
  { path: 'popup', component: PopupMessageComponent },
  { path: 'resetpassword', component: ResetPasswordComponent },
  { path: 'secretaryapproval', component: SecretaryapprovalComponent },

  {
    path: 'admin', component: AdminComponent,
    canActivate: [AuthGuard],
    children: [

      { path: 'city', component: CityComponent },
      { path: 'state', component: StateComponent },
      { path: 'vendor', component: VendorComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'community', component: CommunityComponent },
      { path: 'society-supervisor', component: CreateComponent },
      { path: 'ads', component: AdvertisementComponent },

    ]
  },
  {
    path: 'supervisor', component: StaffdashComponent,
   // canActivate: [AuthGuard],
    children: [

      { path: 'dashboard', component: StaffdashboardComponent },
      { path: 'booking', component: AmenitiesBookingComponent },
      { path: 'amenity', component: AmenityComponent },
      { path: 'removed-amenity', component: DeletedAmenityComponent },
      { path: 'user', component: UserComponent },
      { path: 'removed-user', component: DeletedUserComponent },
      { path: 'vehicle', component: VehicleComponent },
      { path: 'notice', component: NoticeComponent },
      { path: 'complain', component: ComplainComponent },
      { path: 'complain/:id', component: ComplaintDetailsComponent },
      { path: 'complainCategory', component: ComplaintCategoryComponent },
      { path: 'removed-complainCategory', component: DeletedComplaintCategoryComponent },
      { path: 'emergencyCategory', component: EmergencycategoryComponent },
      { path: 'remove-emergencyCategory', component: DeletedEmergencyCategoryComponent },
      { path: 'emergency', component: EmergencyComponent },
      { path: 'localservices', component: LocalserviceComponent },
      { path: 'localservices/:id', component: LocalserviceDetailsComponent },
      { path: 'society-dailyhelp', component: SocietyDailyhelpComponent },
      { path: 'removed-dailyhelp-provider', component: DeletedDailyhelpProviderComponent },
      { path: 'removed-dailyhelp-category', component: DeletedDailyhelpCategoryComponent },
      { path: 'removed-society-staff', component: DeletedStaffComponent },
      { path: 'society-dailyhelp-entry-exit-record', component: SocietyDailyhelpEntryExitComponent },
      { path: 'servicecategory', component: LocalservicecategoryComponent },
      { path: 'flat', component: FlatComponent },
      { path: 'removed-flat', component: DeletedFlatComponent },
      { path: 'unRegflat', component: UnregFlatComponent },
      { path: 'block', component: BlockComponent },
      { path: 'removed-block', component: DeletedBlockComponent },
      { path: 'floor', component: FloorComponent },
      { path: 'removed-floor', component: DeletedFloorComponent },
      { path: 'gate', component: GateComponent },
      { path: 'removed-gate', component: DeletedGateComponent },
      { path: 'activity', component: ActivityComponent },
      { path: 'entry/exit-record', component: EntryExitRecordComponent },
      { path: 'visitorentryexit', component: VisitorentryexitrecordComponent },
      { path: 'dailyhelpentryexit', component: DailyHelpentryexitrecordComponent },
      { path: 'qrcode', component: QrcodeComponent },
      { path: 'directory', component: SocietydirectoryComponent },
      { path: 'security', component: SecurityComponent },
      { path: 'removed-security', component: DeletedSecurityComponent },
      { path: 'createbooking', component: CreateamenitybookingComponent },
      { path: 'booking/editbooking', component: EditAmenityBookingComponent },
      { path: 'sos', component: SosComponent },
      { path: 'removed-sos', component: DeletedSosComponent },
      { path: 'sos-details', component: SosDetailsComponent },
      { path: 'housetype', component: HousetypeComponent },
      { path: 'removed-housetype', component: DeletedHousetypeComponent },
      { path: 'supervisor-activity', component: SupervisorActivityComponent },
      { path: 'community-setup', component: CommunitySetupComponent },
      { path: 'society-setup', component: SocietyDetailsComponent },
      { path: 'shift-setup', component: ShiftComponent },
      { path: 'removed-shift-setup', component: DeletedShiftComponent },
      { path: 'shift-assignment-setup', component: ShiftAssignmentComponent },
      { path: 'qrcode-status', component: QrcodeStatusComponent }
    ]
  },


//Payment Dashboard

  { path: 'supervisor/paymentdashboard', component: PaymentdashboardComponent,
    children: [
  { path: 'dashboard', component: PaymentdashbodyComponent },
  { path: 'chargetype', component: ChargetypeComponent },
  { path: 'gl', component: GeneralledgerComponent },
  { path: 'account', component: SocietyaccountComponent },
  { path: 'configamount', component: ConfigamountComponent },
  { path: 'rentalunitsetup', component: RentalunitsetupComponent },
  { path: 'chartoa', component: ChartofaccntComponent },
  { path: 'chargelist', component: ChargelistComponent },
  { path: 'allocatecharge', component: AllocatechargesComponent },
  { path: 'allocatecharge/:billgeneration', component: BillgenerationComponent },
  { path: 'trialbalance', component: TrialbalanceComponent },
  { path: 'income_Expenditure_Report', component: IncomeandexpensereportComponent },
  { path: 'balance_sheet', component: BalancesheetComponent },
  { path: 'receipt_payment_report', component: ReceiptandpaymentreportComponent },
  { path: 'late_fee', component: LatefeeComponent },
  { path: 'invoicetemp', component: InvoicetemplateComponent },
  { path: 'invoicehistory', component: InvoicehistoryComponent },
  { path: 'invoicehistory/:id', component: InvoicegrpComponent },
  { path: 'invoicegrp', component: InvoicegrpComponent },
  { path: 'paymentintimation', component: PaymentintimationComponent },
  { path: 'paymentintimation/:id', component: SettleduesComponent },
  { path: 'receipt', component: ReceiptComponent },
  { path: 'generalpayment', component: GeneralpaymentComponent },
  { path: 'dues', component: DuesComponent },
  { path: 'dues/:id', component: ShowduesComponent },
  { path: 'vendorbooking', component: VendorbookingComponent },
  { path: 'vendorlist', component: VendorlistComponent },
  { path: 'bookvendor', component: AddvendorbookingComponent },
  { path: 'bankreconcilation', component: BankreconcilationComponent },
  { path: 'bankreconcilationdetails', component: BankreconcilationdetailsComponent },
  { path: 'vendorreportdate', component: VendorreportdateComponent },
  { path: 'vendorreport', component: VendorreportComponent },
  { path: 'showdues', component: ShowduesComponent },
  { path: 'budget', component: BudgetsComponent },
  { path: 'newbudget', component: NewbudgetComponent },
  { path: 'viewbudget', component: BudgetdetailsComponent },
  { path: 'budgetreport', component: BudgetreportComponent },
  { path: 'cashbanktransfer', component: CashtransferComponent },
  { path: 'generateinvoice', component: GenerateinvoiceComponent },
  { path: 'complainCategory', component: ComplaintCategoryComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'createBill', component: CreateBillComponent },
  { path: 'BillDetails', component: BilldetailsComponent },
  { path: 'invoice', component: InvoiceComponent },


    ]
  },
  
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', component: NotfoundComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
