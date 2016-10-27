// This component shows the article text and the list of datums for a single article, and allows the user to select a datum to hilight.

import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';
import { Router } from '@angular/router';

import { Article } from './article';
import { ArticleService } from './article.service';
import { Datum } from './datum';
import { DatumEditService } from './datum-edit.service';

@Component({
    moduleId: module.id,
    selector: 'article-datums',
    templateUrl: 'article-datums.component.html',
    styleUrls: [ 'article-datums.component.css' ],
    providers: [ DatumEditService ],
})
export class ArticleDatumsComponent implements OnInit {

    // Currently selected article
    article: Article;
    
    // Currently selected datum
    selectedDatum: Datum;    
    
    constructor(
      private articleService: ArticleService,
      private route: ActivatedRoute,
      private location: Location,
      private router: Router,
      private datumEditService: DatumEditService,
    ) {}
    
    
    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            let PMCID = params['PMCID'];
            this.articleService.getArticle(PMCID)
                .then(article => this.article = article);
            // TODO: do something if there is an error, like the PMCID doesn't exist
        });
    }
    
    
    selectDatum(datum: any): void {
        // Cast the argument to Datum, we're being a little fast-and-loose with types here.
        this.selectedDatum = datum as Datum;
        
        // Notify the datum edit service (and article-text component) that the user has selected a datum.
        this.datumEditService.selectDatum(this.selectedDatum);
    }
    
    goBack(): void{
        if(confirm('Exit without saving your changes?')) {
            this.router.navigate(['/']);
        }
    }
}
