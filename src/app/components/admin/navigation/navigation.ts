import {Injectable} from '@angular/core';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  function?: any;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: Navigation[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}

const NavigationItems = [
  {
    id: 'profile',
    title: 'Profile',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'my-profile',
        title: 'My Profile',
        type: 'item',
        icon: 'feather icon-user',
        url: '/profile',
        classes: 'nav-item',
        target: false,
        breadcrumbs: false
      },
      {
        id: 'my-favourites',
        title: 'Favourite Companies',
        type: 'item',
        icon: 'feather icon-heart',
        url: '/favourites',
        classes: 'nav-item',
        target: false,
        breadcrumbs: false
      },
      {
        id: 'news-search',
        title: 'News Feed',
        type: 'item',
        icon: 'fa fa-newspaper',
        url: '/news-search',
        classes: 'nav-item',
        target: false,
        breadcrumbs: false
      }

    ]
  },
  {
    id: 'search',
    title: 'Search',
    type: 'group',
    icon: 'icon-navigation',
      children: [
      {
        id: 'quick-search',
        title: 'Quick Search',
        type: 'item',
        icon: 'feather icon-search',
        url: '/quick-search',
        classes: 'nav-item',
        target: false,
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'advanced-search',
    title: 'Advanced Search',
    type: 'group',
    icon: 'icon-search',
    children: [
      {
        id: 'company-search',
        title: 'Company',
        type: 'item',
        icon: 'fa fa-building',
        url: '/company-search',
        classes: 'nav-item',
        target: false,
        breadcrumbs: false
      },
      {
        id: 'people-search',
        title: 'People',
        type: 'item',
        icon: 'feather icon-users',
        url: '/people-search',
        classes: 'nav-item',
        target: false,
        breadcrumbs: false
      },
      {
        id: 'investment-search',
        title: 'Investor',
        type: 'item',
        icon: 'feather icon-briefcase',
        url: '/investment-search',
        classes: 'nav-item',
        target: false,
        breadcrumbs: false
      },
      {
        id: 'funding-search',
        title: 'Funding',
        type: 'item',
        icon: 'fas fa-hand-holding-usd',
        url: '/funding-search',
        classes: 'nav-item',
        target: false,
        breadcrumbs: false
      },
      {
        id: 'aquisitions-search',
        title: 'Acquisitions',
        type: 'item',
        icon: 'fa fa-code-branch',
        url: '/acquisitions-search',
        classes: 'nav-item',
        target: false,
        breadcrumbs: false
      },

    ]
  },
  {
    id: 'myaccount',
    title: 'My account',
    type: 'group',
    icon: 'icon-person',
    children: [
      {
        id: 'downloads',
        title: 'Downloads',
        type: 'item',
        icon: 'fa fa-download',
        url: '/downloads',
        classes: 'nav-item',
        target: false,
        breadcrumbs: false
      },
      {
        id: 'exclusions',
        title: 'Exclusions',
        type: 'item',
        icon: 'fa fa-file',
        url: '/exclusions',
        classes: 'nav-item',
        target: false,
        breadcrumbs: false
      },
    ]
  }
];

@Injectable()
export class NavigationItem {
  get() {
    return NavigationItems;
  }
}
