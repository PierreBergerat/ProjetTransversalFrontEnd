import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnalWishlistComponent } from './personnal-wishlist.component';

describe('PersonnalWishlistComponent', () => {
  let component: PersonnalWishlistComponent;
  let fixture: ComponentFixture<PersonnalWishlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonnalWishlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonnalWishlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    
  });
});
