import { Injectable } from '@angular/core';

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
}

const MENUITEMS = [
  { state: 'home', name: 'Home', type: 'link', icon: 'av_timer' },
  { state: 'account', type: 'link', name: 'Myaccount', icon: 'crop_7_5' },
];

@Injectable()
export class MenuItemsOne {
  getMenuitem(): Menu[] {
    return MENUITEMS;
  }
}
