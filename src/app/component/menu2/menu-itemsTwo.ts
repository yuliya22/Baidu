import { Injectable } from '@angular/core';

export interface Menu {
  state: string;
  name: string;
  type: string;
  icon: string;
}

const MENUITEMS = [
  { state: 'monitor', name: 'Monitor', type: 'link', icon: 'av_timer' },
  { state: 'replay', type: 'link', name: 'Replay', icon: 'crop_7_5' },
  { state: 'activation', type: 'link', name: 'Activation', icon: 'crop_7_5' },
  { state: 'update', type: 'link', name: 'Update', icon: 'crop_7_5' },
  { state: 'routing', type: 'link', name: 'Routing', icon: 'crop_7_5' },
  { state: 'reports', type: 'link', name: 'Reports', icon: 'crop_7_5' },
];

@Injectable()
export class MenuItemsTwo {
  getMenuitem(): Menu[] {
    return MENUITEMS;
  }
}
