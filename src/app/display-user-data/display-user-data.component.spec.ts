import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayUserDataComponent } from './display-user-data.component';
import { RouterTestingModule } from '@angular/router/testing';
import { empty } from 'rxjs';

describe('DisplayUserDataComponent', () => {
  let component: DisplayUserDataComponent;
  let fixture: ComponentFixture<DisplayUserDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayUserDataComponent], imports: [RouterTestingModule, HttpClientModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayUserDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('j should be undefined',()=>{
    expect(component.j).not.toBeUndefined();
  })
  it('m should be undefined',()=>{
    expect(component.m).not.toBeUndefined();
  })
  it('k should be undefined',()=>{
    expect(component.k).not.toBeUndefined();
  })
  it('p should be undefined',()=>{
    expect(component.p).not.toBeUndefined();
  })
});
