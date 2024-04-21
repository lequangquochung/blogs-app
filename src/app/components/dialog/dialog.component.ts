import { BlogService } from './../../services/blog-service/blog.service';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HTTP_CODE } from 'src/app/models/Enum/http.code';
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
    imageDefaultUrl: string = "/assets/img/default.jpg";
    @Output() isChangedEvent = new EventEmitter<boolean>();
    constructor(private blogService: BlogService,
        private fb: FormBuilder) {
        this.blogForm = this.fb.group({
            title: ['', Validators.required],
            image: [''],
            content: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.initForm();
    };

    initForm(): void {
        if (this.blogDetail) {
            this.blogForm.setValue({
                title: this.blogDetail.title,
                image: this.checkDefaultImg(),
                content: this.blogDetail.content
            });
        }
    };

    onSubmit(): void {
        let param: Blog = {
            title: this.blogForm.controls['title'].value,
            content: this.blogForm.controls['content'].value,
            image: this.blogForm.controls['image'].value,
        }

        if (!this.blogDetail) {
            this.blogService.create(param).subscribe({
                next: () => {
                    this.activeModal.close();
                    this.isChangedEvent.emit(true);
                },
                error: () => {
                    this.activeModal.close();
                },
            });
        } else {
            this.blogService.edit(param, this.blogDetail.id!).subscribe({
                next: () => {
                    this.activeModal.close();
                    this.isChangedEvent.emit(true);
                },
                error: () => {
                    this.activeModal.close();
                },
            });
        }
    };

    handleImageError(item: Blog) {
        item.image = this.imageDefaultUrl;
    }

    checkDefaultImg(): string {
        if (this.blogDetail?.image.includes('/assets')) {
            return "";
        }
        return this.blogDetail?.image!;
    }
}
