/// <reference types="vite/client" />

// lodash-es.d.ts
declare module 'lodash-es' {
  export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait?: number,
    options?: { leading?: boolean; maxWait?: number; trailing?: boolean }
  ): T;
}

// react-modal.d.ts
declare module 'react-modal' {
  import * as React from 'react';

  interface Props {
    isOpen: boolean;
    onAfterOpen?: () => void;
    onRequestClose?: (event: React.MouseEvent | React.KeyboardEvent) => void;
    closeTimeoutMS?: number;
    style?: {
      content?: React.CSSProperties;
      overlay?: React.CSSProperties;
    };
    contentLabel?: string;
    portalClassName?: string;
    overlayClassName?: string;
    id?: string;
    className?: string | object;
    bodyOpenClassName?: string;
    htmlOpenClassName?: string;
    ariaHideApp?: boolean;
    shouldFocusAfterRender?: boolean;
    shouldCloseOnOverlayClick?: boolean;
    shouldReturnFocusAfterClose?: boolean;
    role?: string;
    parentSelector?: () => HTMLElement;
    aria?: {
      [key: string]: string;
    };
    data?: {
      [key: string]: any;
    };
    children?: React.ReactNode;
  }

  export default class Modal extends React.Component<Props> {}
}
