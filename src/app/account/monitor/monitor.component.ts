import { QueryLocation } from './../../shared/mapService/queryLocation.model';
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
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css']
})
export class MonitorComponent implements OnInit {
  //user
  user = '';
  //Map_Settings
  title = 'angular5 Baidu-Map example';
  region = 'Beijing';
  enableMap = false ;
  optionsMap: MapOptions;
  mapControl: BMapInstance;
  point: Point;
  navOptionsMap: NavigationControlOptions;
  markers: Array<{ point?: Point; options?: MarkerOptions; canvaslayerOptions?: CanvasLayerOptions}>;
  markerOption = {
    icon: {
      imageUrl: `assets/images/markericon.png`,
      size: {
        height: 35,
        width: 25
      },
      imageSize: {
        height: 35,
        width: 25
      }
    },
   title: 'beijing',
  };
  circleOptions = {
    strokeColor: 'blue',
    strokeWeight: 2
  };
  mapcenter = {
    lat: 39.915,
    lng: 116.404,
  };
  sight = 400;
  mapzoom = 17;
  query: QueryLocation ={
    query:'',
    region:'',
  };
  //SearchBar_Settings
  selectedItem = "";
  searchResult = [];
  //selectionTable_Settings.
  foundedItem = [];
  selectionStatus = [];
  selectAll = false;
  constructor(
    private mapService: MapService,
    private userService: UserService,
  ) {
    //map
    this.query.region=this.region;
    this.optionsMap = {
      centerAndZoom: {
        lat: this.mapcenter.lat,
        lng: this.mapcenter.lng,
        zoom: this.mapzoom,
      },
      enableKeyboard: true,
      enableScrollWheelZoom: true,
    };
    this.markers = [];
    this.navOptionsMap = {
      anchor: ControlAnchor.BMAP_ANCHOR_TOP_RIGHT,
      type: NavigationControlType.BMAP_NAVIGATION_CONTROL_ZOOM,
    };
    this.getAll();
   }
ngOnInit(){
}
//user
getAll(){
  this.userService.getUserProfile().subscribe(
    res=>{
      this.user= res["user"].email;
      this.mapService.getVehicleInfo({auth:this.user}).subscribe(
        res=>{
          console.log(res);

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
//For searchResult
getMonitorSeachlist(){

  this.mapService.locationSearch(this.query).subscribe(
    res=>{
       if(res["results"].length){
          this.searchResult=res["results"];
       }
    },
    err=>{
       console.log(err);
    }
  );
}
searchConfirm(){
  if(this.searchResult.length>0){
    this.setMap(this.searchResult[0]);
  }
}
//For selection table
checkBoxall(){
    this.checkSetAll(this.selectAll);
}
checkSetAll(status) {
  for(let i=0;i<this.selectionStatus.length;i++){
    this.selectionStatus[i]=status;
  }
}
//For Maps
mapLoaded(e:BMapInstance){
  this.enableMap = true;
  this.mapControl = e;
}
setMap(opt){
  this.markerOption.title = opt.name;
  const newMarker = {
    options:this.markerOption,
    point: {
      lat: opt.location.lat,
      lng: opt.location.lng,
    },
    canvaslayerOptions: this.getCanvasLayer(opt),
  };
   this.selectionStatus.unshift(true);
   this.markers.unshift(newMarker);
   this.foundedItem.unshift(opt);
   this.selectAll = true;
   this.searchResult = [];
   this.setZoomAndCenter(opt);
}
getCanvasLayer(opt){
  const layer = {
    update(map: BMapInstance, canvas: HTMLCanvasElement) {
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        return
      }
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      var data = new window.BMap.Point(opt.location.lng, opt.location.lat)
      var pixel = map.pointToPixel(data);
      //set
      const radius = 30;
      const textsize = 15;
      const circleLineWidth = 5;
      const textLineWidth = 0.5;
      const name : string = opt.name;
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
  if(this.markers.length==0) return;
  const CZ = this.getCenter();
  const center = {
    lat: CZ.lat,
    lng:CZ.lng,
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
getCenter(){
  if(this.markers.length==0) return;
  if(this.markers.length==1) return {lat:this.markers[0].point.lat, lng:this.markers[0].point.lng ,zoom: this.mapControl.getZoom()};
  let minLat, maxLat, minLng, maxLng, avgLat, avgLng;
  minLat = this.markers[0].point.lat;
  maxLat = this.markers[0].point.lat;
  minLng = this.markers[0].point.lng;
  maxLng = this.markers[0].point.lng;
  for(let i = 0 ; i < this.markers.length ; i++ ){
    if(this.markers[i].point.lat < minLat) minLat = this.markers[i].point.lat;
    if(this.markers[i].point.lat > maxLat) maxLat = this.markers[i].point.lat;
    if(this.markers[i].point.lng < minLng) minLng = this.markers[i].point.lng;
    if(this.markers[i].point.lng > maxLng) maxLng = this.markers[i].point.lng;
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
  const zoom = this.mapControl.getZoom() - Math.log2(width/this.sight);
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

