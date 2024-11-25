import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { IvinService } from 'src/app/ivin.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent {
  @Input() index: number = 1;
  // @Input() totalCount: number = 50;
  // @Input() pageSize: number = 5;
  // @Input() rulerLength: number = 5;

  @Output() page: EventEmitter<number> = new EventEmitter<number>();
  usertypeid: any;
  data: any;
  ids: any[] = [];
  totalCount: any;
  username: any;
  extractedName: any;
  urlsegment: any;
  rulerLength : any;

  constructor(private ivinservice: IvinService, private router: Router,private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.username = sessionStorage.getItem('userprofileusername');
    // Log the current URL to the console
    console.log("current url",this.router.url);
      // Extract the last part of the URL (e.g., "ashok")
    const urlSegments = this.router.url.split('/');
    this.urlsegment = urlSegments;
    console.log('urlSegments',urlSegments);
    this.extractedName = urlSegments[urlSegments.length - 1];
    console.log("Extracted Name:", this.extractedName);
    this.Getbyname();
    // this.usertypeid = sessionStorage.getItem("loginid");

    // // Only call Gettabledata() if usertypeid exists
    // if (this.usertypeid) {
    //   this.Gettabledata();
    // } else {
    //   console.log("Usertypeid is missing, Gettabledata() will not run.");
    // }

    // Retrieve and set the current page index from sessionStorage
    const savedIndex = sessionStorage.getItem('currentPageIndex');
    if (savedIndex) {
      this.index = +savedIndex;
    }

    // Ensure default page id logs when the data is ready
    this.page.subscribe((pageIndex) => {
      if (pageIndex === 1 && this.ids && this.ids.length > 0) {
        console.log('Initial page id:', this.ids[0]); // Logs the first id by default
      }
    });
  }


  Getbyname() {
    this.ivinservice.getbyname(this.extractedName).subscribe((data: any) => {
      if (data['Status'] === 200) {
        console.log('name by id', data);
        this.usertypeid = data.Result[0].UserId;
  
        // Now that usertypeid is set, call Gettabledata()
        if (this.usertypeid) {
          this.Gettabledata();
        } else {
          console.log("Usertypeid is missing, Gettabledata() will not run.");
        }
      }
    }, error => {
      console.error('Error fetching by name:', error);
    });
  }

  get maxPages(): number {
    return Math.ceil(this.totalCount);
  }


  get pagination(): { index: number; maxPages: number; pages: number[] } {
    const { index, maxPages } = this;
    // Set a maximum number of visible page numbers (rulerLength), but don't exceed the total number of pages.
    const rulerLength = Math.min(5, maxPages); // Adjust '5' as needed for your preferred length
    const pages = this.ruler(index, maxPages, rulerLength);
    return { index, maxPages, pages };
  }
  



  

navigateToPage(pageNumber: number): void {
  if (this.allowNavigation(pageNumber, this.index, this.maxPages)) {
    this.index = pageNumber;
    this.page.emit(this.index);
    console.log('maxPages:', this.maxPages);

    // Calculate the id of the current page
    // const idIndex = (pageNumber - 1)  % this.ids.length;
    const idIndex = (pageNumber - 1)

    if (this.ids[idIndex]) {
      const currentId = this.ids[idIndex];
      
      // Log the page number and corresponding ID
      console.log(`Page Number: ${pageNumber}, Current Page ID: ${currentId}`);

      // Store the current page ID and index in session storage
      sessionStorage.setItem('currentId', currentId);
      sessionStorage.setItem('currentPageIndex', pageNumber.toString());
    } else {
      console.error('No data for page:', pageNumber);
    }

    // Navigate to the PublicCharts component
    this.navigateToPublicCharts();
  }
}

  
navigateToPublicCharts(): void {
  const lowercaseUsername = this.username ? this.username.toLowerCase() : '' || this.extractedName;
  const myloginId = localStorage.getItem('currentId');

  if (lowercaseUsername) {
    const dynamicUrl = `/publiccharts/${lowercaseUsername}`;
    console.log('dynamicUrl',dynamicUrl);
    // If already on the PublicCharts route with the same parameters, force a reload
    if (this.router.url === dynamicUrl) {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([dynamicUrl]);
      });
    } else {
      // If not on the PublicCharts route, navigate to it with dynamic parameters
      this.router.navigate([dynamicUrl]);
    }
  } else {
    console.error('Invalid loginId or username');
  }
}

  

  trackByFn(index: number): number {
    return index;
  }

  private ruler(currentIndex: number, maxPages: number, rulerLength: number): number[] {
    const array = new Array(rulerLength).fill(null);
    const min = Math.floor(rulerLength / 2);

    return array.map((_, index) =>
      this.rulerFactory(currentIndex, index, min, maxPages, rulerLength)
    );
  }

  private rulerOption(currentIndex: number, min: number, maxPages: number): 'Start' | 'End' | 'Default' {
    return currentIndex <= min
      ? 'Start'
      : currentIndex >= maxPages - min
      ? 'End'
      : 'Default';
  }

  private rulerFactory(
    currentIndex: number,
    index: number,
    min: number,
    maxPages: number,
    rulerLength: number
  ): number {
    const factory = {
      Start: () => index + 1,
      End: () => maxPages - rulerLength + index + 1,
      Default: () => currentIndex + index - min,
    };

    return factory[this.rulerOption(currentIndex, min, maxPages)]();
  }

  private allowNavigation(pageNumber: number, index: number, maxPages: number): boolean {
    const allowed = pageNumber !== index && pageNumber > 0 && pageNumber <= maxPages;
    console.log(`Allow navigation to page ${pageNumber}: ${allowed}`);
    return allowed;
  }

  Gettabledata() {
    const data = {
      UserId :  this.usertypeid,
      Status_Tag : 'Public',
    }
    console.log('!!',data);
    this.ivinservice.probitegetall(data).subscribe(
      (data: any) => {
        if (data && data.Result) {
          this.data = data.Result.sort((a: any, b: any) => new Date(b.CreatedOn).getTime() - new Date(a.CreatedOn).getTime());
          this.ids = this.data.map((item: any) => item.id);
          this.totalCount = this.ids.length;
           console.log('Total Count:', this.totalCount);
           this.rulerLength = this.totalCount;
          console.log("Pagination ids", this.ids);
          this.cdr.detectChanges();
          if (this.ids.length > 0) {
            const initialId = this.ids[0];
            console.log('Initial page id:', initialId);
            sessionStorage.setItem('currentId', initialId);
            // Check if currentId is already set to avoid repeated reloads
          if (!sessionStorage.getItem('pageReloaded')) {
            sessionStorage.setItem('pageReloaded', 'true');
            window.location.reload(); // Reload the page once
          }
          }
        }
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }
}