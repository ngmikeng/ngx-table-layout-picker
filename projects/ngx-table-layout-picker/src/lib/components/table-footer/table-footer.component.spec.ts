import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableFooterComponent } from './table-footer.component';

describe('TableFooterComponent', () => {
  let component: TableFooterComponent;
  let fixture: ComponentFixture<TableFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableFooterComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TableFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display selection text', () => {
    component.selectionText = '5 × 7';
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('5 × 7');
  });

  it('should display default text when no selection', () => {
    component.selectionText = '';
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.textContent).toContain('0 × 0');
  });

  it('should apply visible class when visible is true', () => {
    component.visible = true;
    fixture.detectChanges();
    const footerElement = fixture.nativeElement.querySelector('.tls-footer');
    expect(footerElement?.classList.contains('visible')).toBe(true);
  });
});
