import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteretsComponent } from './interets.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('InteretsComponent', () => {
  let component: InteretsComponent;
  let fixture: ComponentFixture<InteretsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InteretsComponent ], imports:[HttpClientModule, ReactiveFormsModule, FormsModule, RouterTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteretsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
