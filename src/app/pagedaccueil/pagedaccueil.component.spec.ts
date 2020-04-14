import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagedaccueilComponent } from './pagedaccueil.component';

describe('PagedaccueilComponent', () => {
  let component: PagedaccueilComponent;
  let fixture: ComponentFixture<PagedaccueilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagedaccueilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagedaccueilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
