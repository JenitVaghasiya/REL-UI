import { Component } from '@angular/core';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'loader',
  styleUrls: ['./loader.scss'],
  template: `
    <div class="in modal-backdrop loader-overlay"></div>
    <div class="loader-message-container" aria-live="assertive" aria-atomic="false">
       <div class="loader-message">
       <svg class="lds-spin" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"
       xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><g transform="translate(80,50)">
            <g transform="rotate(0)">
            <circle cx="0" cy="0" r="10" fill="#3c4e62" fill-opacity="1" transform="scale(1.03259 1.03259)">
              <animateTransform attributeName="transform" type="scale"
              begin="-0.875s" values="1.1 1.1;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animateTransform>
              <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="-0.875s"></animate>
            </circle>
            </g>
            </g><g transform="translate(71.21320343559643,71.21320343559643)">
            <g transform="rotate(45)">
            <circle cx="0" cy="0" r="10" fill="#3c4e62" fill-opacity="0.875" transform="scale(1.04509 1.04509)">
              <animateTransform attributeName="transform" type="scale"
              begin="-0.75s" values="1.1 1.1;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animateTransform>
              <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="-0.75s"></animate>
            </circle>
            </g>
            </g><g transform="translate(50,80)">
            <g transform="rotate(90)">
            <circle cx="0" cy="0" r="10" fill="#3c4e62" fill-opacity="0.75" transform="scale(1.05759 1.05759)">
              <animateTransform attributeName="transform" type="scale"
              begin="-0.625s" values="1.1 1.1;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animateTransform>
              <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="-0.625s"></animate>
            </circle>
            </g>
            </g><g transform="translate(28.786796564403577,71.21320343559643)">
            <g transform="rotate(135)">
            <circle cx="0" cy="0" r="10" fill="#3c4e62" fill-opacity="0.625" transform="scale(1.07009 1.07009)">
              <animateTransform attributeName="transform" type="scale"
              begin="-0.5s" values="1.1 1.1;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animateTransform>
              <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="-0.5s"></animate>
            </circle>
            </g>
            </g><g transform="translate(20,50.00000000000001)">
            <g transform="rotate(180)">
            <circle cx="0" cy="0" r="10" fill="#3c4e62" fill-opacity="0.5" transform="scale(1.08259 1.08259)">
              <animateTransform attributeName="transform" type="scale"
              begin="-0.375s" values="1.1 1.1;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animateTransform>
              <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="-0.375s"></animate>
            </circle>
            </g>
            </g><g transform="translate(28.78679656440357,28.786796564403577)">
            <g transform="rotate(225)">
            <circle cx="0" cy="0" r="10" fill="#3c4e62" fill-opacity="0.375" transform="scale(1.09509 1.09509)">
              <animateTransform attributeName="transform" type="scale"
              begin="-0.25s" values="1.1 1.1;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animateTransform>
              <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="-0.25s"></animate>
            </circle>
            </g>
            </g><g transform="translate(49.99999999999999,20)">
            <g transform="rotate(270)">
            <circle cx="0" cy="0" r="10" fill="#3c4e62" fill-opacity="0.25" transform="scale(1.00759 1.00759)">
              <animateTransform attributeName="transform" type="scale"
              begin="-0.125s" values="1.1 1.1;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animateTransform>
              <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="-0.125s"></animate>
            </circle>
            </g>
            </g><g transform="translate(71.21320343559643,28.78679656440357)">
            <g transform="rotate(315)">
            <circle cx="0" cy="0" r="10" fill="#3c4e62" fill-opacity="0.125" transform="scale(1.02009 1.02009)">
              <animateTransform attributeName="transform" type="scale"
              begin="0s" values="1.1 1.1;1 1" keyTimes="0;1" dur="1s" repeatCount="indefinite"></animateTransform>
              <animate attributeName="fill-opacity" keyTimes="0;1" dur="1s" repeatCount="indefinite" values="1;0" begin="0s"></animate>
            </circle>
            </g>
          </g></svg>
       </div>
   </div>



    `
})
export class LoaderComponent {
  state = {
    message: 'Loading...'
  };
}