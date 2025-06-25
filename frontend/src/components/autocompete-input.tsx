import { useEffect, useRef } from 'react';
import { loader } from '@/lib/maps-loader';
import { Input } from './ui/input';
import type { Address } from '@/types/request';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onAddressSelect: (data: Partial<Address>) => void;
}

export const AutocompleteInput = ({
  onAddressSelect,
  ...props
}: InputProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    let autocomplete: google.maps.places.Autocomplete;

    const initAutocomplete = async () => {
      await loader.importLibrary('places');

      if (inputRef.current && window.google) {
        autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
          types: ['address'],
          componentRestrictions: { country: 'us' },
          fields: ['address_components', 'geometry'],
        });

        autocompleteRef.current = autocomplete;

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          const addressComponents =
            place.address_components as google.maps.GeocoderAddressComponent[];

          let street = '';
          let city = '';
          let state = '';
          let zip = '';

          for (const component of addressComponents) {
            const types = component.types[0];
            switch (types) {
              case 'premise':
                street = component.long_name;
                break;
              case 'street_number':
                street = component.long_name;
                break;
              case 'route':
                street += ' ' + component.long_name;
                break;
              case 'locality':
                city = component.long_name;
                break;
              case 'administrative_area_level_1':
                state = component.short_name;
                break;
              case 'postal_code':
                zip = component.long_name;
                break;
            }
          }

          // const url = place.url;
          const location = place.geometry?.location;

          const data: Partial<Address> = {
            street,
            city,
            state,
            zip,
            location: {
              lat: location?.lat()!,
              lng: location?.lng()!,
            },
          };

          onAddressSelect(data);
        });
      }
    };

    initAutocomplete().catch((error) =>
      console.error('Error loading Google Maps:', error)
    );

    return () => {
      const ele = document.querySelectorAll('.pac-container');
      for (const e of ele) {
        e.remove();
      }
    };
  }, []);

  return <Input ref={inputRef} {...props} />;
};
