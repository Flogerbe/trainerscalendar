import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule, Routes } from '@angular/router'

import { AppComponent } from './app.component';
import { NewEventComponent } from './new-event/new-event.component';
import { TraineeListComponent } from './trainee-list/trainee-list.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { EventListComponent } from './event-list/event-list.component';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './api.service';
import { LoginComponent } from './login/login.component'
import { FormsModule } from '@angular/forms';
import { GroupListComponent } from './group-list/group-list.component';
import { EventComponent } from './event/event.component';


const appRoutes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: 'home', redirectTo: '/', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'groups', component: GroupListComponent },
  { path: 'events', component: EventListComponent },
  { path: 'events/:id', component: EventComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    NewEventComponent,
    TraineeListComponent,
    FooterComponent,
    HeaderComponent,
    EventListComponent,
    LoginComponent,
    GroupListComponent,
    EventComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule.forRoot(),
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    FormsModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
