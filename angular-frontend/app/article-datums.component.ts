// This component shows the article text and the list of datums for a single article, and allows the user to select a datum to hilight.

import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';

import { Article } from './article';
import { ArticleService } from './article.service';
import { Datum } from './datum';

@Component({
    moduleId: module.id,
    selector: 'article-datums',
    templateUrl: 'article-datums.component.html',
    styleUrls: [ 'article-datums.component.css' ],
})
export class ArticleDatumsComponent implements OnInit {

    // Currently selected article
    article: Article;
    
    // Currently selected datum
    selectedDatum: Datum;    
    
    constructor(
      private articleService: ArticleService,
      private route: ActivatedRoute,
      private location: Location
    ) {}
    
    
    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            let PMCID = params['PMCID'];
            this.articleService.getArticle(PMCID)
                .then(article => this.article = article);
            // TODO: do something if there is an error, like the PMCID doesn't exist
        });
    }
    

}
