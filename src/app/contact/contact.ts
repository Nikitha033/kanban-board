import { Component } from '@angular/core';
import { NavbarComponent } from '../components/navbar/navbar';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './contact.html',
  styleUrls: ['./contact.css']
})

export class ContactComponent {

  activeIndex: number | null = null;

  toggleFAQ(index: number) {

    if (this.activeIndex === index) {
      this.activeIndex = null;
    } else {
      this.activeIndex = index;
    }

  }

}


