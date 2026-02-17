import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxTableLayoutPicker } from './ngx-table-layout-picker';

describe('NgxTableLayoutPicker', () => {
  let component: NgxTableLayoutPicker;
  let fixture: ComponentFixture<NgxTableLayoutPicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxTableLayoutPicker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxTableLayoutPicker);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
