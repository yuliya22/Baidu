import { UserService } from './../../shared/userService/user.service';
import { Component, OnInit } from '@angular/core';
import { MenuItemsTwo } from './../menu2/menu-itemsTwo';
import { Router } from "@angular/router";
@Component({
  selector: 'app-header2',
  templateUrl: './header2.component.html',
  styleUrls: ['./header2.component.css']
})
export class Header2Component implements OnInit {

  constructor(
    public menuItems: MenuItemsTwo,
    private userService: UserService,
    private router : Router,
  ) { }

  ngOnInit() {
  }
  logout(){
    this.userService.deleteToken();
    this.router.navigateByUrl('');
  }
}
