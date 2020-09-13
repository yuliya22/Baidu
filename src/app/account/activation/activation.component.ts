import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MapService } from './../../shared/mapService/map.service';
import { UserService } from './../../shared/userService/user.service';
@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.scss']
})
export class ActivationComponent implements OnInit {
  formGroup: FormGroup;
  user = '';
  constructor(
    private _formBuilder: FormBuilder,
    private mapService: MapService,
    private userService: UserService,
    ) {
      this.getAll();
     }

  ngOnInit() {
    this.formGroup = this._formBuilder.group({
      VehicleID: ['', Validators.required],
      PlateNumber: ['', Validators.required],
      DriverName: ['', Validators.required],
      Country: ['', Validators.required],
      Group: ['', Validators.required],
			Category: ['', Validators.required],
			EngineType: ['', Validators.required],
			VIN: ['', Validators.required],
			Time: ['', Validators.required],
			cardName: ['', Validators.required],
			cardNumber: ['', Validators.required],
			ExpirationDate: ['', Validators.required],
      SecurityCode: ['', Validators.required],
      AutoRenew:['', Validators.required],
		});
  }
  getAll(){
    this.userService.getUserProfile().subscribe(
      res=>{
        this.user= res["user"].email;
      },
      err=>{
        console.log(err);
      }
    );
  }
  activate() {
    if(this.formGroup.valid||true){
      const data= this.formGroup.value;
      data.auth= this.user;
      this.mapService.registerVehicleInfo(data).subscribe(
        res=>{
          alert("successfully registered!");
        },
        err=>{
          alert(err);
        }
      );
    }
  }
}
