import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfModalPage } from './pdf-modal.page';

describe('PdfModalPage', () => {
  let component: PdfModalPage;
  let fixture: ComponentFixture<PdfModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
