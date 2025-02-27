import { Injectable, inject } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ToastComponent } from '../../shared/components/toast/toast.component';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private overlay = inject(Overlay);

  showToast(message: string, type: 'success' | 'error') {
    const overlayRef: OverlayRef = this.overlay.create({
      positionStrategy: this.overlay.position().global().top('20px').right('20px'),
      hasBackdrop: false,
      panelClass: 'toast-container',
    });

    const toastPortal = new ComponentPortal(ToastComponent);
    const toastRef = overlayRef.attach(toastPortal);
    toastRef.instance.message = message;
    toastRef.instance.type = type;

    setTimeout(() => overlayRef.dispose(), 3000);
  }
}
