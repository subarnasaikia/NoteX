declare module 'react-katex' {
  import * as React from 'react';

  export interface KatexProps {
    math: string;
    errorColor?: string;
    renderError?: (error: Error) => React.ReactNode;
  }

  export const BlockMath: React.FC<KatexProps>;
  export const InlineMath: React.FC<KatexProps>;
}
