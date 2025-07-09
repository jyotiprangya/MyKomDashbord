import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AmenitiesComponent } from '../faq_pages/amenities/amenities.component';
import { AttendanceComponent } from '../faq_pages/attendance/attendance.component';
import { ClubhouseComponent } from '../faq_pages/clubhouse/clubhouse.component';
import { CommunicationComponent } from '../faq_pages/communication/communication.component';
import { DeliveryComponent } from '../faq_pages/delivery/delivery.component';
import { EintercomComponent } from '../faq_pages/eintercom/eintercom.component';
import { FaqmobileComponent } from '../faqmobile/faqmobile.component';
import { FeaturesComponent } from '../faq_pages/features/features.component';
import { HelpdeskComponent } from '../faq_pages/helpdesk/helpdesk.component';
import { IniqComponent } from '../faq_pages/iniq/iniq.component';
import { MultipropertyComponent } from '../faq_pages/multiproperty/multiproperty.component';
import { PaymentfaqComponent } from '../faq_pages/paymentfaq/paymentfaq.component';
import { TechnologyComponent } from '../faq_pages/technology/technology.component';
import { VisitorComponent } from '../faq_pages/visitor/visitor.component';
import { FaqComponent } from './faq.component';
const routes: Routes = [
  {
    path: 'faq', component: FaqComponent,
    children: [
      { path: 'general_iniquries', component: IniqComponent },
      { path: 'technology', component: TechnologyComponent },
      { path: 'feature', component: FeaturesComponent },
      { path: 'e-Intercom', component: EintercomComponent },
      { path: 'visitorManagement', component: VisitorComponent },
      { path: 'attendance&StaffManagement', component: AttendanceComponent },
      { path: 'deliveryManagement', component: DeliveryComponent },
      { path: 'ClubhouseManagement', component: ClubhouseComponent },
      { path: 'Multi_PropertyManagement', component: MultipropertyComponent },
      { path: 'Payments', component: PaymentfaqComponent },
      { path: 'helpdesk', component: HelpdeskComponent },
      { path: 'communication', component: CommunicationComponent },
      { path: 'amenities', component: AmenitiesComponent },]
  },
  { path: 'faqs', component: FaqmobileComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FaqRoutingModule { }