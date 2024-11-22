import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookListComponent } from './book-list.component';
import { HttpClientModule } from '@angular/common/http';


describe('BookListComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookListComponent],
      imports: [HttpClientModule], // Add this line
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(BookListComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
