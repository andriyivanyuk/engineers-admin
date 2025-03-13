export interface MenuItem {
  icon: string;
  label: string;
  children?: MenuItem[];
  isOpen?: boolean;
  route?: string;
}
