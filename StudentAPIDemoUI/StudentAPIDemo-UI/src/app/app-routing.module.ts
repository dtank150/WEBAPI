import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentsComponent } from './students/students.component';
import { ViewStudentComponent } from './students/view-student/view-student.component';

const routes: Routes = [
  {path:'',component:StudentsComponent},
  {path:'Student',component:StudentsComponent},
  {path:'Student/:id',component:ViewStudentComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }