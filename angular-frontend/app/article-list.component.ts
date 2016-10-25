import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';

import { Article } from './article';
import { ArticleService } from './article.service';

@Component({
    moduleId: module.id,
    selector: 'article-list',
    templateUrl: 'article-list.component.html'
})

export class ArticleListComponent implements OnInit {
    articles: Article[];


    constructor(private articleService: ArticleService /*, private router: Router*/) {}

    getArticles(): void {
        this.articleService.getArticles().then(articles => this.articles = articles);
    }
    
    ngOnInit(): void {
        this.getArticles();
        console.log(this.articles);
    }
}
