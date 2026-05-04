import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { BaseModalConfig, ModalActionVariant, ModalSize } from '@app/types/modal.types';

@Component({
  selector: 'app-modal-base',
  imports: [],
  templateUrl: './modal-base.html',
})
export class ModalBase {
  @Input({ required: true }) config!: BaseModalConfig;

  @Output() closeClicked = new EventEmitter<void>();
  @Output() actionClicked = new EventEmitter<string>();

  private readonly sizeClassMap: Record<ModalSize, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  get modalSizeClass(): string {
    return this.sizeClassMap[this.config.size ?? 'md'];
  }

  get showCloseButton(): boolean {
    return this.config.header.showCloseButton !== false;
  }

  onCloseClick(): void {
    this.closeClicked.emit();
  }

  onActionClick(action: string): void {
    this.actionClicked.emit(action);
  }

  getActionButtonClass(variant: ModalActionVariant = 'secondary'): string {
    const classMap: Record<ModalActionVariant, string> = {
      primary: 'border border-white/10 bg-slate-700 text-white hover:bg-slate-600',
      secondary: 'border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10',
      destructive: 'border border-red-400/20 bg-red-500/10 text-red-200 hover:bg-red-500/20',
    };

    return classMap[variant];
  }
}
