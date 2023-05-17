import { Component, OnInit, ViewChild } from '@angular/core';
import { StudentService } from './student.service';
import { Student } from '../models/UI-Models/student.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  students : Student[] = [];
  displayedColumns: string[] = ['firstName', 'lastName', 'dateOfBirth', 'email','mobile','gender','edit'];
  dataSource: MatTableDataSource<Student> = new MatTableDataSource<Student>();
  @ViewChild(MatPaginator) matPaginator!: MatPaginator;
  @ViewChild(MatSort) matSort!: MatSort;
  filterString = '';

  constructor(private studentServic: StudentService){}
  ngOnInit(): void {
   //Fetch Students
   this.studentServic.getStudents()
   .subscribe(
    (sucessResponse) => {
      this.students = sucessResponse;
      this.dataSource = new MatTableDataSource<Student>(this.students);

      if(this.matPaginator){
        this.dataSource.paginator = this.matPaginator;
      }

      if(this.matSort){
        this.dataSource.sort = this.matSort;
      }
   },
   (errorResponse) => {
    console.log(errorResponse);
   }
   );
   
  }

  filterStudents(){
    this.dataSource.filter = this.filterString.trim().toLowerCase();
  }

}
