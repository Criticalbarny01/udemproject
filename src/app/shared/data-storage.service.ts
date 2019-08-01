import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {RecipeService} from '../recipes/recipe.service';
import {Recipe} from '../recipes/recipes-list/recipe.model';
import {exhaustMap, map, take, tap} from 'rxjs/operators';
import {AuthService} from '../auth/auth.service';
import {User} from '../auth/user.model';

@Injectable({providedIn: 'root'})
export class DataStorageService {

  constructor(private http: HttpClient, private recipesService: RecipeService, private authService: AuthService) {
  }

  storeRecipe() {
    const recipes = this.recipesService.getRecipes();
    this.http.put('https://udemy-project-angular.firebaseio.com/recipes.json', recipes).subscribe(
      (response => {
        console.log(response);
      })
    );
  }

  fetchRecipes() {
        return this.http.get<Recipe[]>(
          'https://udemy-project-angular.firebaseio.com/recipes.json'
        ).pipe(
      map(recipes => {
        return recipes.map(recipe => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : []
          };
        });
      }),
      tap(recipes => {
        this.recipesService.setRecipes(recipes);
      })
    );
  }

}
