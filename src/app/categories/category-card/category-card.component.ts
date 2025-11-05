import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../shared/services/category.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-category-card',
  standalone: false,
  templateUrl: './category-card.component.html',
  styleUrls: ['./category-card.component.scss'],
})
export class CategoryCardComponent implements OnInit {
  categories: any[] = [];
  allCategories: any[] = [];
  searchName: string = '';
  selectedCategory: any | null = null;
  playerName: string | null = null;

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((data: any) => {
      this.categories = data;
      this.allCategories = data;
    });
    this.route.paramMap.subscribe((params) => {
      const name = params.get('playerName');
      this.playerName = name;
    });
  }

  goToCategoryQuiz(category: any) {
    this.router.navigate(['/quiz', category.id], {
      state: { categoryName: category.name, playerName: this.playerName },
    });
  }

  filterCategory() {
    const search = this.searchName.trim().toLowerCase();
    if (!search) return;
    this.categories = this.allCategories.filter((cat) =>
      cat.name.toLowerCase().includes(search)
    );
  }

  clearFilter() {
    this.searchName = '';
    this.selectedCategory = null;
    this.categories = [...this.allCategories];
  }
}
