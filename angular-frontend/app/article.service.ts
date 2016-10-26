// This file handles communication with the back-end to retrieve articles


import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Article } from './article';



@Injectable()
export class ArticleService {

    // URL to the resource on the back-end that responds with a list of articles
    private articleUrl = 'articles';

    constructor(private http: Http) {}

    // Return a list of articles from the back-end
    getArticles(): Promise<Article[]> {
        return this.http.get(this.articleUrl)
            .toPromise()
            .then(response => response.json().articles as Article[])
            .catch(this.handleError);
    }
    
    
    // Return a single article, including datums
    getArticle(PMCID: string): Promise<Article> {
        return this.http.get(this.articleUrl + '/' + PMCID)
            .toPromise()
            .then(response => response.json().article as Article)
            .catch(this.handleError);
    }
    
        
    private handleError(error: any): Promise<any> {
      console.error('An error occurred', error);
      return Promise.reject(error.message || error);
    }

}
