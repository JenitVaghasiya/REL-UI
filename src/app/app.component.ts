import { Component, HostListener } from '@angular/core';
import { Router } from '../../node_modules/@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'app';
  opened = true;
  mobileIcon = false;
  mobileWindowSize = 599;
  userLanguage = '';
  searchInput = '';
  resetSearch = false;
  menuExpand = false;
  constructor(private router: Router) {

  }
  mobileMenu(): void {
    this.opened = !this.opened;
    this.mobileIcon = this.opened;
  }

  searchFocus(): void {
    this.resetSearch = true;
  }

  searchFocusOut(): void {
    if (!this.searchInput || this.searchInput.length === 0) {
      this.resetSearch = false;
    }

  }

  searchReset() {
    this.resetSearch = false;
  }

  layoutClick() {
    this.router.navigate(['/pagenotfound']);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth < this.mobileWindowSize) {
      this.opened = false;
      this.mobileIcon = false;
    } else {
      this.opened = true;
      this.mobileIcon = false;
    }
  }
}
