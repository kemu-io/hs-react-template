import createService, { DataType } from '@kemu-io/hs';
import { CustomServiceState } from './types/service_t.js';

const service = new createService<CustomServiceState>();
await service.start();

service.onParentEvent(async (event, context) => {
  console.log('Parent event:', event, context);
  return context.setOutputs([
    {
      name: 'output',
      type: DataType.ImageData,
      value: event.data.value
    }
  ]);
});
