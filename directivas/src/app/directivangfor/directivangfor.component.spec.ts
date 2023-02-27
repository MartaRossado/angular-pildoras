import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectivangforComponent } from './directivangfor.component';

describe('DirectivangforComponent', () => {
  let component: DirectivangforComponent;
  let fixture: ComponentFixture<DirectivangforComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectivangforComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectivangforComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
