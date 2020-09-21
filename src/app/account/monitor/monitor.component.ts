import { MapService } from './../../shared/mapService/map.service';
import { UserService } from './../../shared/userService/user.service'
import { AfterViewInit, ViewChild} from '@angular/core';
import { Component, OnInit, DoCheck, Directive, HostListener} from '@angular/core';
import {
  ControlAnchor,
  MapOptions,
  NavigationControlOptions,
  NavigationControlType,
  Point,
  TextIconStyle,
  CanvasLayerOptions,
  Marker,
  BMarker,
  BMapInstance,
  MarkerOptions,
  Animation,
} from 'angular2-baidu-map';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource} from '@angular/material/table';
export interface BehaviorElement {
  Plate: string;
  cameraID: string;
  lat: string;
  lng: number;
}
@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css']
})
@Directive({
  selector: '[appMousePosition]'
})
export class MonitorComponent implements OnInit,AfterViewInit {
  //user
  user = '';
  //Map_Settings
  markers = [];
  title = 'angular5 Baidu-Map example';
  optionsMap: MapOptions;
  mapControl: BMapInstance;
  point: Point;
  navOptionsMap: NavigationControlOptions;
  mapcenter = {
    lat: 39.915,
    lng: 116.404,
  };
  sight = 400;
  mapzoom = 17;
  //SearchBar_Settings
  key;
  selectedItem = "";
  //selectionTable_Settings.
  foundedItem = [];
  selectionStatus = [];
  selectAll = true;
  //table
  tableStatus = false;
  infos=[];
  tableVal=[];
  tableBehaviorColBe: string[] = ['Plate', 'cameraID', 'lat', 'lng'];
  dataSourceBe = new MatTableDataSource<BehaviorElement>([]);
  @ViewChild(MatPaginator,{ static: false }) paginator: MatPaginator;
  @ViewChild(MatSort,{ static: false }) sort: MatSort;
  constructor(
    private mapService: MapService,
    private userService: UserService,
  ) {
    //map
    this.optionsMap = {
      centerAndZoom: {
        lat: this.mapcenter.lat,
        lng: this.mapcenter.lng,
        zoom: this.mapzoom,
      },
      enableKeyboard: true,
      enableScrollWheelZoom: true,
    };
    this.navOptionsMap = {
      anchor: ControlAnchor.BMAP_ANCHOR_TOP_RIGHT,
      type: NavigationControlType.BMAP_NAVIGATION_CONTROL_ZOOM,
    };

   }
  ngOnInit(){
  }
  ngAfterViewInit() {
    this.dataSourceBe.paginator = this.paginator;
    this.dataSourceBe.sort = this.sort;
  }
//user
getAll(){
  this.userService.getUserProfile().subscribe(
    res=>{
      this.user= res["user"].email;
      this.mapService.getVehicleInfoAll({auth:this.user}).subscribe(
        res=>{
          this.setCheckBox(res['result']);
          this.setTrackInfo(res['result']);
        },
        err=>{
          alert(err.error.message);
        }
      );
    },
    err=>{
      console.log(err);
    }
  );
}
//For trackInfo
setTrackInfo(data){
  this.mapService.getTrackInfoLast({data:data}).subscribe(
    res=>{
      this.setMap(res["result"]);
      this.infos=res["result"];
    },
    err=>{
      alert(err.error.message);
    }
  );
}
//for VehicleInfo
showInfo(){
  this.setTable();
  this.tableStatus=true;
}
tableClose(){
  this.tableStatus=false;
}
setTable(){
  this.tableVal=[];
  for(let i =0; i< this.infos.length; i++){
    const d={
      'Plate':this.infos[i].VehicleNumber,
      'cameraID':this.infos[i].CameraID,
      'lat':this.infos[i].lat,
      'lng':this.infos[i].lng,
    }
    this.tableVal.push(d);
  }
  this.dataSourceBe = new MatTableDataSource<BehaviorElement>(this.tableVal);
}
//For selection table
setCheckBox(data){
  this.foundedItem = data;
  for(let i = 0; i< data.length; i++)
   this.selectionStatus.push(true);
}
checkBoxall(){
    this.checkSetAll(this.selectAll);
}
checkSetAll(status) {
  for(let i=0;i<this.selectionStatus.length;i++){
    this.selectionStatus[i]=status;
  }
}
checkKey(key, string:string){
  if(!key) return true;
  if(string.indexOf(key)!=-1) return true
  else return false;
}
//For Maps
mapLoaded(e:BMapInstance){
  this.mapControl = e;
  this.getAll();
}
@HostListener('mousemove', ['$event']) onMouseMove(event) {
  console.log(event.clientX, event.clientY);
}
setMap(opt){
  this.setZoomAndCenter(opt);
  for(let i = 0 ; i < opt.length ; i ++){
    const newMarker = {
      canvaslayerOptions: this.getCanvasLayer(opt[i]),
    };
    this.markers.push(newMarker);
  }
}
getCanvasLayer(opt){
  const layer = {
    update(map: BMapInstance, canvas: HTMLCanvasElement) {
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        return
      }
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      var data = new window.BMap.Point(opt.lng, opt.lat)
      var pixel = map.pointToPixel(data);
      //set
      const radius = 30;
      const textsize = 15;
      const circleLineWidth = 5;
      const textLineWidth = 0.5;
      const name : string = opt.VehicleNumber;
      const text = name.substr(0,Math.floor(1.5*radius/textsize));
      //circle
      ctx.beginPath();
      ctx.save();
      ctx.fillStyle = "rgba(34, 25, 25, 0.63)";
      ctx.arc(pixel.x, pixel.y, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = 'red';
      ctx.lineWidth = circleLineWidth;
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      //text
      ctx.beginPath();
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.strokeStyle = 'white';
      ctx.lineWidth = textLineWidth;
      ctx.font = ""+(textsize)+"px Arial";
      // ctx.strokeText(text, pixel.x, pixel.y);
      ctx.stroke();
      ctx.font = ""+textsize+"px Arial";
      ctx.fillStyle = "white";
      ctx.fillText(text, pixel.x, pixel.y);
      ctx.fill();
      ctx.restore();
    }
  }
  return layer;
}
setZoomAndCenter(opt){
  const CZ = this.getCenter(opt);
  const center = {
    lat: CZ.lat,
    lng: CZ.lng,
    equals:Boolean,
  };
  const centerCritical = {
    lat: this.mapControl.getCenter().lat,
    lng: this.mapControl.getCenter().lng,
    equals: Boolean,
  }
  const x = (this.mapControl.pointToPixel(centerCritical).x-this.mapControl.pointToPixel(center).x);
  const y = (this.mapControl.pointToPixel(centerCritical).y-this.mapControl.pointToPixel(center).y);
  const zoom = CZ.zoom;
  this.mapControl.panBy( x, y, {noAnimation:false});
  this.mapControl.setZoom(zoom);
  this.mapcenter = { lat: CZ.lat, lng:CZ.lng };
}
getCenter(opt){
  if(opt.length==0) return;
  if(opt.length==1) return {lat:opt[0].lat, lng:opt[0].lng ,zoom: this.mapControl.getZoom()};
  let minLat, maxLat, minLng, maxLng, avgLat, avgLng;
  minLat = Number(opt[0].lat);
  maxLat = Number(opt[0].lat);
  minLng = Number(opt[0].lng);
  maxLng = Number(opt[0].lng);
  for(let i = 0 ; i < opt.length ; i++ ){
    if(opt[i].lat < minLat) minLat = Number(opt[i].lat);
    if(opt[i].lat > maxLat) maxLat = Number(opt[i].lat);
    if(opt[i].lng < minLng) minLng = Number(opt[i].lng);
    if(opt[i].lng > maxLng) maxLng = Number(opt[i].lng);
  }
  avgLat =minLat+ (maxLat-minLat)/2;
  avgLng =minLng+ (maxLng-minLng)/2;
  const min = {
    lat: minLat,
    lng: minLng,
    equals:Boolean,
  };
  const max = {
    lat: maxLat,
    lng: maxLng,
    equals: Boolean,
  }
  const width = Math.abs(this.mapControl.pointToPixel(min).x-this.mapControl.pointToPixel(max).x);
  const height = Math.abs(this.mapControl.pointToPixel(min).y-this.mapControl.pointToPixel(max).y);
  const critera = Math.max(width,height);
  const zoom = this.mapControl.getZoom() - Math.log2(critera/this.sight);
  return {lat:avgLat, lng:avgLng ,zoom: zoom};
}
setAnimation(marker: BMarker): void {
  // marker.setAnimation(Animation.BMAP_ANIMATION_BOUNCE);
}
showWindow({
             marker,
             map
           }: {
  marker: BMarker
  map: BMapInstance
}): void {
  map.openInfoWindow(
    new window.BMap.InfoWindow('地址：浦东南路360号', {
      offset: new window.BMap.Size(0, -30),
      title: '新上海国际大厦'
    }),
    marker.getPosition()
  );
}
}

