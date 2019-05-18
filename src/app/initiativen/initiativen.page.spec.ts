import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiativenPage } from './initiativen.page';

describe('InitiativenPage', () => {
  let component: InitiativenPage;
  let fixture: ComponentFixture<InitiativenPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitiativenPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitiativenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
