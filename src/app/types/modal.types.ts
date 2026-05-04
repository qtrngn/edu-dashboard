export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

export type ModalActionVariant = 'primary' | 'secondary' | 'destructive';

export interface ModalHeaderConfig {
  title: string;
  description?: string;
  showCloseButton?: boolean;
}

export interface ModalFooterActionConfig {
  label: string;
  action: string;
  variant?: ModalActionVariant;
  disabled?: boolean;
}

export interface BaseModalConfig {
  size?: ModalSize;
  header: ModalHeaderConfig;
  footerActions?: ModalFooterActionConfig[];
}

