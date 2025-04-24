
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, RefreshCw, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { usePaymentMethods } from "@/hooks/billing/usePaymentMethods";
import { supabase } from "@/integrations/supabase/client";

interface PaymentMethodProps {
  brand: string;
  lastFour: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault?: boolean;
}

const PaymentMethod = ({ brand, lastFour, expiryMonth, expiryYear, isDefault }: PaymentMethodProps) => {
  // Format expiry date as MM/YYYY
  const expiryDate = `${expiryMonth.toString().padStart(2, '0')}/${expiryYear}`;
  
  // Capitalize first letter of card brand
  const formattedBrand = brand.charAt(0).toUpperCase() + brand.slice(1);

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="flex items-center justify-between p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <CreditCard className="h-6 w-6 text-gray-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium">{formattedBrand} ending in {lastFour}</h3>
            <p className="text-sm text-gray-500">Expires {expiryDate}</p>
          </div>
        </div>
        {isDefault && (
          <span className="text-sm font-medium text-gray-600">Default</span>
        )}
      </CardContent>
    </Card>
  );
};

export function PaymentMethodSection() {
  const { 
    paymentMethods, 
    defaultPaymentMethodId, 
    isLoading,
    error,
    fetchPaymentMethods
  } = usePaymentMethods();
  
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  const handleRefresh = () => {
    fetchPaymentMethods();
    toast.info("Refreshing payment methods...");
  };

  const handleUpdateCard = async () => {
    try {
      setIsUpdating(true);
      
      // Get current URL as return URL
      const returnUrl = window.location.href;
      
      const { data, error } = await supabase.functions.invoke('update-payment-method', {
        body: { returnUrl }
      });
      
      if (error) throw error;
      
      if (data?.url) {
        // Redirect to Stripe checkout to update payment method
        window.location.href = data.url;
      } else {
        throw new Error("No URL returned");
      }
    } catch (error) {
      console.error("Error starting payment method update:", error);
      toast.error("Failed to start payment method update");
      setIsUpdating(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Payment Method</h2>
          <p className="text-muted-foreground">Your payment information</p>
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={handleRefresh} 
          disabled={isLoading || isUpdating}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <RefreshCw className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : paymentMethods.length > 0 ? (
          // Show actual payment methods and update button
          <div className="space-y-4">
            {paymentMethods.map(method => (
              <PaymentMethod
                key={method.id}
                brand={method.card.brand}
                lastFour={method.card.last4}
                expiryMonth={method.card.exp_month}
                expiryYear={method.card.exp_year}
                isDefault={method.id === defaultPaymentMethodId}
              />
            ))}
            
            <div className="mt-4">
              <Button 
                variant="outline" 
                onClick={handleUpdateCard}
                disabled={isUpdating}
                className="w-full"
              >
                {isUpdating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Update Payment Method
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          // Show message when no payment methods found with add button
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              <div className="mb-4 mt-2 rounded-full bg-gray-100 p-3">
                <CreditCard className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium">No payment methods found</h3>
              <p className="text-sm text-gray-500 mb-4">
                Add a payment method to manage your subscription
              </p>
              <Button 
                onClick={handleUpdateCard}
                disabled={isUpdating}
                className="w-full"
              >
                {isUpdating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Payment Method
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
