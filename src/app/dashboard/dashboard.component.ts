import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject, Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { Blog } from '../models/blog/blog.model';
import { BlogService } from '../services/blog-service/blog.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DialogComponent } from '../components/dialog/dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  data: Blog[] = [];
  currentPageData?: Blog[];
  filteredData: any[] = [];
  searchForm!: FormGroup;
  items: any[] = [];
  currentPage = 1;
  pages: number = 0;
  totalPages: number = 0;
  imageDefaultUrl: string = "/assets/img/default.jpg";

  public keySearch = new BehaviorSubject<string>('');
  private modalService = inject(NgbModal);

  constructor(
    private blogService: BlogService,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      page: [1],
      limit: [10],
      sortBy: ['id'],
      order: ['desc'],
      search: [''],
    })
    this.keySearch.pipe(
      debounceTime(500),
      distinctUntilChanged()
    )
      .subscribe(value => {
        this.searchForm.patchValue({ search: value, page: 1 })
        this.currentPage = 1;
        this.getBlogPageCount();
        this.getBlogs();
      });
  }

  ngOnInit(): void {
    this.getTotalPage();
  };

  getBlogPageCount() {
    const request = this.searchForm.getRawValue();
    this.removeEmptyProperties(request)
    this.blogService.getListLabPages(request).subscribe(data => {
      const limit = this.searchForm.get('limit')?.value || 1;
      this.pages = Math.ceil(data.length / limit)
    });
  };

  getTotalPage() {
    this.blogService.getListLabPages().subscribe(data => {
      const limit = this.searchForm.get('limit')?.value || 1;
      this.totalPages = Math.ceil(data.length / limit);
    });
  };

  getBlogs() {
    const request = this.searchForm.getRawValue();
    this.removeEmptyProperties(request)
    this.blogService.getListLabService(request).subscribe(data => {
      this.data = data;
    });
  };

  removeEmptyProperties(obj: any): void {
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && !obj[key]) {
        delete obj[key];
      };
    };
  };

  setPage(pageNumber: number) {
    this.currentPage = pageNumber;
    this.searchForm.patchValue({ page: pageNumber });
    this.getBlogs();
  };

  onSearch(value: string) {
    this.keySearch.next(value);
  };

  onOrder(field: string) {
    this.searchForm.patchValue({ sortBy: field });
    this.setPage(1);
  };

  open(blogDetail?: Blog) {
    const modalRef = this.modalService.open(DialogComponent, { centered: true });
    modalRef.componentInstance.blogDetail = blogDetail;
    modalRef.componentInstance?.isChangedEvent?.subscribe((emmitedValue: any) => {
      if (emmitedValue) {
        this.getTotalPage();
        this.getBlogs();
      };
    });
  };

  handleImageError(item: Blog) {
    item.image = this.imageDefaultUrl;
  }

  get pageLinks() {
    const links = [];
    for (let i = 1; i <= (this.keySearch.getValue() ? this.pages : this.totalPages); i++) {
      links.push(i);
    };
    return links;
  };
}
