import { TachometerDataPoint } from '../types';
import { database } from '../firebaseConfig';

/**
 * A helper function to wrap a promise with a timeout.
 * @param promise The promise to wrap.
 * @param ms The timeout duration in milliseconds.
 * @param timeoutError The error to reject with on timeout.
 * @returns A new promise that races the original promise against the timeout.
 */
const promiseWithTimeout = <T,>(
  promise: Promise<T>,
  ms: number,
  timeoutError = new Error('Operation timed out')
): Promise<T> =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(timeoutError);
    }, ms);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((reason) => {
        clearTimeout(timer);
        reject(reason);
      });
  });

/**
 * Checks if a device node exists in the Firebase Realtime Database.
 * This is used to validate a Device ID before proceeding to the dashboard.
 * @param deviceId The ID of the device to check.
 * @returns A promise that resolves to true if the device exists, false otherwise.
 */
export const checkDeviceExists = async (deviceId: string): Promise<boolean> => {
  console.log(`Checking for existence of device: ${deviceId}`);
  const deviceRef = database.ref(`devices/${deviceId}`);
  try {
    const snapshot = await promiseWithTimeout(
      deviceRef.get(),
      5000, // 5-second timeout
      new Error('Verification timed out. Please check your Firebase configuration and network connection.')
    );
    // FIX: Cast snapshot to 'any' to access the 'exists' method, as its type is inferred as 'unknown'.
    return (snapshot as any).exists();
  } catch (error) {
    console.error("Firebase check error:", error);
    // Re-throw the specific timeout error or a generic one to be handled by the UI
    if (error instanceof Error) {
        throw error;
    }
    throw new Error('Could not verify device existence.');
  }
};

/**
 * Sets the power state of a device by writing to Firebase Realtime Database.
 * The ESP32 should be listening for changes at this location.
 * @param deviceId The ID of the device to control.
 * @param isOn The desired power state (true for on, false for off).
 */
export const setDevicePowerState = async (deviceId: string, isOn: boolean): Promise<void> => {
  console.log(`Setting device ${deviceId} power state to: ${isOn}`);
  const powerStateRef = database.ref(`devices/${deviceId}/is_on`);
  try {
    await powerStateRef.set(isOn);
  } catch (error) {
    console.error("Firebase write error:", error);
    throw new Error("Failed to communicate with the device via the cloud.");
  }
};

/**
 * Subscribes to the live data stream from Firebase for a specific device.
 * It first loads the last 60 data points for historical context, then listens for new data.
 * @param deviceId The ID of the device to monitor.
 * @param callback The function to call with new data points.
 * @returns An unsubscribe function to stop listening to the data stream.
 */
export const startDataStream = (deviceId: string, callback: (data: TachometerDataPoint[]) => void): (() => void) => {
  console.log(`Starting data stream from Firebase for device: ${deviceId}`);
  const dataRef = database.ref(`devices/${deviceId}/data`);

  let listener: any;
  let liveQuery: any;

  // 1. Fetch the last 60 data points to populate the chart initially.
  const initialQuery = dataRef.orderByChild('timestamp').limitToLast(60);
  
  initialQuery.once('value', (snapshot) => {
    let lastKnownTimestamp = 0;
    const initialData: TachometerDataPoint[] = [];

    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const point = childSnapshot.val();
        initialData.push(point);
        lastKnownTimestamp = Math.max(lastKnownTimestamp, point.timestamp);
      });
      // Sort data to ensure it's in chronological order before sending to the UI
      initialData.sort((a, b) => a.timestamp - b.timestamp);
      callback(initialData);
    }

    // 2. After the initial load, listen for new data points.
    // We start listening from a timestamp just after the last known one to avoid duplicates.
    const startTimestamp = lastKnownTimestamp > 0 ? lastKnownTimestamp + 1 : Date.now();
    liveQuery = dataRef.orderByChild('timestamp').startAt(startTimestamp);
    
    listener = liveQuery.on('child_added', (newSnapshot: any) => {
      if (newSnapshot.exists()) {
        const newDataPoint = newSnapshot.val() as TachometerDataPoint;
        callback([newDataPoint]);
      }
    }, (error: Error) => {
      console.error("Firebase read error:", error);
    });

  }, (error: Error) => {
    console.error("Firebase initial read error:", error);
  });

  // Return a function to clean up the live data listener.
  return () => {
    console.log(`Stopping data stream for device: ${deviceId}`);
    if (liveQuery && listener) {
        liveQuery.off('child_added', listener);
    }
  };
};