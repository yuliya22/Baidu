import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MapService } from './../../shared/mapService/map.service';
import { UserService } from './../../shared/userService/user.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {
  formGroup: FormGroup;
  user = '';
  info = [];
  constructor(
    private _formBuilder: FormBuilder,
    private mapService: MapService,
    private userService: UserService,
  ) {
    this.formGroup = this._formBuilder.group({
      VehicleNumber: ['', Validators.required],
      CameraID: ['', Validators.required],
      PhoneNumber: ['', Validators.required],
		});
    this.getAll();
   }
   getAll(){
    this.userService.getUserProfile().subscribe(
      res=>{
        this.user= res["user"].email;
        this.mapService.getVehicleInfo({auth:this.user}).subscribe(
          res=>{
            this.setformgroup(res["result"])
          }
        );
      },
      err=>{
        console.log(err);
      }
    );
  }
  update() {
    if(this.formGroup.valid||true){
      const data= this.formGroup.value;
      data.auth= this.user;
      this.mapService.updateVehicleInfo(data).subscribe(
        res=>{
          alert("successfully registered!");
        },
        err=>{
          console.log(err);
          alert(err.error.message);
        }
      );
    }
  }
  setformgroup(data){
    this.formGroup = this._formBuilder.group({
      VehicleNumber: [data.VehicleNumber, Validators.required],
      CameraID: [data.CameraID, Validators.required],
      PhoneNumber: [data.PhoneNumber, Validators.required],
		});
  }
  ngOnInit() {
  }

}
