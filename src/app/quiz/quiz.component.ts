import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../shared/services/quiz.service';
import { CategoryService } from '../shared/services/category.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
  standalone: false,
})
export class QuizComponent implements OnInit {
  isQuizFinished = this.quizService.isQuizFinished;
  categoryId: number | null = null;
  @Input() categoryName: string | null = null;

  constructor(
    private quizService: QuizService,
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('categoryId');
      this.categoryId = id ? +id : null;

      if (!this.categoryName && this.categoryId !== null) {
        const navState = this.router.getCurrentNavigation()?.extras?.state as
          | { categoryName?: string }
          | undefined;
        if (navState?.categoryName) {
          this.categoryName = navState.categoryName;
          if ((navState as any).playerName) {
            this.quizService.playerName = (navState as any).playerName;
          }
          return;
        }

        const historyState =
          (window &&
            (window as any).history &&
            (window as any).history.state) ||
          {};
        if (historyState?.categoryName) {
          this.categoryName = historyState.categoryName;
          if (historyState?.playerName) {
            this.quizService.playerName = historyState.playerName;
          }
          return;
        }
        this.categoryService.getCategory(this.categoryId).subscribe((cat) => {
          if (cat && cat.name) this.categoryName = cat.name;
        });
      }
    });
  }

  goToResultPage() {
    this.router.navigate(['/result']);
  }
}
