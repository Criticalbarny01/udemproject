import { Component, OnInit } from '@angular/core';
import {Ingredinet} from '../shared/ingredient.model';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  ingredients: Ingredinet[] = [
    new Ingredinet('apples', 5),
    new Ingredinet('tomatos', 6),
  ]
  constructor() { }

  ngOnInit() {
  }

}
