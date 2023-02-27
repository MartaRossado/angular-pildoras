import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DirectivangifComponent } from './directivangif/directivangif.component';
import { FormsModule } from '@angular/forms';
import { DirectivangforComponent } from './directivangfor/directivangfor.component';

@NgModule({
  declarations: [
    AppComponent,
    DirectivangifComponent,
    DirectivangforComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
