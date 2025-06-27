import { NativeModule, requireNativeModule } from 'expo';

import { SnapPriceModuleEvents } from './SnapPriceModule.types';

declare class SnapPriceModule extends NativeModule<SnapPriceModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<SnapPriceModule>('SnapPriceModule');
