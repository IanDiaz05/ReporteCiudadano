// src/hooks/useShake.ts

import { useEffect, useRef } from 'react';
import { Accelerometer } from 'expo-sensors';

// Hemos aumentado el umbral para que sea menos sensible.
// Puedes ajustar este valor (ej. entre 20 y 30) según tus pruebas.
const SHAKE_THRESHOLD = 25;

export const useShake = (callback: () => void) => {
  const lastUpdate = useRef(0);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const lastZ = useRef(0);

  useEffect(() => {
    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      const currentTime = Date.now();

      // Limitamos la frecuencia de las comprobaciones a cada 200ms
      if (currentTime - lastUpdate.current > 200) {
        const timeDiff = (currentTime - lastUpdate.current) / 1000;
        lastUpdate.current = currentTime;

        // Calculamos la diferencia de aceleración en cada eje
        const deltaX = x - lastX.current;
        const deltaY = y - lastY.current;
        const deltaZ = z - lastZ.current;

        // Calculamos la magnitud de la aceleración (método más robusto)
        const speed = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ) / timeDiff;

        // Si la velocidad supera el umbral, activamos el callback
        if (speed > SHAKE_THRESHOLD) {
          callback();
        }

        // Actualizamos los valores anteriores para la próxima comprobación
        lastX.current = x;
        lastY.current = y;
        lastZ.current = z;
      }
    });

    // Establecemos un intervalo de actualización. 100ms es un buen balance.
    Accelerometer.setUpdateInterval(100);

    return () => {
      subscription.remove();
    };
  }, [callback]);
};