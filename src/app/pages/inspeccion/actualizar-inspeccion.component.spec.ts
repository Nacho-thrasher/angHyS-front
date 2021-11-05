import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarInspeccionComponent } from './actualizar-inspeccion.component';

describe('ActualizarInspeccionComponent', () => {
  let component: ActualizarInspeccionComponent;
  let fixture: ComponentFixture<ActualizarInspeccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActualizarInspeccionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActualizarInspeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
