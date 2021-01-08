import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PathSearchComponent } from './path-search.component';

describe('PathSearchComponent', () => {
  let component: PathSearchComponent;
  let fixture: ComponentFixture<PathSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PathSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PathSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
