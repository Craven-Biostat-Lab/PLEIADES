// This component shows the full text for an article, and handles hilighting interactions.

import { Component, Input, OnInit } from '@angular/core';
import {DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';

import { Article } from './article';
import { ArticleService } from './article.service';
import { Datum } from './datum';

@Component({
    moduleId: module.id,
    selector: 'article-text',
    templateUrl: 'article-text.component.html',
    styleUrls: ['article-text.component.css'],
})
export class ArticleTextComponent implements OnInit {

    // Currently selected article
    @Input()
    article: Article;
    
    // Currently selected datum
    @Input()
    datum: Datum;    
    
    constructor(
      private articleService: ArticleService,
      private sanitizer: DomSanitizer,
    ) {}
    
    
    ngOnInit(): void {
        
    }
    
    
    // Return the URL to load in the iframe
    articleUrl(): SafeUrl {
        let url = '';
        
        if (this.article) {
            url  = '/article-text/PMC' + this.article.PMCID + '/PMC' + this.article.PMCID + '.html';
        }
        
        // mark the Url as safe from XSS attacks
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    
    


}
