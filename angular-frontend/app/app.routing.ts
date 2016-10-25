import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArticleListComponent } from './article-list.component';
import { ArticleDatumsComponent } from './article-datums.component';

const appRoutes: Routes = [
  {
    path: 'articlelist',
    component: ArticleListComponent
  },
  {
    path: '',
    redirectTo: '/articlelist',
    pathMatch: 'full'
  },
  {
    path: 'article-datums/:PMCID',
    component: ArticleDatumsComponent
  },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
