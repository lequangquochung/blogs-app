import { BlogService } from './../../services/blog-service/blog.service';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Blog } from 'src/app/models/blog/blog.model';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['dialog.component.scss'],

})
export class DialogComponent implements OnInit {

  activeModal = inject(NgbActiveModal);
  blogForm!: FormGroup;

  @Input() name?: string;
  @Input() blogDetail?: Blog;
  constructor(private blogService: BlogService,
    private fb: FormBuilder) {
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      image: [''],
      content: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    console.log(this.blogDetail)
  }

  initForm(): void {

  }

  editBlog(): void {

  }

  onSubmit(): void {
    console.log(this.blogForm?.value);
  }
}
