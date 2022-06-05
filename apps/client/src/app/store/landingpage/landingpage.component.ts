import { Component } from '@angular/core';
import SwiperCore, { EffectFade, Navigation, Pagination, Autoplay, Controller, SwiperOptions } from 'swiper';
SwiperCore.use([EffectFade, Navigation, Pagination, Autoplay, Controller]);

@Component({
  selector: 'shoppingstore-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.scss']
})
export class LandingpageComponent {

  images: Array<{medium: string, large: string}> = []
  screen_lg = '761px';
  screen_md = '760px';
  defaultImage = 'assets/carousel/cover.jpg';

  config: SwiperOptions = {
    slidesPerView: 1,
    autoplay: {
      delay: 1500,
      disableOnInteraction: false,
    },
    speed: 1500,
    loop: true,
    effect: 'fade',
    fadeEffect: { crossFade: true },
    navigation: true,
    pagination: { clickable: true },
  };

  constructor() {
    this.images = [
      {
        medium: 'assets/carousel/cover.jpg',
        large: 'assets/carousel/cover.jpg'
      },
      {
        medium: 'assets/carousel/douche.jpg',
        large: 'assets/carousel/douche.jpg'
      },
      {
        medium: 'assets/carousel/sabbala2.jpg',
        large: 'assets/carousel/sabbala2.jpg'
      },
      {
        medium: 'assets/carousel/lavabo.jpg',
        large: 'assets/carousel/lavabo.jpg'
      },
      {
        medium: 'assets/carousel/bain.jpg',
        large: 'assets/carousel/bain.jpg'
      },
      {
        medium: 'assets/carousel/wc.jpg',
        large: 'assets/carousel/wc.jpg'
      },
    ]
  }
}
