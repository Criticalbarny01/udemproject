import { Component, OnInit } from '@angular/core';
import {Recipe} from './recipe.model';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.css']
})
export class RecipesListComponent implements OnInit {

  recipes: Recipe[] = [
    new Recipe('A test Recipe', 'this is a simple desc', 'https://healthiersteps.com/wp-content/uploads/2019/07/pupusa-recipe.jpg')
  ];

  constructor() { }

  ngOnInit() {
  }

}
