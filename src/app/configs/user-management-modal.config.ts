import type { BaseModalConfig, ModalFooterActionConfig } from '@app/types/modal.types';
import type { UserManagementDisplayConfig, } from '@app/types/user-management.types';

function buildUserManagementModalConfig(params: {
  title: string;
  description: string;
  footerActions: ModalFooterActionConfig[];
  size?: BaseModalConfig['size'];
}): BaseModalConfig {
  return {
    size: params.size ?? 'md',
    header: {
      title: params.title,
      description: params.description,
      showCloseButton: true,
    },
    footerActions: params.footerActions,
  }
}


// Create user modal
export function getCreateUserModalConfig(
  displayConfig: UserManagementDisplayConfig,
): BaseModalConfig {
  return buildUserManagementModalConfig({
    title: displayConfig.addTitle,
    description: `Create a new ${displayConfig.label.toLowerCase()}.`,
    footerActions: [
      {
        label: 'Cancel',
        action: 'cancel',
        variant: 'secondary',
      },
      {
        label: `Create ${displayConfig.label}`,
        action: 'submit',
        variant: 'primary',
      },
    ],
  });
}

// User detail modal
export function getUserDetailModalConfig(
  displayConfig: UserManagementDisplayConfig,
  isEditing: boolean,
): BaseModalConfig {
  return buildUserManagementModalConfig({
    title: displayConfig.detailTitle,
    description: isEditing
      ? `Edit this ${displayConfig.label.toLowerCase()}.`
      : `View this ${displayConfig.label.toLowerCase()}'s details.`,
    footerActions: isEditing
      ? [
          {
            label: 'Cancel',
            action: 'cancel-edit',
            variant: 'secondary',
          },
          {
            label: 'Save',
            action: 'save',
            variant: 'primary',
          },
        ]
      : [
          {
            label: 'Delete',
            action: 'delete',
            variant: 'destructive',
          },
          {
            label: 'Edit',
            action: 'edit',
            variant: 'primary',
          },
        ],
  });
}