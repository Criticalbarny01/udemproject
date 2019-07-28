import {Recipe} from './recipes-list/recipe.model';
import {Injectable} from '@angular/core';
import {Ingredient} from '../shared/ingredient.model';
import {ShoppingListService} from '../shopping-list/shopping-list.service';
import {Subject} from 'rxjs';

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

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

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
