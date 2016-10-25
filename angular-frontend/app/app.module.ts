import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }    from '@angular/http';


import { ArticleService } from './article.service';
import { AppComponent }  from './app.component';
import { ArticleListComponent } from './article-list.component';
import { ArticleDatumsComponent } from './article-datums.component';


import { routing } from './app.routing';

@NgModule({
  imports: [ 
    BrowserModule,
    HttpModule, 
    routing,
  ],
  
  declarations: [ 
    AppComponent,
    ArticleListComponent,
    ArticleDatumsComponent,
  ],
  
  providers: [ ArticleService ],
  
  bootstrap: [ AppComponent ]
})
export class AppModule { }
