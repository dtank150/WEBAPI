import { Component, OnInit, ViewChild } from '@angular/core';
import { StudentService } from '../student.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from 'src/app/models/UI-Models/student.model';
import { GenderService } from 'src/app/services/gender.service';
import { Gender } from 'src/app/models/UI-Models/gender.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-view-student',
  templateUrl: './view-student.component.html',
  styleUrls: ['./view-student.component.css']
})
export class ViewStudentComponent implements OnInit{
  studentId : string | null | undefined;
  student: Student = {
    id: '',
    firstName:'',
    lastName:'',
    dateOfBirth:'',
    email:'',
    mobile: 0,
    genderId:'',
    profileImageUrl:'',
    gender:{
      id:'',
      description:''
    },
    address:{
      id:'',
      physicalAddress:'',
      postalAddress:''
    }
  }
  isNewStudent = false;
  header = '';
  displayProfileImageUrl = '';
  genderList:Gender[] = [];

  @ViewChild('studentDetailsForm') studentDetailsForm?: NgForm;

  constructor(private readonly studentService:StudentService,
    private readonly route : ActivatedRoute, private readonly genderServic:GenderService, private snackbar:MatSnackBar, private router:Router){}


  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.studentId = params.get('id');

      if(this.studentId){
        // If the route contais the 'Add'
        if(this.studentId.toLocaleLowerCase() === 'Add'.toLocaleLowerCase()){
        // -> new Student Functionality
        this.isNewStudent = true;
        this.header = 'Add New Student';
        this.setImage();
       }
        //Otherwise 
        else{
          // -> Existing Student Functionality
          this.isNewStudent = false;
          this.header = 'Edit Student';
          this.studentService.getStudent(this.studentId)
          .subscribe(
            (successResponse) => {
              this.student =successResponse;
              this.setImage();
            },
            (errorResponse)=>{
              this.setImage();              
            }
          );
        }
        this.genderServic.getGenderList()
        .subscribe(
          (sucessResponse) => {
            this.genderList = sucessResponse;
          });
      }

    });
  }

  onUpdate():void{
    if(this.studentDetailsForm?.form.valid){
      this.studentService.updateStudent(this.student.id, this.student)
    .subscribe(
      (sucessResponse) =>{
        // Show a notification
        this.snackbar.open('Student Updated Successfully!!,', undefined,{
          duration: 2000
        });

        setTimeout(() =>{
          this.router.navigateByUrl('Student');
        }, 2000);
      },
      (errorResponse) => {
        // Log it
        console.log(errorResponse);
      }
    );
    }
    
  }
  onDelete():void{
    //Student service to delete
    this.studentService.deleteStudent(this.student.id)
    .subscribe(
      (sucessResponse) => {
        this.snackbar.open('Student Deleted Successfully!!', undefined,{
          duration: 2000
        });

        setTimeout(() =>{
          this.router.navigateByUrl('Student');
        }, 2000);      
      },
      (errorResponse)=>{
        //Log it
        console.log(errorResponse);
      }

    );
  }
  onAdd() : void{

    if(this.studentDetailsForm?.form.valid){
      //Submit form date to api

      this.studentService.addStudent(this.student)
    .subscribe(
      (successResponse) =>{
        this.snackbar.open('Student Added Successfully!!', undefined,{
          duration: 2000
        });
        setTimeout(() =>{
          this.router.navigateByUrl(`Student/${successResponse.id}`);
        }, 2000);
      },
      (errorResponse)=>{
        //Log it
        console.log(errorResponse);

      }
    );
    }    
  }
  uploadImage(event:any):void{
    if(this.studentId){
      const file = event.target.files[0];
      this.studentService.uploadImage(this.student.id, file)
      .subscribe(
        (successResponse) =>{
          this.student.profileImageUrl = successResponse;
          this.setImage();

          // Show a notification
        this.snackbar.open('Profile Image Updated!!', undefined,{
          duration: 2000
        });

        },
        (errorResponse)=>{

        }
      );

    }
  }
  private setImage():void{
    if(this.student.profileImageUrl){
      //Fetch the image by url
      this.displayProfileImageUrl = this.studentService.getImagePAth(this.student.profileImageUrl);
    }
    else{
      //Display a Default
      this.displayProfileImageUrl = '/assets/user.png';
    }
  }


}
