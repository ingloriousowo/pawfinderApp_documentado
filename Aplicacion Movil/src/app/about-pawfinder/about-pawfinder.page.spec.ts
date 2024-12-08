import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AboutPawfinderPage } from './about-pawfinder.page';

describe('AboutPawfinderPage', () => {
  let component: AboutPawfinderPage;
  let fixture: ComponentFixture<AboutPawfinderPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutPawfinderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
