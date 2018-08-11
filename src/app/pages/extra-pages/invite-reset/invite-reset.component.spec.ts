import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteResetComponent } from './invite-reset.component';

describe('InviteResetComponent', () => {
  let component: InviteResetComponent;
  let fixture: ComponentFixture<InviteResetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteResetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
