import { Component, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'card',
  templateUrl: 'card.component.html',
  styleUrls: ['card.component.scss']
})
export class RelUiCardComponent {
  @Input() title = '';
  @Input() bgColor = '';
  @Input() customBgColor = '';
  @Input() color = '';
  @Input() customColor = '';
  @Input() bgImage = '';
  @Input() outline = false;
  @Input() indents: any = '1.57143rem';
  @Input() align = 'left';
}