import { ElementRef } from '@angular/core';
import { Menu } from '../../models/menu';
import { Item } from '../../models/item';

export class GtagServiceMock {
  constructor() {}

  init(elementRef: ElementRef): void {}

  set(elementRef: ElementRef, menu: Menu, item?: Item): void {}
}
