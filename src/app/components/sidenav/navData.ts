import { MenuItem } from './menuItem';

export const menuItems: MenuItem[] = [
  {
    icon: 'admin_panel_settings',
    label: 'Управління доступом',
    isOpen: true,
    children: [
      {
        icon: 'code',
        label: 'Генерувати код',
        route: 'create-code',
      },
      {
        icon: 'list',
        label: 'Список кодів',
        route: 'code-list',
      },
    ],
  },
  {
    icon: 'dashboard',
    label: 'Головна',
    route: 'dashboard',
  },
  {
    icon: 'sell',
    label: 'Управління продуктами',
    isOpen: false,
    children: [
      {
        icon: 'list',
        label: 'Список продуктів',
        route: 'product-list',
      },
      {
        icon: 'add_circle',
        label: 'Створити',
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
