import {Recipe} from './recipes-list/recipe.model';
import {EventEmitter, Injectable} from '@angular/core';
import {Ingredient} from '../shared/ingredient.model';
import {ShoppingListService} from '../shopping-list/shopping-list.service';

@Injectable()
export class RecipeService {
  recipeSelected = new EventEmitter<Recipe>();

  private recipes: Recipe[] = [
    new Recipe('A test Recipe', 'this is a simple desc', 'https://healthiersteps.com/wp-content/uploads/2019/07/pupusa-recipe.jpg',
      [new Ingredient('Meat', 1),
        new Ingredient('Cheese', 2)]),
    new Recipe('Another test Recipe', 'this is a simple desc', 'https://healthiersteps.com/wp-content/uploads/2019/07/pupusa-recipe.jpg',
      [new Ingredient('Something', 3),
        new Ingredient('Tomatoes', 5)])
  ];

  constructor(private slService: ShoppingListService) {

  }

  public getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }
}
