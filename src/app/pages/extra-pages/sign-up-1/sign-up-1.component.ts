import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'page-sign-up-1',
  templateUrl: './sign-up-1.component.html',
  styleUrls: ['./sign-up-1.component.scss']
})
export class PageSignUp1Component implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() { }

  onSubmit() {
    this.router.navigate(['/default-layout/dashboard']);
  }
}
