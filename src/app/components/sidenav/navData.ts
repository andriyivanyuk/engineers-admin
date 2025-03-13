import { MenuItem } from "./menuItem";

export const menuItems: MenuItem[] = [
  {
    icon: 'dashboard',
    label: 'Dashboard',
    route: 'dashboard',
  },
  {
    icon: 'sell',
    label: 'Manage products',
    isOpen: false,
    children: [
      {
        icon: 'list',
        label: 'Product List',
        route: 'product-list',
      },
      {
        icon: 'add_circle',
        label: 'Create product',
        route: 'create-product',
      },
    ],
  },
  {
    icon: 'category',
    label: 'Manage categories',
    isOpen: false,
    children: [
      {
        icon: 'list',
        label: 'Category list',
        route: '',
      },
      {
        icon: 'add_circle',
        label: 'Add category',
        route: 'create-product',
      },
    ],
  },
];
