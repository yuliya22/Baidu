import { MapService } from './../../shared/mapService/map.service';
import { UserService } from './../../shared/userService/user.service'
import { Component, OnInit, DoCheck} from '@angular/core';
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

@Component({
  selector: 'app-replay',
  templateUrl: './replay.component.html',
  styleUrls: ['./replay.component.css']
})
export class ReplayComponent implements OnInit {
 //user
 user = '';
 //Map_Settings
 mapstatus=false;
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
 //selectionTable_Settings.
 vehicleNumber;
 foundedItem = [];
 //date
 date= new Date();
 //for Trip
 progress=0;
 trip = [];
 start = false;
 startPoint;
 endPoint;
 curPoint = 0;
 routes=[];
 timeInterval;
 time="";
  constructor(
    private mapService: MapService,
    private userService: UserService,
  ) {
    //data
    this.date.setDate(this.date.getDate()-1)
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
  ngOnInit() {
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
           this.getTripInfo();
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
//for trip info
getTripInfo(){
  this.refreshTrip();
  this.mapService.getTripInfo({
   VehicleNumber:this.vehicleNumber,
   TrackTime:this.date,
  }).subscribe(
    res=>{
      this.trip=res['result'];
      this.setMap(this.trip);
    },
    err=>{
      console.log(err);
      this.trip=[];
    }
  );
}
refreshTrip(){
  this.progress=0;
  this.trip = [];
  this.start = false;
  this.curPoint = 0;
  this.routes=[];
  this.time="";
}
//for Radious
checkKey(key, string:string){
  if(!key) return true;
  if(string.indexOf(key)!=-1) return true
  else return false;
}
radioChange(){
  if(this.mapstatus==false) return
  this.getTripInfo();
}
//for movie
tripSet(){
  this.progress=(100/(this.trip.length-1))*this.curPoint;
  const t=new Date(this.trip[this.curPoint].track_time);
  this.time=''+t.getHours()+':'+t.getMinutes()+':'+t.getSeconds();
  const newMarker={
    layerCanvas:this.getCanvasLayer(this.curPoint,this.routes)
  };
  this.markers=[];
  this.markers.push(newMarker);
}
tripIntervals(){
  this.timeInterval=setInterval(
    ()=>{
      if(this.trip.length>(this.curPoint+1)){
         this.curPoint++;
         this.tripSet();
      }else{
        this.start=false;
        this.curPoint=0;
        this.tripSet();
        clearInterval(this.timeInterval);
      }
    },1000
  );
}
startTrip(){
  if(this.mapstatus==false || this.trip.length==0) return
  if(this.start==false){
    this.start=true;
    if(this.progress==100){
      this.progress=0;
    }
    this.tripIntervals();
  }
}
pauseTrip(){
  if(this.mapstatus==false || this.trip.length==0) return
  if(this.start==true){
    this.start=false;
    clearInterval(this.timeInterval)
  }
}
nextDate(){
  if(this.mapstatus==false) return
 this.date.setDate(this.date.getDate()+1);
 this.getTripInfo();
}
prevDate(){
  if(this.mapstatus==false) return
  this.date.setDate(this.date.getDate()-1);
  this.getTripInfo();
}
nextFrame(){
  if(this.mapstatus==false || this.start==false) return
  if(this.trip.length>(this.curPoint+1)){
    clearInterval(this.timeInterval)
    this.curPoint++;
    this.tripSet();
    this.tripIntervals();
  }
}
prevFrame(){
  if(this.mapstatus==false || this.start==false) return
  if(0< this.curPoint){
    clearInterval(this.timeInterval)
    this.curPoint--;
    this.tripSet();
    this.tripIntervals();
  }
}
datechange(){
  if(this.mapstatus==false) return
  this.getTripInfo();
}
//For Maps
mapLoaded(e:BMapInstance){
  this.mapstatus = true;
  this.mapControl = e;
  this.getAll();
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
setMap(opt:Array<[]>){
  this.setZoomAndCenter(opt);
  this.setRoute(opt);
  const newMarker={
    layerCanvas:this.getCanvasLayer(this.curPoint,this.routes)
  };
  this.markers=[];
  this.markers.push(newMarker);
}
//for canvas
getCanvasLayer(cur, routes:Array<any>){
  console.log(cur,routes);
  const layer = {
    update(map: BMapInstance, canvas: HTMLCanvasElement) {
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        return
      }
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      if(routes.length==0) return
      //set
      const radiusStart = 10;
      //routes
      if(routes.length>1){
        let s = routes[0];
        for(let i = 1; i < routes.length; i++ ){
          let e = routes[i];
          let ps = map.pointToPixel(new window.BMap.Point(s.y, s.x));
          let pe = map.pointToPixel(new window.BMap.Point(e.y, e.x));
          ctx.beginPath();
          ctx.save();
          ctx.lineWidth = 3;
          if(i%2==0){
            ctx.strokeStyle = "DarkGray";
          }else{
            ctx.strokeStyle = "yellow";
          }
          ctx.moveTo(ps.x, ps.y);
          ctx.lineTo(pe.x, pe.y);
          ctx.stroke();
          ctx.restore();
          s = routes[i];
        }
      }
       //cur
       let dataCur = new window.BMap.Point(routes[cur].y, routes[cur].x)
       let pixelCur = map.pointToPixel(dataCur);
       ctx.beginPath();
       ctx.save();
       ctx.fillStyle = "black";
       ctx.arc(pixelCur.x, pixelCur.y, radiusStart, 0, 2 * Math.PI);
       ctx.fill();
       ctx.restore();
    }
  }
  return layer;
}
setRoute(opt:Array<any>){
  if(opt.length==0) return
 const CZ= this.getCenter(opt);
 this.startPoint={
   x:CZ.min.lat,
   y:CZ.min.lng
 };
 this.endPoint={
  x:CZ.max.lat,
   y:CZ.max.lng
 };
 this.routes=[];
 for(let i=0;i<opt.length;i++){
   this.routes.push(
    {
      x:opt[i].lat,
      y:opt[i].lng
    }
   );
 }
}
setZoomAndCenter(opt:Array<any>){
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
  if(opt.length==0) {
    return {lat:39, lng:111 ,zoom: 10};
  }
  if(opt.length==1) {
    return {lat:opt[0].lat, lng:opt[0].lng ,zoom: 15};
  }
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
  avgLat = (maxLat+minLat)/2;
  avgLng = (maxLng+minLng)/2;
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
  return {lat:avgLat, lng:avgLng ,zoom: zoom, min:min, max:max};
}
changePointToPixel(lat,lng){
  const center = {
    lat: lat,
    lng: lng,
    equals: Boolean,
  }
  const x = this.mapControl.pointToPixel(center).x;
  const y = this.mapControl.pointToPixel(center).y;
  return {x:x, y:y};
}
}
