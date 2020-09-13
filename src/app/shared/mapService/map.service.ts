import { QueryRouteTruck } from './queryRouteTruck.model';
import { QueryLocation } from './queryLocation.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class MapService {
  baiduBaseUrlLocation="/baidu/place/search?";
  baiduBaseUrlRouteTruck="/baidu/route/truck?";
  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };
  ak = 'z45YihwOQtgSEbUBnlx2gmVXCaGW7RPs';
  constructor(private http: HttpClient) {

   }
  //getVehiclInfo
  registerVehicleInfo(data){
    return this.http.post("/api/vehicle/registerInfo",data);
  }
  getVehicleInfo(data){
   return this.http.post("/api/vehicle/getInfo",data);
  }
  //Location Search
  locationSearch(data: QueryLocation){
    return this.http.get(this.baiduBaseUrlLocation
      +"query="+data.query+"&"
      +"region="+data.region+"&"
      +"ak="+this.ak+"&output=json"
      );
  }
  //Route Search
  routeSearchTruck(data: QueryRouteTruck){//origin,destination,waypoints
   const origin = "origin="+ data.origin.lat +","+data.origin.lng;
   const destination = "&destination="+ data.destination.lat +","+data.destination.lng;
   let waypoints = "";
   for(let i=0;i<data.waypoints.length;i++){
     if(i == 0) waypoints += "&waypoints="+data.waypoints[i].lat+","+data.waypoints[i].lng
     else waypoints += "|"+ data.waypoints[i].lat+","+data.waypoints[i].lng
   }
   const query = this.baiduBaseUrlRouteTruck +origin +  waypoints + destination + "&ak=" + this.ak+ "&output=json";
   return this.http.get(query);
  }
}
