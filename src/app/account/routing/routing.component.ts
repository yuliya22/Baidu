import { QueryRouteTruck } from './../../shared/mapService/queryRouteTruck.model';
import { QueryLocation } from './../../shared/mapService/queryLocation.model';
import { MapService } from '../../shared/mapService/map.service';
import { Component, OnInit, DoCheck} from '@angular/core';
import {
  ControlAnchor,
  MapOptions,
  NavigationControlOptions,
  NavigationControlType,
  Point,
  Marker,
  BMarker,
  BMapInstance,
  MarkerOptions,
  Animation,
} from 'angular2-baidu-map';

@Component({
  selector: 'app-routing',
  templateUrl: './routing.component.html',
  styleUrls: ['./routing.component.css']
})
export class RoutingComponent implements OnInit {
//Map_Settings
region = 'the whole country';
enableMap = false ;
optionsMap: MapOptions;
mapControl: BMapInstance;
point: Point;
navOptionsMap: NavigationControlOptions;
markers: Array<{ point?: Point; options?: MarkerOptions }>;
markerOption = {
  icon: {
    imageUrl: `assets/images/markericon.png`,
    size: {
      height: 25,
      width: 25
    },
    imageSize: {
      height: 25,
      width: 25
    }
  }
};
//SearchBar_Settings
 searchResultFrom=[];
 searchResultWay=[];
 searchResultTo=[];
 numberOfWay=[];
 enablePlus=true;
 enableCaculate=false;
 enableFrom=false;
 enableWay=[];
 enableTo=false;
 queryFrom: QueryLocation = {
  query:'',
  region:'',
  };
queryWay = [];
queryTo: QueryLocation = {
  query:'',
  region:'',
};
routeFrom = {
  lat:'',
  lng:'',
};
routeWay: any = [];
routeTo = {
  lat:'',
  lng:'',
};
constructor(
  private mapService: MapService,
) {
  this.queryFrom.region=this.region;
  this.queryTo.region=this.region;
  this.optionsMap = {
    centerAndZoom: {
      lat: 39.912695,
      lng: 116.502814,
      zoom: 10,
    },
    enableKeyboard: true,
    enableScrollWheelZoom: true,
  };
  this.markers = [];
  this.navOptionsMap = {
    anchor: ControlAnchor.BMAP_ANCHOR_TOP_RIGHT,
    type: NavigationControlType.BMAP_NAVIGATION_CONTROL_ZOOM,
  };
 }
ngOnInit(){
}
//For searchResult
plusWay(){
  this.queryWay.push(
    {
      query: '',
      region: this.region
    }
  );
  this.enableWay.push(false);
  if(this.queryWay.length>2) this.enablePlus=false;
  this.enableCaculate = this.checkStatus();
}
minusWay(id){
  this.queryWay.splice(id,1);
  this.routeWay.splice(id,1);
  this.enableWay.splice(id,1);
  this.enablePlus = true;
}
caculateWay(){
  console.log([this.routeFrom, this.routeWay, this.routeTo]);
  const query :QueryRouteTruck = {
    origin: this.routeFrom,
    waypoints: this.routeWay,
    destination: this.routeTo,
  };
  this.mapService.routeSearchTruck(query).subscribe(
    data=>{
      console.log(data);
    },
    err=>{
      console.log(err);
    }
  );
}
getLocationlist(where, id){
  let query;
  switch(where){
    case('from'): query= this.queryFrom; break;
    case('way'): query= this.queryWay[id]; break;
    case('to'): query= this.queryTo; break;
  }
  this.mapService.locationSearch(query).subscribe(
    res=>{
       if(res["results"]){
        const result= this.filterLocation(res["results"]);
        switch(where){
          case('from'): this.searchResultFrom= result; break;
          case('way'): this.searchResultWay= result; break;
          case('to'): this.searchResultTo= result; break;
        }
       }
    },
    err=>{
       console.log(err);
    }
  );
}
confirmLocation(where,id){
  let result = [];
  switch(where){
    case('from'):
      result = this.getMathLocation(this.queryFrom.query,this.searchResultFrom);
      if(result.length == 0){
        //for enableFromFalse
        this.enableFrom = false;
      }else{
        this.routeFrom = {
          lat: result[0].location.lat,
          lng: result[0].location.lng,
        }
        //for enableFrom
        this.enableFrom = true;
        this.enableCaculate = this.checkStatus();
      }
      break;
    case('way'):
    result = this.getMathLocation(this.queryWay[id].query,this.searchResultWay);
      if(result.length == 0){
       //for enableWay[id]False
       this.enableWay[id]=false;
      }else{
        this.routeWay.push({
          lat: result[0].location.lat,
          lng: result[0].location.lng,
        });
       //for enableWay[id]True
       this.enableWay[id]=true;
       this.enableCaculate = this.checkStatus();

      }
      break;
    case('to'):
      result = this.getMathLocation(this.queryTo.query,this.searchResultTo);
      if(result.length == 0){
        this.enableTo = false;
      }else{
        this.routeTo = {
          lat: result[0].location.lat,
          lng: result[0].location.lng,
        }
        this.enableTo = true;
        this.enableCaculate = this.checkStatus();

      }
      break;
  }
}
filterLocation(arr){
  let loc = [];
  for(let i=0; i< arr.length; i++){
    if(arr[i]['location']!==undefined) loc.push(arr[i]);
  }
  return loc;
}
getMathLocation(key, arr){
  let loc = [];
  for(let i=0; i< arr.length; i++){
    if(arr[i]['name'] == key) loc.push(arr[i]);
  }
  return loc;
}
checkStatus(){
  if(this.enableFrom && this.enableTo){
    for(let i=0; i<this.enableWay.length; i++){
      if(!this.enableWay[i]) return false;
    }
    return true;
  }else return false;
}
//For selection table

//For Maps
mapLoaded(e:BMapInstance){
this.enableMap = true;
this.mapControl = e;
}
setMap(opt){
const newMarker = {
  options:this.markerOption,
  point: {
    lat: opt.location.lat,
    lng: opt.location.lng,
  }
};
}
setZoomAndCenter(opt){
if(this.markers.length==0) return;
const center = {
 lat:opt.location.lat,
 lng:opt.location.lng,
 equals:Boolean,
};
const x = this.mapControl.pointToPixel(center).x/this.optionsMap.centerAndZoom.zoom;
const y = this.mapControl.pointToPixel(center).y/this.optionsMap.centerAndZoom.zoom;
}
}

