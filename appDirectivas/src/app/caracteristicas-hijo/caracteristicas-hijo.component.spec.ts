import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaracteristicasHijoComponent } from './caracteristicas-hijo.component';

describe('CaracteristicasHijoComponent', () => {
  let component: CaracteristicasHijoComponent;
  let fixture: ComponentFixture<CaracteristicasHijoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaracteristicasHijoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaracteristicasHijoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
