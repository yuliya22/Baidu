import { MenuItemsOne} from './menu1/menu-itemsOne';
import { MenuItemsTwo} from './menu2/menu-itemsTwo';
import { FormsModule } from '@angular/forms';
import { DemoMaterialModule } from './../demo-material-module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Layout1Component } from './layout1/layout1.component';
import { Layout2Component } from './layout2/layout2.component';
import { Header1Component } from './header1/header1.component';
import { Header2Component } from './header2/header2.component';
import { Menu1Component } from './menu1/menu1.component';
import { Menu2Component } from './menu2/menu2.component';
import { SpinnerComponent } from './spinner.component';
import { AccordionAnchorDirective, AccordionLinkDirective, AccordionDirective } from './accordion';
@NgModule({
  declarations: [Layout1Component, Layout2Component, Header1Component,
     Header2Component, Menu1Component, Menu2Component, SpinnerComponent,
     AccordionAnchorDirective, AccordionLinkDirective, AccordionDirective,
    ],
  imports: [
    CommonModule, DemoMaterialModule, RouterModule,FormsModule,
  ],
  exports: [Layout1Component, Layout2Component, Header1Component,
    Header2Component, Menu1Component, Menu2Component, SpinnerComponent,
    AccordionAnchorDirective, AccordionLinkDirective, AccordionDirective,
  ],
  providers: [ MenuItemsOne, MenuItemsTwo ],
})
export class ComponentModule { }
