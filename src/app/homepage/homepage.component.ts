import { Component } from '@angular/core';
import {HeroSectionComponent} from "../components/hero-section/hero-section/hero-section.component";

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    HeroSectionComponent
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {

}
