import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule,DatePipe,HashLocationStrategy,LocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { HomeComponent } from './components/website/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { MainComponent } from './components/website/main/main.component';
import { FooterComponent } from './components/website/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormComponent } from './components/website/form/form.component';
import { BodyComponent } from './components/website/body/body.component';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { LoginComponent } from './components/website/login/login.component';
import { ContactComponent } from './components/website/contact/contact.component';
import { AboutComponent } from './components/website/about/about.component';
import { DashboardComponent } from './components/admin_dashboard/dashboard/dashboard.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from "@angular/material/chips";
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import {CdkAccordionModule} from '@angular/cdk/accordion';
import {CdkScrollableModule} from '@angular/cdk/scrolling';
import { MatRadioModule } from '@angular/material/radio';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgChartsModule } from 'ng2-charts';
import { NgxPaginationModule } from 'ngx-pagination';
import { SidenavComponent } from './components/supervisior_dashboard/sidenav/sidenav.component';
import { AdminComponent } from './components/admin_dashboard/admin/admin.component';
import { NavbarComponent } from './components/admin_dashboard/navbar/navbar.component';
import { UserComponent } from './components/supervisior_dashboard/user/user.component';
import { CommunityComponent } from './components/admin_dashboard/community/community.component';
import { CityComponent } from './components/admin_dashboard/city/city.component';
import { ComplainComponent } from './components/supervisior_dashboard/complain/complain.component';
import { CreateComponent } from './components/admin_dashboard/create/create.component';
import { ApiService } from './services/api.service';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatProgressBarModule} from '@angular/material/progress-bar';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDialogModule} from '@angular/material/dialog';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';

import { StaffService } from './services/staff.service';
import { StaffdashComponent } from './components/supervisior_dashboard/staffdash/staffdash.component';
import { StaffdashboardComponent } from './components/supervisior_dashboard/staffdashboard/staffdashboard.component';
import { NoticeComponent } from './components/supervisior_dashboard/notice/notice.component';
import { EmergencyComponent } from './components/supervisior_dashboard/emergency/emergency.component';
import { LocalservicecategoryComponent } from './components/supervisior_dashboard/localservicecategory/localservicecategory.component';
import { LocalserviceComponent } from './components/supervisior_dashboard/localservice/localservice.component';
import { SecurityComponent } from './components/supervisior_dashboard/security/security.component';
import { SocietydirectoryComponent } from './components/supervisior_dashboard/societydirectory/societydirectory.component';
import { BlockComponent } from './components/supervisior_dashboard/block/block.component';
import { FloorComponent } from './components/supervisior_dashboard/floor/floor.component';
import { FlatComponent } from './components/supervisior_dashboard/flat/flat.component';
import { GateComponent } from './components/supervisior_dashboard/gate/gate.component';
import { LogoutComponent } from './components/website/logout/logout.component';
import { AuthGuard } from './services/auth.guard';
import { PaymentComponent } from './components/supervisior_dashboard/payment_pages/payment/payment.component';
import { IniqComponent } from './components/website/faq_pages/iniq/iniq.component';
import { FaqModule } from './components/website/faq/faq.module';
import { TechnologyComponent } from './components/website/faq_pages/technology/technology.component';
import { FeaturesComponent } from './components/website/faq_pages/features/features.component';
import { EintercomComponent } from './components/website/faq_pages/eintercom/eintercom.component';
import { VisitorComponent } from './components/website/faq_pages/visitor/visitor.component';
import { AttendanceComponent } from './components/website/faq_pages/attendance/attendance.component';
import { DeliveryComponent } from './components/website/faq_pages/delivery/delivery.component';
import { ClubhouseComponent } from './components/website/faq_pages/clubhouse/clubhouse.component';
import { MultipropertyComponent } from './components/website/faq_pages/multiproperty/multiproperty.component';
import { PaymentfaqComponent } from './components/website/faq_pages/paymentfaq/paymentfaq.component';
import { HelpdeskComponent } from './components/website/faq_pages/helpdesk/helpdesk.component';
import { CommunicationComponent } from './components/website/faq_pages/communication/communication.component';
import { AmenitiesComponent } from './components/website/faq_pages/amenities/amenities.component';
import { FaqmobileComponent } from './components/website/faqmobile/faqmobile.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { CreateBillComponent } from './components/supervisior_dashboard/payment_pages/create-bill/create-bill.component';
import { BilldetailsComponent } from './components/supervisior_dashboard/payment_pages/billdetails/billdetails.component';
import { TestComponent } from './components/website/faq_pages/test/test.component';
import { StateComponent } from './components/admin_dashboard/state/state.component';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFireModule } from '@angular/fire/compat';
import { NgApexchartsModule } from "ng-apexcharts";
import { EmergencycategoryComponent } from './components/supervisior_dashboard/emergencycategory/emergencycategory.component';
import { ComplaintCategoryComponent } from './components/supervisior_dashboard/complaint-category/complaint-category.component';
import { AmenityComponent } from './components/supervisior_dashboard/amenity/amenity.component';
import { VendorComponent } from './components/admin_dashboard/vendor/vendor.component';
import { FilterPipe } from './pipes/filter.pipe';
import { ChartComponent } from './components/supervisior_dashboard/chart/chart.component';
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
import { VendorreportComponent } from './components/supervisior_dashboard/payment_pages/vendorreport/vendorreport.component';
import { BankreconcilationdetailsComponent } from './components/supervisior_dashboard/payment_pages/bankreconcilationdetails/bankreconcilationdetails.component';
import { VendorreportdateComponent } from './components/supervisior_dashboard/payment_pages/vendorreportdate/vendorreportdate.component';
import { ShowduesComponent } from './components/supervisior_dashboard/payment_pages/showdues/showdues.component';
import { BudgetsComponent } from './components/supervisior_dashboard/payment_pages/budgets/budgets.component';
import { NewbudgetComponent } from './components/supervisior_dashboard/payment_pages/newbudget/newbudget.component';
import { BudgetdetailsComponent } from './components/supervisior_dashboard/payment_pages/budgetdetails/budgetdetails.component';
import { BudgetreportComponent } from './components/supervisior_dashboard/payment_pages/budgetreport/budgetreport.component';
import { CashtransferComponent } from './components/supervisior_dashboard/payment_pages/cashtransfer/cashtransfer.component';
import { CapitalizeFirstLetterPipe } from './pipes/capitalize-first-letter.pipe';
import { PaymentdashboardComponent } from './components/supervisior_dashboard/payment_pages/paymentdashboard/paymentdashboard.component';
import { SublevelPaymentMenuComponent } from './components/supervisior_dashboard/payment_pages/paymentnavbar/sublevel-menu.component';
import { PaymentnavbarComponent } from './components/supervisior_dashboard/payment_pages/paymentnavbar/paymentnavbar.component';
import { SocietyaccountComponent } from './components/supervisior_dashboard/payment_pages/societyaccount/societyaccount.component';
import { GeneralledgerComponent } from './components/supervisior_dashboard/payment_pages/generalledger/generalledger.component';
import { ConfigamountComponent } from './components/supervisior_dashboard/payment_pages/configamount/configamount.component';
import { RentalunitsetupComponent } from './components/supervisior_dashboard/payment_pages/rentalunitsetup/rentalunitsetup.component';
import { FiltercomplaintPipe } from './pipes/filtercomplaint.pipe';
import { FilteramenityPipe } from './pipes/filteramenity.pipe';
import { PaymentdashbodyComponent } from './components/supervisior_dashboard/payment_pages/paymentdashbody/paymentdashbody.component';
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
import { ActivityPipe } from './pipes/activity.pipe';
import { FileExtensionPipe } from './file-extension.pipe';
import { FlatfilterPipe } from './pipes/flatfilter.pipe';
import { PaymentheaderComponent } from './components/supervisior_dashboard/payment_pages/paymentheader/paymentheader.component';
import { CreateamenitybookingComponent } from './components/supervisior_dashboard/createamenitybooking/createamenitybooking.component';
import { AdvertisementComponent } from './components/admin_dashboard/advertisement/advertisement.component';
import { VehicleComponent } from './components/supervisior_dashboard/vehicle/vehicle.component';
import { VehiclefilterPipe } from './pipes/vehiclefilter.pipe';
import { VisitorentryexitrecordComponent } from './components/supervisior_dashboard/visitorentryexitrecord/visitorentryexitrecord.component';
import { DailyHelpentryexitrecordComponent } from './components/supervisior_dashboard/daily-helpentryexitrecord/daily-helpentryexitrecord.component';
import { PopupMessageComponent } from './components/website/popup-message/popup-message.component';
import { DashboardFooterComponent } from './components/dashboard-footer/dashboard-footer.component';
import { ResetPasswordComponent } from './components/website/reset-password/reset-password.component';
import { SuccessMessageComponent } from './components/website/success-message/success-message.component';
import { QrcodeComponent } from './components/supervisior_dashboard/qrcode/qrcode.component';
import { SocietyDailyhelpComponent } from './components/supervisior_dashboard/society-dailyhelp/society-dailyhelp.component';
import { SocietyDailyhelpEntryExitComponent } from './components/supervisior_dashboard/society-dailyhelp-entry-exit/society-dailyhelp-entry-exit.component';
import { SublevelMenuComponent } from './components/supervisior_dashboard/sidenav/sublevel-menu.component';
import { SupervisorBodyComponent } from './components/supervisior_dashboard/supervisor-body/supervisor-body.component';
import { SuperadminBodyComponent } from './components/admin_dashboard/superadmin-body/superadmin-body.component';
import { UnregFlatComponent } from './components/supervisior_dashboard/unreg-flat/unreg-flat.component';
import { DailyhelpPipe } from './pipes/dailyhelp.pipe';
import { SosDetailsComponent } from './components/supervisior_dashboard/sos-details/sos-details.component';
import { VisitorDetailsPopupComponent } from './components/supervisior_dashboard/visitor-details-popup/visitor-details-popup.component';
import { DailyHelpHistoryPipe } from './pipes/daily-help-history.pipe';
import { SupervisorActivityComponent } from './components/supervisior_dashboard/supervisor-activity/supervisor-activity.component';
import { CommunitySetupComponent } from './components/supervisior_dashboard/community-setup/community-setup.component';
import { SocietyDetailsComponent } from './components/supervisior_dashboard/society-details/society-details.component';
import { PaymentdashboardBodyComponent } from './components/supervisior_dashboard/payment_pages/paymentdashboard-body/paymentdashboard-body.component';
import { DownloadConfirmDialogComponent } from './components/supervisior_dashboard/download-confirm-dialog/download-confirm-dialog.component';
import { LocalserviceDetailsComponent } from './components/supervisior_dashboard/localservice-details/localservice-details.component';
import { SecurityPipe } from './pipes/security.pipe';
import { EntryExitRecordComponent } from './components/supervisior_dashboard/entry-exit-record/entry-exit-record.component';
import { ShiftComponent } from './components/supervisior_dashboard/shift/shift.component';
import { ShiftAssignmentComponent } from './components/supervisior_dashboard/shift-assignment/shift-assignment.component';
import { ShiftPipe } from './pipes/shift.pipe';
import { EditAmenityBookingComponent } from './components/supervisior_dashboard/edit-amenity-booking/edit-amenity-booking.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
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



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    MainComponent,
    FooterComponent,
    FormComponent,
    BodyComponent,
    NotfoundComponent,
    LoginComponent,
    ContactComponent,
    AboutComponent,
    DashboardComponent,
    SidenavComponent,
    AdminComponent,
    NavbarComponent,
    UserComponent,
    CommunityComponent,
    CityComponent,
    ComplainComponent,
    CreateComponent,
    StaffdashComponent,
    StaffdashboardComponent,
    NoticeComponent,
    EmergencyComponent,
    LocalservicecategoryComponent,
    LocalserviceComponent,
    SecurityComponent,
    SocietydirectoryComponent,
    BlockComponent,
    FloorComponent,
    FlatComponent,
    GateComponent,
    LogoutComponent,
    PaymentComponent,
    IniqComponent,
    TechnologyComponent,
    FeaturesComponent,
    EintercomComponent,
    VisitorComponent,
    AttendanceComponent,
    DeliveryComponent,
    ClubhouseComponent,
    MultipropertyComponent,
    PaymentfaqComponent,
    HelpdeskComponent,
    CommunicationComponent,
    AmenitiesComponent,
    FaqmobileComponent,
    CreateBillComponent,
    BilldetailsComponent,
    TestComponent,
    StateComponent,
    EmergencycategoryComponent,
    ComplaintCategoryComponent,
    AmenityComponent,
    VendorComponent,
    FilterPipe,
    ChartComponent,
    ComplaintDetailsComponent,
    AmenitiesBookingComponent,
    SosComponent,
    InvoiceComponent,
    ChartofaccntComponent,
    InvoicetemplateComponent,
    GenerateinvoiceComponent,
    InvoicehistoryComponent,
    InvoicegrpComponent,
    PaymentintimationComponent,
    SettleduesComponent,
    DuesComponent,
    ReceiptComponent,
    GeneralpaymentComponent,
    VendorbookingComponent,
    VendorlistComponent,
    AddvendorbookingComponent,
    BankreconcilationComponent,
    VendorreportComponent,
    BankreconcilationdetailsComponent,
    VendorreportdateComponent,
    ShowduesComponent,
    BudgetsComponent,
    NewbudgetComponent,
    BudgetdetailsComponent,
    BudgetreportComponent,
    CashtransferComponent,
    CapitalizeFirstLetterPipe,
    PaymentdashboardComponent,
    PaymentnavbarComponent,
    SocietyaccountComponent,
    GeneralledgerComponent,
    ConfigamountComponent,
    RentalunitsetupComponent,
    FiltercomplaintPipe,
    FilteramenityPipe,
    PaymentdashbodyComponent,
    ChargelistComponent,
    AllocatechargesComponent,
    BillgenerationComponent,
    TrialbalanceComponent,
    IncomeandexpensereportComponent,
    BalancesheetComponent,
    ReceiptandpaymentreportComponent,
    HousetypeComponent,
    ChargetypeComponent,
    ActivityComponent,
    LatefeeComponent,
    PrivacypolicyComponent,
    TermsComponent,
    RefundpolicyComponent,
    SecretaryapprovalComponent,
    ActivityPipe,
    FileExtensionPipe,
    FlatfilterPipe,
    PaymentheaderComponent,
    CreateamenitybookingComponent,
    AdvertisementComponent,
    VehicleComponent,
    VehiclefilterPipe,
    VisitorentryexitrecordComponent,
    DailyHelpentryexitrecordComponent,
    PopupMessageComponent,
    DashboardFooterComponent,
    ResetPasswordComponent,
    SuccessMessageComponent,
    QrcodeComponent,
    SocietyDailyhelpComponent,
    SocietyDailyhelpEntryExitComponent,
    SublevelMenuComponent,
    SublevelPaymentMenuComponent,
    SupervisorBodyComponent,
    SuperadminBodyComponent,
    UnregFlatComponent,
    DailyhelpPipe,
    SosDetailsComponent,
    VisitorDetailsPopupComponent,
    DailyHelpHistoryPipe,
    SupervisorActivityComponent,
    CommunitySetupComponent,
    SocietyDetailsComponent,
    PaymentdashboardBodyComponent,
    DownloadConfirmDialogComponent,
    LocalserviceDetailsComponent,
    SecurityPipe,
    EntryExitRecordComponent,
    ShiftComponent,
    ShiftAssignmentComponent,
    ShiftPipe,
    EditAmenityBookingComponent,
    DeletedUserComponent,
    DeletedSecurityComponent,
    DeletedStaffComponent,
    DeletedDailyhelpProviderComponent,
    DeletedBlockComponent,
    DeletedFloorComponent,
    DeletedGateComponent,
    DeletedFlatComponent,
    DeletedDailyhelpCategoryComponent,
    DeletedEmergencyCategoryComponent,
    DeletedSosComponent,
    DeletedComplaintCategoryComponent,
    DeletedHousetypeComponent,
    DeletedAmenityComponent,
    DeletedShiftComponent,
    QrcodeStatusComponent
    
  ],
  imports: [
    BrowserModule,
    FaqModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatDividerModule,
    MatAutocompleteModule,
    MatTableModule,
    MatSortModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatRadioModule,
    MatProgressBarModule,
    MatDialogModule,
    MatIconModule,
    MatCheckboxModule,
    MatCardModule,
    FlexLayoutModule,
    NgChartsModule,
    MatChipsModule,
    MatListModule,
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTooltipModule,
    MatStepperModule,
    CdkAccordionModule,
    CdkScrollableModule,
    MatExpansionModule,
    MatSnackBarModule,
    NgbModule,
    NgxMaterialTimepickerModule,
    NgApexchartsModule,
    NgChartsModule,
    NgxPaginationModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyBe2LbI7qZ6FEePiW8C6zxvntDMF0Do99U",
      authDomain: "mykommunity-e1f4e.firebaseapp.com",
      databaseURL: "https://mykommunity-e1f4e.firebaseio.com",
      projectId: "mykommunity-e1f4e",
      storageBucket: "mykommunity-e1f4e.appspot.com"
    }),
    AngularFireStorageModule,
    
    

  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [ApiService,AuthGuard,DatePipe,
    {
      provide:LocationStrategy,
      useClass:HashLocationStrategy
    },
    {
      provide:HTTP_INTERCEPTORS,
      useClass:TokenInterceptorService,
      multi:true
    }
  

],
  bootstrap: [HomeComponent]
})
export class AppModule { }
