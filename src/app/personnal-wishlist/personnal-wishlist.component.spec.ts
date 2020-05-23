import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonnalWishlistComponent } from './personnal-wishlist.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('PersonnalWishlistComponent', () => {
  let component: PersonnalWishlistComponent;
  let fixture: ComponentFixture<PersonnalWishlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonnalWishlistComponent ], imports:[RouterTestingModule, HttpClientModule]
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
