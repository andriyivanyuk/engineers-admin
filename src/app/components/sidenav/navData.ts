import { MenuItem } from './menuItem';

export const menuItems: MenuItem[] = [
  {
    icon: 'admin_panel_settings',
    label: 'Доступ',
    isOpen: true,
    children: [
      {
        icon: 'code',
        label: 'Генерувати код',
        route: 'create-code',
      },
      {
        icon: 'format_list_bulleted',
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
    label: 'Продукти',
    isOpen: false,
    children: [
      {
        icon: 'format_list_bulleted',
        label: 'Список продуктів',
        route: 'product-list',
      },
      {
        icon: 'add_circle',
        label: 'Створити продукт',
        route: 'create-product',
      },
    ],
  },
  {
    icon: 'category',
    label: 'Категорії',
    isOpen: false,
    children: [
      {
        icon: 'format_list_bulleted',
        label: 'Список категорій',
        route: 'category-list',
      },
      {
        icon: 'add_circle',
        label: 'Створити категорію',
        route: 'create-category',
      },
    ],
  },
];
