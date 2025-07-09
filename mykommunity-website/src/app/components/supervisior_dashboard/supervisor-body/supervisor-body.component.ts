import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-supervisor-body',
  templateUrl: './supervisor-body.component.html',
  styleUrls: ['./supervisor-body.component.css']
})
export class SupervisorBodyComponent {
  @Input() collapsed = false;
  @Input() screenWidth = 0;

  getBodyClass(): string{
    let styleClass = '';
    if(this.collapsed && this.screenWidth > 768){
      styleClass = 'body-trimmed';

    }
    else if(this.collapsed && this.screenWidth <= 768 && this.screenWidth > 0){
      styleClass = 'body-md-screen'
    }
    return styleClass;
  }
}
