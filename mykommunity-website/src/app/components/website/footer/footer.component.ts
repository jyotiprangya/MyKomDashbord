import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  checkWidth(){
    var width = window.innerWidth;
    if (width <= 700) {

      this.router.navigate(['/faqs'])
    } else{
      this.router.navigate(['/faq/general_iniquries'])
    }
    const scrollToOptions: ScrollToOptions = { top: 0, behavior: 'smooth' };
    window.scrollTo(scrollToOptions);
  }
  about() {
    this.router.navigate(['/about'])
  }
  features() {
    this.router.navigate(['/features'])
    const scrollToOptions: ScrollToOptions = { top: 0, behavior: 'smooth' };
    window.scrollTo(scrollToOptions);
  }
  contact() {
    this.router.navigate(['/contact'])
    const scrollToOptions: ScrollToOptions = { top: 0, behavior: 'smooth' };
    window.scrollTo(scrollToOptions);
  }
  privacy_policy() {
    this.router.navigate(['/privacy_policy'])
    const scrollToOptions: ScrollToOptions = { top: 0, behavior: 'smooth' };
    window.scrollTo(scrollToOptions);
  }
  termsncondition(){
    this.router.navigate(['/termsncondition'])
    const scrollToOptions: ScrollToOptions = { top: 0, behavior: 'smooth' };
    window.scrollTo(scrollToOptions);

  }
  refund(){
    this.router.navigate(['/refund'])
    const scrollToOptions: ScrollToOptions = { top: 0, behavior: 'smooth' };
    window.scrollTo(scrollToOptions);

  }
 }
