import { Component, Input } from '@angular/core';

@Component({
  selector: 'tab',
  template: `
        <div [hidden]="!active" class="tab-content">
            <!-- Open games -->
              <ng-content></ng-content>
        </div>`
})
export class Tab {
  @Input('tabTitle') title: string;
  @Input() active = false;
}