import {Component, Input, OnInit} from '@angular/core';
import {Recipe} from '../recipe.model';
import {RecipeService} from '../../recipe.service';

@Component({
  selector: 'app-recipes-iteam',
  templateUrl: './recipes-iteam.component.html',
  styleUrls: ['./recipes-iteam.component.css']
})
export class RecipesIteamComponent implements OnInit {
  @Input() recipe: Recipe;
  @Input() index: number;

  constructor(private recipeService: RecipeService) { }

  ngOnInit() {
  }

}
