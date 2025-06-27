import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './SnapPriceModule.types';

type SnapPriceModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class SnapPriceModule extends NativeModule<SnapPriceModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(SnapPriceModule, 'SnapPriceModule');
