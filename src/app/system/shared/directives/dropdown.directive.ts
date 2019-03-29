import { Directive, HostBinding, HostListener } from "@angular/core";

@Directive({
    selector: '[stsDropdown]'
})
export class DropdownDirective {
   @HostBinding('class.open') isOpen = false;

   @HostListener('click') onclick(){
       this.isOpen = !this.isOpen
   }
}