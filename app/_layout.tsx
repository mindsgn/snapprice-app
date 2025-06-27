import { Stack } from 'expo-router';
import { createStore } from 'tinybase';
import * as SQLite from 'expo-sqlite';
import { createExpoSqlitePersister } from 'tinybase/persisters/persister-expo-sqlite';
import {
  Provider,
  useCreatePersister,
  useCreateStore,
} from 'tinybase/ui-react';
import 'react-native-reanimated';
import { DATABASE } from '@/@src/constants/database';
import { useEffect, useState,  } from 'react';
import { Text, View  } from 'react-native';
import * as SnapPriceModule from '@/modules/snap-price-module'; 

const BACKGROUND_TASK_IDENTIFIER = 'background-task';

import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';

TaskManager.defineTask(BACKGROUND_TASK_IDENTIFIER, async () => {
  try {
    const now = Date.now();
    console.log(`Got background task call at date: ${new Date(now).toISOString()}`);
  } catch (error) {
    console.error('Failed to execute the background task:', error);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
  return BackgroundTask.BackgroundTaskResult.Success;
});

async function registerBackgroundTaskAsync() {
  return BackgroundTask.registerTaskAsync(BACKGROUND_TASK_IDENTIFIER);
}

async function unregisterBackgroundTaskAsync() {
  return BackgroundTask.unregisterTaskAsync(BACKGROUND_TASK_IDENTIFIER);
}

const useAndStartPersister = (store: any) =>
  useCreatePersister(
    store,
    (store) => createExpoSqlitePersister(store, SQLite.openDatabaseSync(DATABASE)),
    [],
    (persister) => persister.load().then(persister.startAutoSave)
);

export default function RootLayout() {
  const data = SnapPriceModule.default.hello()
  console.log(data)
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [status, setStatus] = useState<BackgroundTask.BackgroundTaskStatus | null>(null);

  const store = useCreateStore(createStore);
  useAndStartPersister(store);

  const updateAsync = async () => {
    const status = await BackgroundTask.getStatusAsync();
    setStatus(status);
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_TASK_IDENTIFIER);
    setIsRegistered(isRegistered);
  };

  const toggle = async () => {
    //if (!isRegistered) {
      await registerBackgroundTaskAsync();
      await BackgroundTask.triggerTaskWorkerForTestingAsync();
    ///} else {
    //  await unregisterBackgroundTaskAsync();
    //}
    await updateAsync();
  };

  useEffect(() => {
    toggle();
  },[])

  return (
    <Provider store={store}>
      <View style={{
        paddingTop: 60,
        paddingHorizontal: 10,
        backgroundColor: "white"
      }}>
        <Text>
          Background Task Service Availability:{' '}
          <Text>
            {status ? BackgroundTask.BackgroundTaskStatus[status] : null}
          </Text>
        </Text>
      </View>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="item" options={{ headerShown: false, presentation: "modal" }} />
      </Stack>
    </Provider>
  );
}
