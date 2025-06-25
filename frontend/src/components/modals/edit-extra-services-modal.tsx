import { useModal } from '@/components/modal-provider';
import { Button } from '@/components/ui/button';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import { useGetExtraServicesQuery } from '@/services/extra-services-api';
import { updateField } from '@/slices/request-slice';
import { useAppDispatch, useAppSelector } from '@/store';
import { type RequestExtraService } from '@/types/request';
import { PlusIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

// Define a temporary interface for available services
interface ServiceItem {
  name: string;
  price: number;
}

export function EditExtraServicesModal() {
  const { close } = useModal();
  const dispatch = useAppDispatch();
  const { data: extraServices } = useGetExtraServicesQuery();
  const { id: requestId, extra_services } = useAppSelector(
    (state) => state.request.request!
  );

  const [customServiceInputValue, setCustomServiceInputValue] =
    useState<string>('');

  const serviceItems: ServiceItem[] =
    extraServices
      ?.filter((service) => service.enabled)
      .map((service) => ({
        name: service.name,
        price: service.price / 100, // Convert cents to dollars for display
      })) || [];

  // Initialize cart with existing request_extra_services if they exist
  const initialCartItems: RequestExtraService[] =
    extra_services?.map((item) => ({
      ...item,
      price: item.price / 100, // Convert cents to dollars for display
    })) || [];

  const [cartItems, setCartItems] =
    useState<RequestExtraService[]>(initialCartItems);

  // Function to add an item to the cart
  function addToCart(item: ServiceItem) {
    const existingItem = cartItems.find(
      (cartItem) => cartItem.name === item.name
    );

    console.log('existingItem', existingItem);

    if (existingItem) {
      // If item already exists in cart, increase quantity
      setCartItems(
        cartItems.map((cartItem) => {
          if (cartItem.name === item.name) {
            return {
              ...cartItem,
              quantity: Number(cartItem.quantity) + 1,
            };
          }
          return cartItem;
        })
      );
    } else {
      // Add new item to cart with quantity 1
      const newItem: RequestExtraService = {
        quantity: 1,
        price: item.price,
        total: item.price,
        name: item.name,
      };
      setCartItems([...cartItems, newItem]);
    }
  }

  // Function to update cart item
  function updateCartItem(
    idx: number,
    field: keyof RequestExtraService,
    value: string
  ) {
    setCartItems(
      cartItems.map((item, index) => {
        if (index === idx) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCustomServiceInputValue(e.target.value);
  }

  function handleAddItem() {
    if (customServiceInputValue) {
      // Create a new custom service item
      const newItem: RequestExtraService = {
        quantity: 1,
        price: 0,
        name: customServiceInputValue,
        total: 0,
      };
      setCartItems([...cartItems, newItem]);
      setCustomServiceInputValue('');
    }
  }

  function handleDeleteItem(id: number) {
    setCartItems(cartItems.filter((_, index) => index !== id));
  }

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Save the extra services to the backend
  const saveExtraServices = () => {
    if (!requestId) return;
    // Map cart items to the format expected by the backend
    const extraServicesPayload = cartItems.map((item) => {
      // Convert dollars to cents for API
      const apiItem = {
        ...item,
        price: Math.round(item.price * 100),
        total: Math.round(item.price * item.quantity * 100),
      };
      return apiItem;
    });
    dispatch(
      updateField({
        extra_services: extraServicesPayload,
        extra_services_total: totalPrice * 100,
      })
    );
    close('editExtraServices');
  };

  return (
    <DialogContent className="sm:max-w-[900px] p-0 max-h-screen flex flex-col">
      <DialogHeader className="flex px-6 pt-6 flex-row items-center justify-between pb-2 text-left">
        <div>
          <DialogTitle>Additional services</DialogTitle>
          <DialogDescription>Request #{requestId}</DialogDescription>
        </div>
        <div className="bg-muted p-2 px-4 rounded-md">
          <div className="text-lg font-semibold">
            Total: ${totalPrice.toFixed(2)}
          </div>
        </div>
      </DialogHeader>

      <div className="flex-1 overflow-y-auto sm:overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 h-full">
          {/* Left Side - Available Items */}
          <ScrollArea className="md:h-[calc(100vh-163px)]">
            <div className="px-4 py-2 space-y-2">
              <CustomServiceInput
                customServiceInputValue={customServiceInputValue}
                handleInputChange={handleInputChange}
                handleAddItem={handleAddItem}
              />
              <AvailableServices
                serviceItems={serviceItems}
                addToCart={addToCart}
              />
            </div>
          </ScrollArea>

          {/* Right Side - Cart Items */}

          <div className="md:px-4 py-2 md:col-span-2">
            <ScrollArea className="md:h-[calc(100vh-163px)] border rounded-md md:p-4 bg-muted shadow-sm">
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr_max-content]">
                <div className="flex items-center border-b p-2 text-muted-foreground text-xs">
                  <p>Name</p>
                </div>
                <div className="flex items-center border-b p-2 text-muted-foreground text-xs">
                  <p>Cost</p>
                </div>
                <div className="flex items-center border-b p-2 text-muted-foreground text-xs">
                  <p>Quantity</p>
                </div>
                <div className="flex items-center border-b p-2 text-muted-foreground text-xs">
                  <p>Total</p>
                </div>
                <div className="flex items-center border-b p-2 text-muted-foreground text-xs">
                  <p className="opacity-0">Actions</p>
                </div>
              </div>
              {cartItems.map((item, idx) => (
                <div
                  className="grid grid-cols-[2fr_1fr_1fr_1fr_max-content]"
                  key={idx}
                >
                  <div className="flex items-center border-b p-2">
                    <Input
                      value={item.name}
                      onChange={(e) =>
                        updateCartItem(idx, 'name', e.target.value)
                      }
                      className="w-full bg-background"
                    />
                  </div>
                  <div className="flex items-center border-b p-2">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) =>
                        updateCartItem(idx, 'price', e.target.value)
                      }
                      className="bg-background"
                    />
                  </div>
                  <div className="flex items-center border-b p-2">
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateCartItem(idx, 'quantity', e.target.value)
                      }
                      className="bg-background"
                    />
                  </div>
                  <div className="flex items-center border-b p-2 text-sm">
                    <p>${(item.price * item.quantity).toFixed(2)}</p>
                  </div>

                  <div className="flex items-center border-b p-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteItem(idx)}
                    >
                      <TrashIcon />
                    </Button>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
      </div>
      <DialogFooter className="px-6 pb-6">
        <DialogClose onClick={() => close('editExtraServices')}>
          Cancel
        </DialogClose>
        <Button type="submit" onClick={saveExtraServices}>
          Save changes
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

function AvailableServices({
  serviceItems,
  addToCart,
}: {
  serviceItems: ServiceItem[];
  addToCart: (item: ServiceItem) => void;
}) {
  const isMobile = useIsMobile();
  return (
    <>
      {isMobile && (
        <Select
          onValueChange={(value) => {
            const selectedItem = serviceItems.find(
              (item) => item.name === value
            );
            if (selectedItem) addToCart(selectedItem);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a service" />
          </SelectTrigger>
          <SelectContent>
            {serviceItems.map((item, index) => (
              <SelectItem key={index} value={item.name}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {!isMobile && (
        <>
          {serviceItems.map((item, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full justify-between group bg-secondary"
              // className="rounded-md group w-full bg-muted px-2 pl-4 justify-between group"
              onClick={() => addToCart(item)}
            >
              <p className="text-sm font-medium">{item.name}</p>
              <div className="size-5 items-center flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400 bg-primary/30 rounded">
                <PlusIcon className="size-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-primary" />
              </div>
            </Button>
          ))}
        </>
      )}
    </>
  );
}

function CustomServiceInput({
  customServiceInputValue,
  handleInputChange,
  handleAddItem,
}: {
  customServiceInputValue: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddItem: () => void;
}) {
  return (
    <div className="relative">
      <Input
        value={customServiceInputValue}
        onChange={handleInputChange}
        placeholder="Custom service"
        className="rounded-md w-full p-2 justify-between group transition-all duration-500"
      />
      <Button
        size="icon"
        className="absolute right-1 top-1 size-7"
        onClick={handleAddItem}
      >
        <PlusIcon />
      </Button>
    </div>
  );
}
