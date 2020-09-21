import { MapService } from './../../shared/mapService/map.service';
import { UserService } from './../../shared/userService/user.service';
import { AfterViewInit, ViewChild} from '@angular/core';
import { Component, OnInit, DoCheck, } from '@angular/core';
import * as Chartist from 'chartist';
import { ChartType, ChartEvent } from 'ng-chartist';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource} from '@angular/material/table';
declare var require: any;

export interface Chart {
	type: ChartType;
	data: Chartist.IChartistData;
	options?: any;
	responsiveOptions?: any;
	events?: ChartEvent;
}
export interface BehaviorElement {
  Date: string;
  Distance: number;
  Stops: number;
  AvgSpeed: number;
  Fuel: number;
  RapidAccel: number;
  HarshBracking: number;
  EngineIdle: number;
}
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit,AfterViewInit {
 //user
 user = '';
 //SearchBar_Settings
 key;
 //selectionTable_Settings.
 vehicleNumber;
 foundedItem = [];
 //date
 dateFrom:Date;
 dateTo:Date;
 //settingReports
 labels=[];
 values=[];
 tripSum={
  distance:0,
  stops:0,
  avgSpeed:0,
  Fuel:0,
  RapidAccel:0,
  HarshBracking:0,
  EngineIdle:0,
};
 //chart
 barChart1: Chart = {
  type: 'Bar',
  data: {
    "labels": [],
    "series": [],
  },
  options: {
    seriesBarDistance: 15,
    high: 1200,
    scales: {
      width:100
    },
    axisY: {
      showGrid: true,
      offset: 40
    },
    height: 360,
  },
  responsiveOptions: [
    [
      'screen and (min-width: 640px)',
      {
        axisX: {
          labelInterpolationFnc: function(
            value: number,
            index: number
          ): string {
            return index % 1 === 0 ? `${value}` : null;
          }
        }
      }
    ]
  ]
};
 //Mileage, Fuel and Driver Behavior
 tableBehaviorColBe: string[] = ['Date', 'distance', 'stops', 'avgSpeed', 'Fuel', 'RapidAccel', 'HarshBracking', 'EngineIdle'];
 tableBehaviorColTrip: string[] = ['Date', 'distance', 'stops', 'avgSpeed', 'Fuel', 'RapidAccel', 'HarshBracking', 'EngineIdle'];
 dataSourceBe = new MatTableDataSource<BehaviorElement>([]);
 dataSourceTrip = new MatTableDataSource<BehaviorElement>([]);
 @ViewChild(MatPaginator,{ static: false }) paginator: MatPaginator;
 @ViewChild(MatSort,{ static: false }) sort: MatSort;
  constructor(
    private mapService: MapService,
    private userService: UserService,
  ) {
    this.getAll();
   }
  //user
  getAll(){
    this.userService.getUserProfile().subscribe(
      res=>{
        this.user= res["user"].email;
        this.mapService.getVehicleInfoAll({auth:this.user}).subscribe(
          res=>{
          this.foundedItem=res['result'];
          if(this.foundedItem.length>0) {
            this.vehicleNumber = this.foundedItem[0].VehicleNumber;
            }
          },
          err=>{
            console.log(err);
          }
        );
      },
      err=>{
        console.log(err);
      }
    );
  }
 //info
 getInfo(){
   if(this.foundedItem.length>0&&this.dateFrom&&this.dateTo&&this.dateTo>this.dateFrom){
    console.log('setInfoClicked!');
    this.mapService.getReportInfoAll({VehicleNumber:this.vehicleNumber}).subscribe(
      res=>{
      this.settingReports(res['result']);
      this.setChart();
      this.setTripSummary();
      this.setTableBe();
      },
      err=>{
        console.log(err);
      }
    );
   }
 }

 settingReports(opt:Array<any>){
  if(opt.length==0) return;
  this.labels=[];
  this.values=[];
  const dayLength = (this.dateTo.getTime()-this.dateFrom.getTime())/(60*60*24*1000);
  const oneDay = 60*60*24*1000;
  if(dayLength<7){
    for(let i = this.dateFrom.getTime(); i<= this.dateTo.getTime(); i += oneDay){
      const day= new Date(i);
      const label=''+day.getFullYear()+'-'+(day.getMonth()+1)+'-'+day.getDate();
      this.labels.push(label);
      this.getDataRange(day,'date', opt);
    }
  }
  else if(dayLength>=7){
    let days = new Date();
    for(let i = this.dateFrom.getMonth(); i<= this.dateTo.getMonth(); i++){
      days.setMonth(i);
      const label=''+this.dateFrom.getFullYear()+'-'+(i+1);
      this.labels.push(label);
      this.getDataRange(new Date(days),'month', opt);
    }
  }
 }
 getDataRange(key:Date, method, data){
  console.log('key='+key);
   for(let i =0; i<data.length; i++){
     if(method=='date'){
       const day= new Date(data[i]['time_at']);
       if(day.getDate()==key.getDate()&&day.getMonth()==key.getMonth()&&day.getFullYear()==key.getFullYear()){
       this.values.push(
         {
          distance: data[i]['distance'],
          stops: data[i]['stops'],
          avgSpeed:data[i]['avgSpeed'],
          Fuel: data[i]['Fuel'],
          RapidAccel: data[i]['RapidAccel'],
          HarshBracking: data[i]['HarshBracking'],
          EngineIdle: data[i]['EngineIdle']
         }
       );
       }
     }
     else if(method=='month'){
      const day= new Date(data[i]['time_at']);
      if(day.getMonth()==key.getMonth()&&day.getFullYear()==key.getFullYear()){
      if(i>0){
        this.values[this.values.length-1]['distance']+=data[i]['distance'];
        this.values[this.values.length-1]['stops']+=data[i]['stops'];
        this.values[this.values.length-1]['avgSpeed']+=data[i]['avgSpeed'];
        this.values[this.values.length-1]['Fuel']+=data[i]['Fuel'];
        this.values[this.values.length-1]['RapidAccel']+=data[i]['RapidAccel'];
        this.values[this.values.length-1]['HarshBracking']+=data[i]['HarshBracking'];
        this.values[this.values.length-1]['EngineIdle']+=data[i]['EngineIdle'];
      }else{
        this.values.push(
          {
           distance: data[i]['distance'],
           stops: data[i]['stops'],
           avgSpeed:data[i]['avgSpeed'],
           Fuel: data[i]['Fuel'],
           RapidAccel: data[i]['RapidAccel'],
           HarshBracking: data[i]['HarshBracking'],
           EngineIdle: data[i]['EngineIdle']
          }
        );
      }
      }
    }
   }
   if(method=='month'){
     this.values['avgSpeed']/data.length;
     this.values['RapidAccel']/data.length;
   }
 }
 //for Chart
 setChart(){
   this.barChart1.data.labels=[];
   this.barChart1.data.series=[];
   this.barChart1.data.labels=this.labels;
   let dis=[];
   let score=[];
   let Max=0;
   for(let i=0; i<this.values.length; i++){
     dis.push(this.values[i]['distance']);
     score.push(this.values[i]['avgSpeed']);
     if(this.values[i]['distance']>Max) Max=this.values[i]['distance']
     if(this.values[i]['avgSpeed']>Max) Max=this.values[i]['avgSpeed']
   }
   this.barChart1.data.series=[dis,score];
   this.barChart1.options.high=Max;
 }
 //setTripSummary()
 setTripSummary(){
   this.tripSum={
     distance:0,
     stops:0,
     avgSpeed:0,
     Fuel:0,
     RapidAccel:0,
     HarshBracking:0,
     EngineIdle:0,
   };
   for(let i=0; i<this.values.length; i++){
      this.tripSum['distance']+=this.values[i]['distance'];
      this.tripSum['stops']+=this.values[i]['stops'];
      this.tripSum['avgSpeed']+=this.values[i]['avgSpeed'];
      this.tripSum['Fuel']+=this.values[i]['Fuel'];
      this.tripSum['RapidAccel']+=this.values[i]['RapidAccel'];
      this.tripSum['HarshBracking']+=this.values[i]['HarshBracking'];
      this.tripSum['EngineIdle']+=this.values[i]['EngineIdle'];
   }
   this.tripSum['avgSpeed']=this.tripSum['avgSpeed']/this.values.length;
   this.tripSum['RapidAccel']=this.tripSum['RapidAccel']/this.values.length;
   console.log(this.tripSum);
 }
  //forTableBehavor
  setTableBe() {
    for(let i =0; i< this.values.length; i++){
      this.values[i].Date=this.labels[i];
    }
    this.dataSourceBe = new MatTableDataSource<BehaviorElement>(this.values);
  }
  //for Radious
checkKey(key, string:string){
  if(!key) return true;
  if(string.indexOf(key)!=-1) return true
  else return false;
}
  ngOnInit() {
  }
  ngAfterViewInit() {
    this.dataSourceBe.paginator = this.paginator;
    this.dataSourceBe.sort = this.sort;
  }
}
