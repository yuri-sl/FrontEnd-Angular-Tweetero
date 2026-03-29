import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TemplateRoutingModule } from './template-routing-module';
import { Layout } from './layout/layout';

@NgModule({
  imports: [
    CommonModule,
    TemplateRoutingModule,
    Layout,
  ],
})
export class TemplateModule {}
