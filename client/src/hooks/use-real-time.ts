import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export function useRealTime() {
  const wsRef = useRef<WebSocket | null>(null);
  const queryClient = useQueryClient();

  const connect = useCallback(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = () => {
      console.log('WebSocket connected');
      // Request initial data
      wsRef.current?.send(JSON.stringify({ type: 'REQUEST_INITIAL_DATA' }));
    };

    wsRef.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        switch (message.type) {
          case 'INITIAL_DATA':
            // Update all queries with fresh data
            queryClient.setQueryData(['/api/patients'], message.data.patients);
            queryClient.setQueryData(['/api/treatments'], message.data.treatments);
            queryClient.setQueryData(['/api/appointments'], message.data.appointments);
            queryClient.setQueryData(['/api/patient-visits'], message.data.patientVisits);
            queryClient.setQueryData(['/api/treatment-outcomes'], message.data.treatmentOutcomes);
            break;

          case 'NEW_PATIENT':
            // Invalidate patients query to trigger refetch
            queryClient.invalidateQueries({ queryKey: ['/api/patients'] });
            break;

          default:
            console.warn('Unknown message type:', message.type);
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    };

    wsRef.current.onclose = () => {
      console.log('WebSocket disconnected, attempting to reconnect...');
      setTimeout(connect, 3000);
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }, [queryClient]);

  useEffect(() => {
    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  return wsRef.current;
}
