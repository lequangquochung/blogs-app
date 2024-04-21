import { Component, OnInit, inject } from '@angular/core';

import { BehaviorSubject, Observable, Subject, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { Blog } from '../models/blog/blog.model';
import { BlogService } from '../services/blog-service/blog.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SearchRequest } from '../models/response/response.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogComponent } from '../components/dialog/dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  title = "hello";
  data: Blog[] = [];
  currentPageData?: Blog[];
  filteredData: any[] = [];
  searchForm!: FormGroup;
  items: any[] = []; // Your paginated items array
  currentPage = 1; // Current page number
  pages: number = 0; // Array to store page numbers
  totalPages: number = 0; // Array to store page numbers

  public keySearch = new BehaviorSubject<string>('');
  private txtQueryChanged = new Subject<string>();
  private modalService = inject(NgbModal);

  constructor(
    private blogService: BlogService,
    private fb: FormBuilder
  ) {
    this.searchForm = fb.group({
      page: [1],
      limit: [10],
      sortBy: ['id'],
      order: ['asc'],
      search: [''],
    })
    this.keySearch.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    )
      .subscribe(value => {
        this.searchForm.patchValue({ search: value, page: 1 })
        this.currentPage = 1;
        this.getBlogPageCount();
        this.getBlogs()
      });
  }

  ngOnInit(): void {
    this.getTotalPage();
  }

  getBlogPageCount() {
    const request = this.searchForm.getRawValue();
    this.removeEmptyProperties(request)
    this.blogService.getListLabPages(request).subscribe(data => {
      const limit = this.searchForm.get('limit')?.value || 1;
      this.pages = Math.ceil(data.length / limit)
    })
  }

  getTotalPage() {
    this.blogService.getListLabPages().subscribe(data => {
      const limit = this.searchForm.get('limit')?.value || 1;
      this.totalPages = Math.ceil(data.length / limit)
    })
  }

  getBlogs() {
    const request = this.searchForm.getRawValue();
    this.removeEmptyProperties(request)
    this.blogService.getListLabService(request).subscribe(data => {
      this.data = data;
    })
  }

  removeEmptyProperties(obj: any): void {
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && !obj[key]) {
        delete obj[key];
      }
    }
  }


  get pageLinks() {
    const links = [];
    for (let i = 1; i <= (this.keySearch.getValue() ? this.pages : this.totalPages); i++) {
      links.push(i)
    }
    return links
  }

  setPage(pageNumber: number) {
    this.currentPage = pageNumber;
    this.searchForm.patchValue({ page: pageNumber })
    this.getBlogs();
  }

  onSearch(value: string) {
    this.keySearch.next(value);
  }

  onOrder(direction: boolean) {
    this.searchForm.patchValue({ order: direction ? 'asc' : 'desc' })
    this.setPage(1);
  }

  open(blogDetail?: Blog) {
    const modalRef = this.modalService.open(DialogComponent);
    modalRef.componentInstance.blogDetail = 'World';
    modalRef.componentInstance.blogDetail = blogDetail;
    console.log('blogDetail', blogDetail);
    
  }

}
