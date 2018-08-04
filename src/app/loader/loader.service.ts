import { LoaderComponent } from './loader.component';
import {
  ComponentFactoryResolver,
  ComponentRef,
  Injectable,
  ViewContainerRef
} from '@angular/core';

@Injectable()
export class LoaderService {
  private compRef: ComponentRef<LoaderComponent>;
  private loaderComp: ViewContainerRef;
  count = 0;
  constructor(private resolver: ComponentFactoryResolver) {}

  public start(loaderComp: ViewContainerRef, disableControl: boolean = false) {
    if (this.compRef && this.count === 1) {
      this.compRef.destroy();
      this.count -= 1;
    }
    if (this.count === 0) {
      this.loaderComp = loaderComp;
      const factory = this.resolver.resolveComponentFactory(LoaderComponent);
      this.compRef = loaderComp.createComponent(factory);
      this.count += 1;
    }
  }
  public stop() {
    if (this.compRef && this.count === 1) {
      this.compRef.destroy();
      this.count -= 1;
    }
  }
  public startWithCounter(loaderCount: number, loaderComp: ViewContainerRef) {
    if (loaderCount > 0) {
      const factory = this.resolver.resolveComponentFactory(LoaderComponent);
      this.compRef = loaderComp.createComponent(factory);
    }
  }
  public stopWithCounter(loaderCount: number, loaderComp: ViewContainerRef) {
    if (loaderCount === 0) {
      const factory = this.resolver.resolveComponentFactory(LoaderComponent);
      this.compRef = loaderComp.createComponent(factory);
    }
  }
}
