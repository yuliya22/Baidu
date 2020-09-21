import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { UpdateComponent } from './update/update.component';
import { RoutingComponent } from './routing/routing.component';
import { ReportsComponent } from './reports/reports.component';
import { ReplayComponent } from './replay/replay.component';
import { ActivationComponent } from './activation/activation.component';
import { MonitorComponent } from './monitor/monitor.component';
import { AccountRoutes } from './account.routing';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BaiduMapModule } from 'angular2-baidu-map';
import { DemoMaterialModule } from '../demo-material-module';
import { MapComponent } from './map/map.component';
import { ChartistModule } from 'ng-chartist';
@NgModule({
  declarations: [
    MonitorComponent,
    ActivationComponent,
    ReplayComponent,
    ReportsComponent,
    RoutingComponent,
    UpdateComponent,
    MapComponent,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    DemoMaterialModule,
    ChartistModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(AccountRoutes),
    BaiduMapModule.forRoot({ ak: 'z45YihwOQtgSEbUBnlx2gmVXCaGW7RPs' }),
  ]
})
export class AccountModule { }
