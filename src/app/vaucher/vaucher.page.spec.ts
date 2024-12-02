import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VaucherPage } from './vaucher.page';

describe('VaucherPage', () => {
  let component: VaucherPage;
  let fixture: ComponentFixture<VaucherPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VaucherPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
