import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EndexComponent } from './endex.component';

describe('EndexComponent', () => {
  let component: EndexComponent;
  let fixture: ComponentFixture<EndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
